# Система авторизации Whitebox

## Обзор

Whitebox использует современную систему JWT-авторизации с хешированием паролей через bcrypt. Система предоставляет безопасную аутентификацию и авторизацию пользователей с поддержкой ролей.

## Архитектура

### Технологии

- **JWT** - для создания и верификации токенов доступа
- **bcrypt** - для хеширования паролей
- **Passport.js** - для стратегий аутентификации
- **class-validator** - для валидации входных данных
- **NestJS Guards** - для защиты роутов

### Роли пользователей

```typescript
enum UserRole {
  USER = "USER",
  ADMIN = "ADMIN",
}
```

## API Эндпоинты

### POST /auth/register

Регистрация нового пользователя.

**Тело запроса:**

```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

**Ответ:**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "role": "USER",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### POST /auth/login

Вход в систему.

**Тело запроса:**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Ответ:**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "role": "USER",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### GET /auth/me

Получение информации о текущем пользователе.

**Заголовки:**

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Ответ:**

```json
{
  "id": 1,
  "email": "user@example.com",
  "name": "John Doe",
  "role": "USER",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

## Защита роутов

### Глобальная защита

По умолчанию все роуты защищены JWT Guard. Для создания публичных роутов используйте декоратор `@Public()`:

```typescript
@Public()
@Get('health')
getHealth() {
  return { status: 'ok' };
}
```

### Получение пользователя в контроллере

```typescript
@Get('profile')
getProfile(@GetUser() user: User) {
  return user;
}
```

## Структура модулей

```
src/
├── auth/
│   ├── auth.controller.ts     # Эндпоинты авторизации
│   ├── auth.service.ts        # Логика авторизации
│   ├── auth.module.ts         # Модуль авторизации
│   ├── decorators/
│   │   ├── public.decorator.ts    # @Public() декоратор
│   │   └── get-user.decorator.ts  # @GetUser() декоратор
│   ├── dto/
│   │   ├── login.dto.ts       # DTO для входа
│   │   └── register.dto.ts    # DTO для регистрации
│   ├── guards/
│   │   └── jwt-auth.guard.ts  # JWT Guard
│   └── strategies/
│       └── jwt.strategy.ts    # JWT стратегия
└── user/
    ├── user.service.ts        # Сервис пользователей
    └── user.module.ts         # Модуль пользователей
```

## Настройка JWT

JWT настраивается через переменные окружения:

```env
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d
```

## Тестовые данные

После выполнения `npm run db:seed` будут созданы следующие пользователи:

### Администратор

- **Email:** admin@example.com
- **Пароль:** admin123
- **Роль:** ADMIN

### Обычные пользователи

- **Email:** alice@example.com, bob@example.com, charlie@example.com
- **Пароль:** password123
- **Роль:** USER

## Тестирование

### Запуск тестов

```bash
# Все тесты авторизации
npm run test:auth

# Все тесты
npm test
```

### HTTP файлы для ручного тестирования

В папке `src/auth/` находится файл `auth.http` с готовыми запросами для тестирования API.

### Примеры запросов

```http
### Регистрация
POST http://localhost:3000/auth/register
Content-Type: application/json

{
  "email": "newuser@example.com",
  "password": "password123",
  "name": "New User"
}

### Вход
POST http://localhost:3000/auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "admin123"
}

### Получение профиля
GET http://localhost:3000/auth/me
Authorization: Bearer {{access_token}}
```

## Безопасность

### Хеширование паролей

Пароли хешируются с помощью bcrypt с salt rounds = 10:

```typescript
const hashedPassword = await bcrypt.hash(password, 10);
```

### JWT токены

- Время жизни: 7 дней (настраивается)
- Алгоритм: HS256
- Полезная нагрузка: `{ sub: userId, email: userEmail }`

### Валидация

Входные данные валидируются с помощью class-validator:

```typescript
class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  password: string;
}
```

## Обработка ошибок

### Коды ошибок

- **400** - Неверные данные запроса
- **401** - Неавторизован / неверные учетные данные
- **403** - Доступ запрещен
- **409** - Пользователь уже существует

### Примеры ошибок

```json
{
  "message": "Пользователь с таким email уже существует",
  "error": "Conflict",
  "statusCode": 409
}
```

## Развертывание

### Переменные окружения

```env
DATABASE_URL="postgresql://username:password@localhost:5432/whitebox"
JWT_SECRET="your-super-secret-jwt-key-here"
JWT_EXPIRES_IN="7d"
```

### Миграции

```bash
# Применить миграции
npm run db:migrate

# Заполнить тестовыми данными
npm run db:seed
```

## Расширение системы

### Добавление новых ролей

1. Обновите enum `UserRole` в schema.prisma
2. Создайте миграцию: `npx prisma migrate dev`
3. Обновите типы: `npm run db:generate`

### Ролевая авторизация

Для создания guards с проверкой ролей:

```typescript
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@Delete('users/:id')
deleteUser(@Param('id') id: string) {
  // Только администраторы
}
```

### Refresh токены

Для добавления refresh токенов расширьте AuthService:

```typescript
async refresh(refreshToken: string) {
  // Валидация refresh токена
  // Выпуск нового access токена
}
```
