import { User } from "@generated/prisma";
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";

import { GetUser } from "../auth/decorators/get-user.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { ContactsService } from "./contacts.service";
import { ContactFiltersDto, ContactResponseDto, CreateContactDto, UpdateContactDto } from "./dto";
import { ContactEntity } from "./entities";

@ApiTags("contacts")
@Controller("contacts")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  /**
   * Создание нового контакта
   */
  @Post()
  @ApiOperation({
    summary: "Создать новый контакт",
    description: "Добавляет нового пользователя в список контактов текущего пользователя",
  })
  @ApiResponse({
    status: 201,
    description: "Контакт успешно создан",
    type: ContactEntity,
  })
  @ApiResponse({
    status: 400,
    description: "Некорректные данные или контакт уже существует",
  })
  @ApiResponse({
    status: 404,
    description: "Пользователь для добавления в контакты не найден",
  })
  async create(
    @GetUser() user: User,
    @Body() createContactDto: CreateContactDto,
  ): Promise<ContactEntity> {
    return this.contactsService.create(user.id, createContactDto);
  }

  /**
   * Поиск контактов с расширенными возможностями
   */
  @Get("search")
  @ApiOperation({
    summary: "Поиск контактов",
    description: "Расширенный поиск контактов с пагинацией и фильтрацией",
  })
  @ApiQuery({
    name: "page",
    required: false,
    description: "Номер страницы",
    example: 1,
  })
  @ApiQuery({
    name: "limit",
    required: false,
    description: "Количество элементов на странице",
    example: 10,
  })
  @ApiQuery({
    name: "search",
    required: false,
    description: "Текст для поиска",
    example: "Иван",
  })
  @ApiQuery({
    name: "tags",
    required: false,
    description: "Фильтр по тегам",
    example: ["работа"],
  })
  @ApiQuery({
    name: "isActive",
    required: false,
    description: "Фильтр по статусу активности",
    example: true,
  })
  @ApiResponse({
    status: 200,
    description: "Результаты поиска",
    type: ContactResponseDto,
  })
  async search(
    @GetUser() user: User,
    @Query() filters: ContactFiltersDto,
  ): Promise<ContactResponseDto> {
    return this.contactsService.search(user.id, filters);
  }

  /**
   * Получение архивированных контактов
   */
  @Get("archived")
  @ApiOperation({
    summary: "Получить архивированные контакты",
    description: "Возвращает список деактивированных контактов",
  })
  @ApiQuery({
    name: "page",
    required: false,
    description: "Номер страницы",
    example: 1,
  })
  @ApiQuery({
    name: "limit",
    required: false,
    description: "Количество элементов на странице",
    example: 10,
  })
  @ApiResponse({
    status: 200,
    description: "Список архивированных контактов",
    type: ContactResponseDto,
  })
  async findArchived(
    @GetUser() user: User,
    @Query() filters: ContactFiltersDto,
  ): Promise<ContactResponseDto> {
    return this.contactsService.findArchived(user.id, filters);
  }

  /**
   * Получение списка активных контактов
   */
  @Get()
  @ApiOperation({
    summary: "Получить список контактов",
    description: "Возвращает список активных контактов с пагинацией и фильтрацией",
  })
  @ApiQuery({
    name: "page",
    required: false,
    description: "Номер страницы (начиная с 1)",
    example: 1,
  })
  @ApiQuery({
    name: "limit",
    required: false,
    description: "Количество элементов на странице",
    example: 10,
  })
  @ApiQuery({
    name: "search",
    required: false,
    description: "Поиск по имени или email пользователя",
    example: "Иван",
  })
  @ApiQuery({
    name: "tags",
    required: false,
    description: "Фильтр по тегам (можно указать несколько)",
    example: ["работа", "друг"],
  })
  @ApiQuery({
    name: "sortBy",
    required: false,
    description: "Сортировка",
    enum: ["name", "createdAt", "updatedAt"],
    example: "createdAt",
  })
  @ApiQuery({
    name: "sortOrder",
    required: false,
    description: "Порядок сортировки",
    enum: ["asc", "desc"],
    example: "desc",
  })
  @ApiResponse({
    status: 200,
    description: "Список контактов получен успешно",
    type: ContactResponseDto,
  })
  async findAll(
    @GetUser() user: User,
    @Query() filters: ContactFiltersDto,
  ): Promise<ContactResponseDto> {
    // Принудительно устанавливаем isActive в true для активных контактов
    const activeFilters = { ...filters, isActive: true };
    return this.contactsService.findAll(user.id, activeFilters);
  }

  /**
   * Получение контакта по ID
   */
  @Get(":id")
  @ApiOperation({
    summary: "Получить контакт по ID",
    description: "Возвращает информацию о конкретном контакте",
  })
  @ApiParam({
    name: "id",
    description: "ID контакта",
    example: "cm456def789ghi012",
  })
  @ApiResponse({
    status: 200,
    description: "Контакт найден",
    type: ContactEntity,
  })
  @ApiResponse({
    status: 404,
    description: "Контакт не найден",
  })
  async findOne(@GetUser() user: User, @Param("id") id: string): Promise<ContactEntity> {
    return this.contactsService.findOne(user.id, id);
  }

  /**
   * Обновление контакта
   */
  @Put(":id")
  @ApiOperation({
    summary: "Обновить контакт",
    description: "Обновляет заметки и теги контакта",
  })
  @ApiParam({
    name: "id",
    description: "ID контакта",
    example: "cm456def789ghi012",
  })
  @ApiResponse({
    status: 200,
    description: "Контакт успешно обновлен",
    type: ContactEntity,
  })
  @ApiResponse({
    status: 404,
    description: "Контакт не найден",
  })
  async update(
    @GetUser() user: User,
    @Param("id") id: string,
    @Body() updateContactDto: UpdateContactDto,
  ): Promise<ContactEntity> {
    return this.contactsService.update(user.id, id, updateContactDto);
  }

  /**
   * Soft delete контакта (деактивация)
   */
  @Delete(":id")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Удалить контакт",
    description: "Деактивирует контакт (soft delete). Контакт можно будет восстановить.",
  })
  @ApiParam({
    name: "id",
    description: "ID контакта",
    example: "cm456def789ghi012",
  })
  @ApiResponse({
    status: 200,
    description: "Контакт успешно деактивирован",
    type: ContactEntity,
  })
  @ApiResponse({
    status: 404,
    description: "Контакт не найден",
  })
  async remove(@GetUser() user: User, @Param("id") id: string): Promise<ContactEntity> {
    return this.contactsService.remove(user.id, id);
  }

  /**
   * Восстановление контакта (активация)
   */
  @Patch(":id/activate")
  @ApiOperation({
    summary: "Восстановить контакт",
    description: "Активирует ранее деактивированный контакт",
  })
  @ApiParam({
    name: "id",
    description: "ID контакта",
    example: "cm456def789ghi012",
  })
  @ApiResponse({
    status: 200,
    description: "Контакт успешно восстановлен",
    type: ContactEntity,
  })
  @ApiResponse({
    status: 404,
    description: "Контакт не найден",
  })
  async activate(@GetUser() user: User, @Param("id") id: string): Promise<ContactEntity> {
    return this.contactsService.activate(user.id, id);
  }
}
