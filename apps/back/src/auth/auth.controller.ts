import { User } from "@generated/prisma";
import { Body, Controller, Get, Post } from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";

import { AuthService } from "./auth.service";
import { GetUser } from "./decorators/get-user.decorator";
import { Public } from "./decorators/public.decorator";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";

@ApiTags("Аутентификация")
@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post("register")
  @ApiOperation({
    summary: "Регистрация нового пользователя",
    description: "Создает новый аккаунт пользователя в системе",
  })
  @ApiBody({
    type: RegisterDto,
    description: "Данные для регистрации пользователя",
  })
  @ApiCreatedResponse({
    description: "Пользователь успешно зарегистрирован",
    schema: {
      type: "object",
      properties: {
        user: {
          type: "object",
          properties: {
            id: { type: "string" },
            email: { type: "string" },
            name: { type: "string" },
            role: { type: "string" },
          },
        },
        access_token: { type: "string" },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: "Некорректные данные для регистрации",
  })
  @ApiResponse({
    status: 409,
    description: "Пользователь с таким email уже существует",
  })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Public()
  @Post("login")
  @ApiOperation({
    summary: "Авторизация пользователя",
    description: "Аутентифицирует пользователя и возвращает JWT токен",
  })
  @ApiBody({
    type: LoginDto,
    description: "Данные для входа в систему",
  })
  @ApiOkResponse({
    description: "Успешная авторизация",
    schema: {
      type: "object",
      properties: {
        user: {
          type: "object",
          properties: {
            id: { type: "string" },
            email: { type: "string" },
            name: { type: "string" },
            role: { type: "string" },
          },
        },
        access_token: { type: "string" },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: "Неверные учетные данные",
  })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get("me")
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Получение информации о текущем пользователе",
    description: "Возвращает данные авторизованного пользователя",
  })
  @ApiOkResponse({
    description: "Информация о пользователе",
    schema: {
      type: "object",
      properties: {
        id: { type: "string" },
        email: { type: "string" },
        name: { type: "string" },
        role: { type: "string" },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: "Пользователь не авторизован",
  })
  async getMe(@GetUser() user: User) {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
  }
}
