import { BadRequestException, NotFoundException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";

import { PrismaService } from "../prisma/prisma.service";
import { ContactsService } from "./contacts.service";
import { ContactFiltersDto, CreateContactDto, UpdateContactDto } from "./dto";

describe("ContactsService", () => {
  let service: ContactsService;

  // Мок данные
  const mockUserId = "user123";
  const mockContactUserId = "contact456";
  const mockContactId = "contact789";

  const mockUser = {
    id: mockContactUserId,
    name: "Test Contact",
    email: "contact@example.com",
  };

  const mockContact = {
    id: mockContactId,
    userId: mockUserId,
    contactUserId: mockContactUserId,
    notes: "Test notes",
    tags: ["работа", "коллега"],
    isActive: true,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
    contactUser: mockUser,
  };

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
    },
    contact: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      count: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContactsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<ContactsService>(ContactsService);

    // Очищаем моки перед каждым тестом
    jest.clearAllMocks();
  });

  it("должен быть определен", () => {
    expect(service).toBeDefined();
  });

  describe("create", () => {
    const createContactDto: CreateContactDto = {
      contactUserId: mockContactUserId,
      notes: "Test notes",
      tags: ["работа"],
    };

    it("должен успешно создать контакт", async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      mockPrismaService.contact.findUnique.mockResolvedValue(null);
      mockPrismaService.contact.create.mockResolvedValue(mockContact);

      const result = await service.create(mockUserId, createContactDto);

      expect(result).toEqual({
        id: mockContact.id,
        userId: mockContact.userId,
        contactUserId: mockContact.contactUserId,
        notes: mockContact.notes,
        tags: mockContact.tags,
        isActive: mockContact.isActive,
        createdAt: mockContact.createdAt,
        updatedAt: mockContact.updatedAt,
        contactUser: mockContact.contactUser,
      });

      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: mockContactUserId },
      });
      expect(mockPrismaService.contact.findUnique).toHaveBeenCalledWith({
        where: {
          userId_contactUserId: {
            userId: mockUserId,
            contactUserId: mockContactUserId,
          },
        },
      });
      expect(mockPrismaService.contact.create).toHaveBeenCalledWith({
        data: {
          userId: mockUserId,
          contactUserId: mockContactUserId,
          notes: createContactDto.notes,
          tags: createContactDto.tags,
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
    });

    it("должен выбросить ошибку при попытке добавить самого себя", async () => {
      await expect(
        service.create(mockUserId, { ...createContactDto, contactUserId: mockUserId }),
      ).rejects.toThrow(BadRequestException);
    });

    it("должен выбросить ошибку если пользователь не найден", async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.create(mockUserId, createContactDto)).rejects.toThrow(NotFoundException);
    });

    it("должен выбросить ошибку если контакт уже существует", async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      mockPrismaService.contact.findUnique.mockResolvedValue(mockContact);

      await expect(service.create(mockUserId, createContactDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it("должен выбросить ошибку если контакт был удален ранее", async () => {
      const deletedContact = { ...mockContact, isActive: false };
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      mockPrismaService.contact.findUnique.mockResolvedValue(deletedContact);

      await expect(service.create(mockUserId, createContactDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe("findAll", () => {
    const filters: ContactFiltersDto = {
      page: 1,
      limit: 10,
      search: "test",
      tags: ["работа"],
      isActive: true,
      sortBy: "createdAt",
      sortOrder: "desc",
    };

    it("должен вернуть список контактов с метаданными", async () => {
      const mockContacts = [mockContact];
      const mockTotal = 1;

      mockPrismaService.contact.findMany.mockResolvedValue(mockContacts);
      mockPrismaService.contact.count.mockResolvedValue(mockTotal);

      const result = await service.findAll(mockUserId, filters);

      expect(result).toEqual({
        data: [
          {
            id: mockContact.id,
            userId: mockContact.userId,
            contactUserId: mockContact.contactUserId,
            notes: mockContact.notes,
            tags: mockContact.tags,
            isActive: mockContact.isActive,
            createdAt: mockContact.createdAt,
            updatedAt: mockContact.updatedAt,
            contactUser: mockContact.contactUser,
          },
        ],
        meta: {
          page: 1,
          limit: 10,
          total: 1,
          totalPages: 1,
          hasNext: false,
          hasPrev: false,
        },
      });

      expect(mockPrismaService.contact.findMany).toHaveBeenCalledWith({
        where: {
          userId: mockUserId,
          isActive: true,
          tags: { hasSome: ["работа"] },
          contactUser: {
            OR: [
              { name: { contains: "test", mode: "insensitive" } },
              { email: { contains: "test", mode: "insensitive" } },
            ],
          },
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
        orderBy: { createdAt: "desc" },
        skip: 0,
        take: 10,
      });
    });

    it("должен правильно рассчитывать пагинацию", async () => {
      const filtersPage2 = { ...filters, page: 2, limit: 5 };
      mockPrismaService.contact.findMany.mockResolvedValue([]);
      mockPrismaService.contact.count.mockResolvedValue(12);

      const result = await service.findAll(mockUserId, filtersPage2);

      expect(result.meta).toEqual({
        page: 2,
        limit: 5,
        total: 12,
        totalPages: 3,
        hasNext: true,
        hasPrev: true,
      });

      expect(mockPrismaService.contact.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 5, // (page - 1) * limit = (2 - 1) * 5 = 5
          take: 5,
        }),
      );
    });
  });

  describe("findOne", () => {
    it("должен вернуть контакт по ID", async () => {
      mockPrismaService.contact.findFirst.mockResolvedValue(mockContact);

      const result = await service.findOne(mockUserId, mockContactId);

      expect(result).toEqual({
        id: mockContact.id,
        userId: mockContact.userId,
        contactUserId: mockContact.contactUserId,
        notes: mockContact.notes,
        tags: mockContact.tags,
        isActive: mockContact.isActive,
        createdAt: mockContact.createdAt,
        updatedAt: mockContact.updatedAt,
        contactUser: mockContact.contactUser,
      });

      expect(mockPrismaService.contact.findFirst).toHaveBeenCalledWith({
        where: {
          id: mockContactId,
          userId: mockUserId,
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
    });

    it("должен выбросить ошибку если контакт не найден", async () => {
      mockPrismaService.contact.findFirst.mockResolvedValue(null);

      await expect(service.findOne(mockUserId, mockContactId)).rejects.toThrow(NotFoundException);
    });
  });

  describe("update", () => {
    const updateContactDto: UpdateContactDto = {
      notes: "Updated notes",
      tags: ["работа", "друг"],
    };

    it("должен успешно обновить контакт", async () => {
      const updatedContact = { ...mockContact, ...updateContactDto };

      mockPrismaService.contact.findFirst.mockResolvedValue(mockContact);
      mockPrismaService.contact.update.mockResolvedValue(updatedContact);

      const result = await service.update(mockUserId, mockContactId, updateContactDto);

      expect(result.notes).toBe(updateContactDto.notes);
      expect(result.tags).toEqual(updateContactDto.tags);

      expect(mockPrismaService.contact.update).toHaveBeenCalledWith({
        where: { id: mockContactId },
        data: {
          notes: updateContactDto.notes,
          tags: updateContactDto.tags,
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
    });

    it("должен выбросить ошибку если контакт не найден", async () => {
      mockPrismaService.contact.findFirst.mockResolvedValue(null);

      await expect(service.update(mockUserId, mockContactId, updateContactDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe("remove", () => {
    it("должен деактивировать контакт", async () => {
      const deactivatedContact = { ...mockContact, isActive: false };

      mockPrismaService.contact.findFirst.mockResolvedValue(mockContact);
      mockPrismaService.contact.update.mockResolvedValue(deactivatedContact);

      const result = await service.remove(mockUserId, mockContactId);

      expect(result.isActive).toBe(false);

      expect(mockPrismaService.contact.update).toHaveBeenCalledWith({
        where: { id: mockContactId },
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
    });

    it("должен выбросить ошибку если контакт не найден", async () => {
      mockPrismaService.contact.findFirst.mockResolvedValue(null);

      await expect(service.remove(mockUserId, mockContactId)).rejects.toThrow(NotFoundException);
    });
  });

  describe("activate", () => {
    it("должен активировать контакт", async () => {
      const activatedContact = { ...mockContact, isActive: true };

      mockPrismaService.contact.findFirst.mockResolvedValue(mockContact);
      mockPrismaService.contact.update.mockResolvedValue(activatedContact);

      const result = await service.activate(mockUserId, mockContactId);

      expect(result.isActive).toBe(true);

      expect(mockPrismaService.contact.update).toHaveBeenCalledWith({
        where: { id: mockContactId },
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
    });
  });

  describe("search", () => {
    it("должен использовать метод findAll для поиска", async () => {
      const filters: ContactFiltersDto = { search: "test" };
      const mockResult = {
        data: [mockContact],
        meta: {
          page: 1,
          limit: 10,
          total: 1,
          totalPages: 1,
          hasNext: false,
          hasPrev: false,
        },
      };

      mockPrismaService.contact.findMany.mockResolvedValue([mockContact]);
      mockPrismaService.contact.count.mockResolvedValue(1);

      const result = await service.search(mockUserId, filters);

      expect(result).toEqual(mockResult);
    });
  });

  describe("findArchived", () => {
    it("должен вернуть только деактивированные контакты", async () => {
      const filters: ContactFiltersDto = { page: 1, limit: 10 };

      mockPrismaService.contact.findMany.mockResolvedValue([]);
      mockPrismaService.contact.count.mockResolvedValue(0);

      await service.findArchived(mockUserId, filters);

      expect(mockPrismaService.contact.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            isActive: false,
          }),
        }),
      );
    });
  });
});
