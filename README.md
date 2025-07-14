# 📦 Whitebox Monorepo

Современное fullstack приложение для управления контактами с архитектурой монорепозитория.

## 🏗️ Архитектура проекта

```
whitebox/
├── apps/
│   ├── back/          # 🔧 NestJS Backend API
│   └── web/           # 🌐 React веб + 🖥️ Electron десктоп
├── packages/          # 📚 Общие пакеты (будущее расширение)
├── docker-compose.*.yml  # 🐳 Docker конфигурации
└── package.json       # 📋 Корневая конфигурация
```

## 🚀 Быстрый старт

### Требования

- **Node.js** >= 22.0.0
- **pnpm** >= 10.12.1
- **Docker** и **Docker Compose**

### Установка

```bash
# Клонировать репозиторий
git clone <repository-url>
cd whitebox

# Установить все зависимости
pnpm install
```

### 🎯 Запуск для разработки (одной командой!)

```bash
pnpm run dev
```

Эта команда автоматически запустит:

- 🐳 **PostgreSQL 17** на `localhost:5432`
- 🐳 **pgAdmin** на `http://localhost:5050`
- 🔧 **Backend API** на `http://localhost:3000`

### 🌐 Запуск веб-приложения

```bash
# Веб-версия (React)
pnpm --filter @whitebox/web dev

# Десктопная версия (Electron)
pnpm --filter @whitebox/web electron:dev
```

## 🚀 Production запуск через Docker Compose

Для production-сборки фронта используется отдельный контейнер web на базе nginx. Все статика React-приложения собирается и отдаётся через nginx (порт 80).

### Запуск production-стека

```bash
# Собрать и запустить production-стек (backend + web + postgres)
docker-compose up --build -d
```

### Сервисы и порты

| Сервис          | URL                   | Описание                     |
| --------------- | --------------------- | ---------------------------- |
| **Backend API** | http://localhost:3000 | NestJS REST API              |
| **Web App**     | http://localhost      | Production React SPA (nginx) |
| **pgAdmin**     | http://localhost:5050 | Управление БД                |
| **PostgreSQL**  | localhost:5432        | База данных                  |

> ⚡ Production web-приложение теперь доступно по адресу http://localhost (порт 80).

Подробнее о настройке см. [apps/web/README.md](./apps/web/README.md)

## 📋 Доступные команды

### Основные команды разработки

| Команда                | Описание                                     |
| ---------------------- | -------------------------------------------- |
| `pnpm run dev`         | 🚀 Запуск всего стека (контейнеры + backend) |
| `pnpm run dev:stop`    | ⏹️ Остановка всех сервисов                   |
| `pnpm run dev:backend` | 🔧 Запуск только backend                     |

### Команды веб-приложения

| Команда                                      | Описание                          |
| -------------------------------------------- | --------------------------------- |
| `pnpm --filter @whitebox/web dev`            | 🌐 Запуск веб-версии React        |
| `pnpm --filter @whitebox/web electron:dev`   | 🖥️ Запуск Electron с hot reload   |
| `pnpm --filter @whitebox/web build`          | 📦 Сборка веб-версии              |
| `pnpm --filter @whitebox/web electron:build` | 🛠️ Создание Electron инсталлятора |

### Docker команды

| Команда             | Описание                                            |
| ------------------- | --------------------------------------------------- |
| `pnpm run dev:up`   | 🐳 Запуск Docker контейнеров (PostgreSQL + pgAdmin) |
| `pnpm run dev:down` | 🐳 Остановка Docker контейнеров                     |
| `pnpm run dev:logs` | 📋 Просмотр логов контейнеров                       |

### Продакшен команды

| Команда                | Описание                        |
| ---------------------- | ------------------------------- |
| `pnpm run prod:up`     | 🚀 Запуск продакшен стека       |
| `pnpm run prod:down`   | ⏹️ Остановка продакшен стека    |
| `pnpm run prod:logs`   | 📋 Логи продакшен контейнеров   |
| `pnpm run prod:status` | 📊 Статус продакшен контейнеров |

### Качество кода

| Команда                 | Описание                   |
| ----------------------- | -------------------------- |
| `pnpm run lint`         | 🔍 Проверка кода линтером  |
| `pnpm run format`       | 📝 Проверка форматирования |
| `pnpm run format:write` | ✨ Автоформатирование кода |

## 🌐 Сервисы и порты

| Сервис           | URL                       | Описание             |
| ---------------- | ------------------------- | -------------------- |
| **Backend API**  | http://localhost:3000     | NestJS REST API      |
| **Web App**      | http://localhost:5173     | React веб-приложение |
| **Electron App** | Десктопное приложение     | Нативная версия      |
| **Swagger**      | http://localhost:3000/api | API документация     |
| **pgAdmin**      | http://localhost:5050     | Управление БД        |
| **PostgreSQL**   | localhost:5432            | База данных          |

### 🔐 Учетные данные

**pgAdmin:**

- Email: `admin@example.com`
- Password: `admin`

**PostgreSQL:**

- Host: `localhost:5432`
- Database: `whitebox_db`
- Username: `postgres`
- Password: `postgres`

**Тестовые пользователи (после сидинга):**

- **Админ:** `admin@example.com` / `admin123`
- **Пользователи:** `alice@example.com`, `bob@example.com`, `charlie@example.com` / `password123`

## 📚 Детальная документация

- **[Backend Documentation](./apps/back/README.md)** - NestJS API, авторизация, контакты
- **[Web App Documentation](./apps/web/README.md)** - React + Electron, UI/UX, интернационализация
- **[Authentication Guide](./apps/back/AUTHENTICATION.md)** - JWT авторизация
- **[Contacts API](./apps/back/CONTACTS.md)** - API системы контактов

## 🛠️ Технологический стек

### Backend

- **NestJS 11** - Node.js фреймворк
- **PostgreSQL 17** - Реляционная БД
- **Prisma 6** - Type-safe ORM
- **JWT** - Авторизация и безопасность
- **bcrypt** - Хеширование паролей
- **Swagger** - API документация
- **Fastify** - HTTP-сервер (вместо Express)

### Frontend

- **React 19.1** - Современная UI-библиотека с React Compiler
- **TypeScript 5.8** - Строгая типизация
- **Electron 37** - Кроссплатформенные десктопные приложения
- **RSBuild** - Быстрая сборка на базе Rspack
- **TanStack Router** - Типобезопасный роутинг с автогенерацией
- **TanStack Query** - Управление серверным состоянием
- **Mantine UI 8.1** - Современная React UI-библиотека
- **Tailwind CSS v4** - Утилит-фреймворк для стилизации
- **React-i18next** - Интернационализация с поддержкой Electron

### DevOps и инструменты

- **Docker** - Контейнеризация
- **pnpm 10.12** - Современный пакетный менеджер
- **ESLint + Prettier** - Качество кода
- **Husky** - Git hooks
- **Vitest** - Тестирование
- **Concurrently** - Параллельный запуск процессов

## 🔄 Workflow разработки

1. **Запуск:** `pnpm run dev` - запускает весь стек
2. **Разработка:** Изменения автоматически перезагружаются (Hot Reload)
3. **API тестирование:** Swagger UI на http://localhost:3000/api
4. **База данных:** pgAdmin на http://localhost:5050
5. **Остановка:** `Ctrl+C` или `pnpm run dev:stop`

## ⚡ Особенности и преимущества

### Производительность

- **Fastify** - высокопроизводительный HTTP-сервер
- **Prisma** - оптимизированные SQL-запросы

### Разработчикский опыт

- **Hot Reload** - мгновенные обновления при изменениях
- **TypeScript** - полная типизация backend
- **Автоматическое форматирование** - Prettier + ESLint
- **Git hooks** - автоматические проверки перед коммитами
- **Swagger** - интерактивная API документация

### Современные технологии

- **NestJS 11**
- **PostgreSQL 17**
- **JWT авторизация** - безопасная система аутентификации

## 🎯 Планы развития

- [x] **Десктопное приложение (Electron)** ✅ - реализовано
- [x] **Интернационализация (i18n)** ✅ - поддержка русского и английского языков
- [x] **Современный UI (Mantine + Tailwind CSS v4)** ✅ - реализовано
- [ ] Добавление общих пакетов в `packages/`
- [ ] Настройка CI/CD pipeline
- [ ] Мобильное приложение (React Native)
- [ ] Микросервисная архитектура
- [ ] Мониторинг и логгирование (Prometheus + Grafana)
- [ ] WebSocket для real-time уведомлений
- [ ] PWA поддержка
- [ ] Автообновление Electron приложения

## 📄 Лицензия

ISC License

---

**Команда разработки:** Создано с ❤️ для эффективной работы с контактами

_Последнее обновление: Январь 2025_
