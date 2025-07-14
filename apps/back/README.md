# Whitebox Backend

Современное backend приложение на NestJS с PostgreSQL 17 и Prisma ORM. Полностью настроенное для разработки и продакшена с Docker, CI/CD и автоматическими миграциями.

## 📖 Документация

- **[Система авторизации](./AUTHENTICATION.md)** - подробная документация по JWT авторизации, API эндпоинтам, безопасности и примерам использования
- **[Система контактов](./CONTACTS.md)** - полная документация по API контактов, фильтрации, поиску и примерам использования

## 📋 Технологический стек

- **Runtime**: Node.js 22
- **Framework**: NestJS 11
- **Database**: PostgreSQL 17
- **ORM**: Prisma 6
- **HTTP Server**: Fastify (высокопроизводительный)
- **Authentication**: JWT + bcrypt
- **Package Manager**: pnpm 10.12.1
- **Containerization**: Docker & Docker Compose
- **API Documentation**: Swagger/OpenAPI
- **Code Quality**: ESLint, Prettier, Husky

## 🚀 Быстрый старт

### Требования

- Node.js 22+
- pnpm 10.12.1+
- Docker и Docker Compose (для БД)
- PostgreSQL 17

### ⚡ Быстрый запуск (из корня монорепо)

```bash
# Запуск всего стека одной командой
pnpm run dev
```

Эта команда автоматически запустит PostgreSQL, pgAdmin, бэкенд и фронтенд.

### 🔧 Ручная установка и настройка

1. Установить зависимости:

```bash
cd apps/back
pnpm install
```

2. Скопировать пример конфигурации:

```bash
cp .env.example .env
```

3. Запустить PostgreSQL в Docker:

```bash
# Из корня монорепо - только база данных для разработки
pnpm run dev:up

# Или прямой вызов Docker Compose
docker-compose -f ../../docker-compose.dev.yml up -d
```

4. Выполнить миграции и сидинг:

```bash
pnpm db:migrate
pnpm db:seed
```

5. Сгенерировать Prisma Client:

```bash
pnpm db:generate
```

6. Запустить приложение:

```bash
# Локальный запуск
pnpm start:dev

# Или из корня монорепо
pnpm run dev:backend
```

Приложение будет доступно на <http://localhost:3000>

### 📊 База данных

#### Команды Prisma

- `pnpm db:migrate` - Создать и применить миграцию
- `pnpm db:migrate:deploy` - Применить миграции в продакшене
- `pnpm db:generate` - Сгенерировать Prisma Client
- `pnpm db:studio` - Открыть Prisma Studio
- `pnpm db:seed` - Заполнить БД тестовыми данными
- `pnpm db:reset` - Сбросить БД и применить миграции

#### pgAdmin

После запуска `docker-compose.dev.yml` pgAdmin будет доступен на <http://localhost:5050>

- Email: <admin@example.com>
- Password: admin

Для подключения к базе:

- Host: postgres-dev (или localhost при подключении снаружи Docker)
- Port: 5432
- Database: whitebox_db
- Username: postgres
- Password: postgres

### 🛠 Разработка

#### Скрипты монорепо (из корня проекта)

- `pnpm run dev` - 🚀 Запуск всего стека (контейнеры + backend + frontend)
- `pnpm run dev:backend` - 🔧 Запуск только backend
- `pnpm run dev:stop` - ⏹️ Остановка всех сервисов
- `pnpm run dev:up` - 🐳 Запуск только Docker контейнеров
- `pnpm run dev:down` - 🐳 Остановка Docker контейнеров

#### Локальные скрипты (из apps/back)

- `pnpm start:dev` - Запуск в режиме разработки
- `pnpm build` - Сборка для продакшена
- `pnpm start:prod` - Запуск продакшен сборки
- `pnpm lint` - Проверка кода линтером
- `pnpm test` - Запуск тестов

#### API Документация

Swagger документация доступна на <http://localhost:3000/api> после запуска приложения.

### 🐳 Docker

#### Разработка

Для разработки используйте `docker-compose.dev.yml` - он запускает только PostgreSQL и pgAdmin:

```bash
docker-compose -f docker-compose.dev.yml up -d
```

#### Продакшен

Полный стек с приложением:

```bash
docker-compose up -d
```

### 🔧 Переменные окружения

Создайте файл `.env` на основе `.env.example`:

```env
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/whitebox_db?schema=public"

# App
NODE_ENV=development
PORT=3000
```

### 📝 Структура проекта

```
apps/back/
├── src/                    # Исходный код
│   ├── app.module.ts      # Основной модуль приложения
│   ├── main.ts           # Точка входа
│   ├── auth/             # Модуль авторизации (JWT)
│   ├── contacts/         # Модуль системы контактов
│   ├── user/             # Модуль пользователей
│   ├── health/           # Модуль проверки здоровья
│   └── prisma/           # Модуль интеграции с БД
├── prisma/               # Схема и миграции БД
│   ├── schema.prisma     # Схема Prisma
│   ├── migrations/       # Миграции базы данных
│   └── seed.ts          # Сидинг данных
├── generated/            # Сгенерированный Prisma Client
├── dist/                # Собранное приложение
├── Dockerfile           # Docker образ для продакшена
├── AUTHENTICATION.md     # Документация по авторизации
├── CONTACTS.md          # Документация по системе контактов
└── README.md           # Этот файл
```

## 🏗️ Архитектура

### Модульная структура NestJS

- **AppModule** - корневой модуль приложения
- **AuthModule** - модуль JWT авторизации
- **ContactsModule** - модуль системы контактов
- **UserModule** - модуль управления пользователями
- **HealthModule** - модуль мониторинга состояния
- **PrismaModule** - модуль интеграции с базой данных
- **ConfigModule** - глобальная конфигурация

### База данных

- **PostgreSQL 17** с Prisma ORM
- **Автоматические миграции** при деплое
- **Seed данные** для разработки
- **Типобезопасность** через Prisma Client

### DevOps

- **Multi-stage Docker** сборка
- **GitHub Actions** для автоматических тестов
- **Health checks** для мониторинга
- **Автоматический setup** скрипт

## 🗄️ База данных

### Модели данных

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String
  name      String?
  role      UserRole @default(USER)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Связи для контактов
  contacts        Contact[] @relation("UserContacts")
  contactedByUsers Contact[] @relation("ContactUser")

  @@map("users")
}

model Contact {
  id            String   @id @default(cuid())
  userId        String   // Владелец контакта
  contactUserId String   // Пользователь в контактах
  notes         String?  // Личные заметки
  tags          String[] // Теги для категоризации
  isActive      Boolean  @default(true)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  user          User     @relation("UserContacts", fields: [userId], references: [id])
  contactUser   User     @relation("ContactUser", fields: [contactUserId], references: [id])

  @@unique([userId, contactUserId])
  @@map("contacts")
}

enum UserRole {
  USER
  ADMIN
}
```

### Команды Prisma

- `pnpm db:migrate` - Создать и применить миграцию
- `pnpm db:generate` - Сгенерировать Prisma Client
- `pnpm db:studio` - Открыть Prisma Studio
- `pnpm db:seed` - Заполнить БД тестовыми данными
- `pnpm db:reset` - Сбросить БД и применить миграции

## 🐳 Docker

### Разработка

```bash
# Только PostgreSQL + pgAdmin
docker-compose -f docker-compose.dev.yml up -d

# Автоматическая настройка проекта
pnpm setup
```

### Продакшен

```bash
# Полный стек: PostgreSQL + Backend
docker-compose up -d
```

### Образы

- **postgres:17-alpine** - PostgreSQL база данных
- **whitebox-backend** - Multi-stage образ приложения
- **dpage/pgadmin4** - Веб-интерфейс для управления БД

## 🔧 API Endpoints

### Авторизация

- `POST /v1/auth/register` - Регистрация пользователя
- `POST /v1/auth/login` - Вход в систему
- `GET /v1/auth/me` - Данные текущего пользователя (JWT)

### Контакты

- `POST /v1/contacts` - Создание контакта (JWT)
- `GET /v1/contacts` - Список контактов с фильтрацией (JWT)
- `GET /v1/contacts/:id` - Получение контакта по ID (JWT)
- `PUT /v1/contacts/:id` - Обновление контакта (JWT)
- `DELETE /v1/contacts/:id` - Деактивация контакта (JWT)
- `PATCH /v1/contacts/:id/activate` - Восстановление контакта (JWT)
- `GET /v1/contacts/search` - Поиск контактов (JWT)
- `GET /v1/contacts/archived` - Архивированные контакты (JWT)

### Health Check

- `GET /v1/health` - Проверка состояния API

### Swagger документация

- `GET /api` - OpenAPI документация

## 🛠️ Команды разработки

### Основные

- `pnpm start:dev` - Запуск в режиме разработки
- `pnpm build` - Сборка для продакшена
- `pnpm start:prod` - Запуск продакшен сборки
- `pnpm lint` - Проверка кода линтером
- `pnpm test` - Запуск тестов

### Утилиты

- `pnpm db:studio` - Открыть Prisma Studio

## 🔄 CI/CD

GitHub Actions автоматически выполняет:

1. **Lint & Test** - проверка кода и тесты
2. **Build** - сборка Docker образа
3. **Publish** - публикация в registry (только на main/master)

Workflow поддерживает:

- PostgreSQL 17 для тестов
- Node.js 22
- Параллельные задачи
- Кэширование зависимостей

## 🧪 Тестирование

### Unit/Integration тесты

```bash
# Запуск всех тестов (45 тестов)
pnpm test

# Запуск тестов по модулям
pnpm test auth.controller.spec.ts     # Авторизация (13 тестов)
pnpm test contacts.service.spec.ts    # Контакты сервис (16 тестов)
pnpm test contacts.controller.spec.ts # Контакты API (16 тестов)

# Запуск в режиме watch
pnpm test:watch

# Покрытие тестами
pnpm test:coverage
```

### HTTP API тестирование

Для ручного тестирования API используйте .http файлы рядом с контроллерами с расширением [REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) в VS Code:

- `src/auth/auth.http` - тестирование авторизации
- `src/contacts/contacts.http` - тестирование системы контактов
- `src/health/health.http` - тестирование health check

**Полнофункциональное API:**

- **Авторизация**: Регистрация, вход, получение профиля
- **Контакты**: CRUD операции, поиск, фильтрация, архивирование
- **Мониторинг**: Health check эндпоинт

**Быстрый старт:**

1. Установите расширение REST Client в VS Code
2. Откройте любой .http файл в `src/*/`
3. Запустите сервер: `pnpm start:dev`
4. Кликните "Send Request" над любым запросом

**Файлы по модулям:**

- Каждый контроллер имеет свой .http файл для тестирования
- Переменные `@baseUrl` настроены для локальной разработки
