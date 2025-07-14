import { Contact } from "@generated/prisma";
import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";

import { PrismaService } from "../prisma/prisma.service";
import {
  ContactFiltersDto,
  ContactResponseDto,
  CreateContactDto,
  PaginationMeta,
  UpdateContactDto,
} from "./dto";
import { ContactEntity } from "./entities";

@Injectable()
export class ContactsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Создание нового контакта
   */
  async create(userId: string, createContactDto: CreateContactDto): Promise<ContactEntity> {
    // Проверяем, что пользователь не добавляет сам себя
    if (userId === createContactDto.contactUserId) {
      throw new BadRequestException("Нельзя добавить самого себя в контакты");
    }

    // Проверяем, что контактный пользователь существует
    const contactUser = await this.prisma.user.findUnique({
      where: { id: createContactDto.contactUserId },
    });

    if (!contactUser) {
      throw new NotFoundException("Пользователь для добавления в контакты не найден");
    }

    // Проверяем, что контакт еще не существует или был удален
    const existingContact = await this.prisma.contact.findUnique({
      where: {
        userId_contactUserId: {
          userId,
          contactUserId: createContactDto.contactUserId,
        },
      },
    });

    if (existingContact) {
      if (existingContact.isActive) {
        throw new BadRequestException("Контакт уже существует");
      } else {
        throw new NotFoundException("Контакт был удален ранее");
      }
    }

    // Создаем контакт
    const contact = await this.prisma.contact.create({
      data: {
        userId,
        contactUserId: createContactDto.contactUserId,
        notes: createContactDto.notes,
        tags: createContactDto.tags || [],
      },
      include: {
        contactUser: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return this.mapToContactEntity(contact);
  }

  /**
   * Получение списка контактов с фильтрацией и пагинацией
   */
  async findAll(userId: string, filters: ContactFiltersDto): Promise<ContactResponseDto> {
    const {
      page = 1,
      limit = 10,
      search,
      tags,
      isActive,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = filters;

    const skip = (page - 1) * limit;

    // Формируем условия WHERE
    const where = {
      userId,
      ...(isActive !== undefined && { isActive }),
      ...(tags && tags.length > 0 && { tags: { hasSome: tags } }),
      ...(search && {
        contactUser: {
          OR: [
            { name: { contains: search, mode: "insensitive" as const } },
            { email: { contains: search, mode: "insensitive" as const } },
          ],
        },
      }),
    };

    // Формируем сортировку
    const orderBy = {} as Record<string, unknown>;
    if (sortBy === "name") {
      orderBy.contactUser = { name: sortOrder };
    } else {
      orderBy[sortBy] = sortOrder;
    }

    // Получаем данные
    const [contacts, total] = await Promise.all([
      this.prisma.contact.findMany({
        where,
        include: {
          contactUser: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy,
        skip,
        take: limit,
      }),
      this.prisma.contact.count({ where }),
    ]);

    // Формируем метаданные пагинации
    const totalPages = Math.ceil(total / limit);
    const meta: PaginationMeta = {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    };

    return {
      data: contacts.map((contact) => this.mapToContactEntity(contact)),
      meta,
    };
  }

  /**
   * Получение контакта по ID
   */
  async findOne(userId: string, contactId: string): Promise<ContactEntity> {
    const contact = await this.prisma.contact.findFirst({
      where: {
        id: contactId,
        userId,
      },
      include: {
        contactUser: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!contact) {
      throw new NotFoundException("Контакт не найден");
    }

    return this.mapToContactEntity(contact);
  }

  /**
   * Обновление контакта
   */
  async update(
    userId: string,
    contactId: string,
    updateContactDto: UpdateContactDto,
  ): Promise<ContactEntity> {
    // Проверяем, что контакт существует и принадлежит пользователю
    const existingContact = await this.prisma.contact.findFirst({
      where: {
        id: contactId,
        userId,
      },
    });

    if (!existingContact) {
      throw new NotFoundException("Контакт не найден");
    }

    // Обновляем контакт
    const contact = await this.prisma.contact.update({
      where: { id: contactId },
      data: {
        ...(updateContactDto.notes !== undefined && { notes: updateContactDto.notes }),
        ...(updateContactDto.tags !== undefined && { tags: updateContactDto.tags }),
      },
      include: {
        contactUser: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return this.mapToContactEntity(contact);
  }

  /**
   * Soft delete контакта (деактивация)
   */
  async remove(userId: string, contactId: string): Promise<ContactEntity> {
    // Проверяем, что контакт существует и принадлежит пользователю
    const existingContact = await this.prisma.contact.findFirst({
      where: {
        id: contactId,
        userId,
      },
    });

    if (!existingContact) {
      throw new NotFoundException("Контакт не найден");
    }

    // Деактивируем контакт
    const contact = await this.prisma.contact.update({
      where: { id: contactId },
      data: { isActive: false },
      include: {
        contactUser: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return this.mapToContactEntity(contact);
  }

  /**
   * Восстановление контакта (активация)
   */
  async activate(userId: string, contactId: string): Promise<ContactEntity> {
    // Проверяем, что контакт существует и принадлежит пользователю
    const existingContact = await this.prisma.contact.findFirst({
      where: {
        id: contactId,
        userId,
      },
    });

    if (!existingContact) {
      throw new NotFoundException("Контакт не найден");
    }

    // Активируем контакт
    const contact = await this.prisma.contact.update({
      where: { id: contactId },
      data: { isActive: true },
      include: {
        contactUser: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return this.mapToContactEntity(contact);
  }

  /**
   * Поиск контактов с расширенными возможностями
   */
  async search(userId: string, filters: ContactFiltersDto): Promise<ContactResponseDto> {
    // Используем основной метод findAll, так как он уже поддерживает все нужные фильтры
    return this.findAll(userId, filters);
  }

  /**
   * Получение архивированных контактов
   */
  async findArchived(userId: string, filters: ContactFiltersDto): Promise<ContactResponseDto> {
    // Принудительно устанавливаем isActive в false для поиска архивированных
    const archivedFilters = { ...filters, isActive: false };
    return this.findAll(userId, archivedFilters);
  }

  /**
   * Приватный метод для преобразования данных в ContactEntity
   */
  private mapToContactEntity(
    contact: Contact & { contactUser: { id: string; name: string | null; email: string } | null },
  ): ContactEntity {
    return {
      id: contact.id,
      userId: contact.userId,
      contactUserId: contact.contactUserId,
      notes: contact.notes,
      tags: contact.tags,
      isActive: contact.isActive,
      createdAt: contact.createdAt,
      updatedAt: contact.updatedAt,
      contactUser: contact.contactUser
        ? {
            id: contact.contactUser.id,
            name: contact.contactUser.name,
            email: contact.contactUser.email,
          }
        : undefined,
    };
  }
}
