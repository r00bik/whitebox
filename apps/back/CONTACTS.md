# 📇 Система контактов Whitebox

Система контактов позволяет пользователям добавлять друг друга в контакты, оставлять личные заметки и организовывать их с помощью тегов.

## 🏗️ Архитектура

### Модель данных

```typescript
// Contact - связь между пользователями
{
  id: string;            // Уникальный идентификатор контакта
  userId: string;        // ID владельца контакта
  contactUserId: string; // ID пользователя, добавленного в контакты
  notes?: string;        // Личные заметки о контакте
  tags: string[];        // Теги для категоризации
  isActive: boolean;     // Флаг активности (soft delete)
  createdAt: Date;       // Дата создания
  updatedAt: Date;       // Дата последнего обновления

  // Связанные данные
  contactUser: {
    id: string;
    name: string;
    email: string;
  };
}
```

### Структура модуля

```
src/contacts/
├── contacts.module.ts          # Модуль контактов
├── contacts.controller.ts      # REST API контроллер
├── contacts.service.ts         # Бизнес-логика
├── contacts.controller.spec.ts # E2E тесты
├── contacts.service.spec.ts    # Unit тесты
├── contacts.http              # Тесты API
├── dto/                       # Data Transfer Objects
│   ├── create-contact.dto.ts
│   ├── update-contact.dto.ts
│   ├── contact-filters.dto.ts
│   ├── contact-response.dto.ts
│   └── index.ts
└── entities/                  # Entities для Swagger
    ├── contact.entity.ts
    └── index.ts
```

## 🌐 API Эндпоинты

### Базовый URL: `/v1/contacts`

| Метод  | Путь                        | Описание                  | Авторизация |
| ------ | --------------------------- | ------------------------- | ----------- |
| POST   | `/v1/contacts`              | Создание нового контакта  | ✅ JWT      |
| GET    | `/v1/contacts`              | Список активных контактов | ✅ JWT      |
| GET    | `/v1/contacts/:id`          | Получение контакта по ID  | ✅ JWT      |
| PUT    | `/v1/contacts/:id`          | Обновление контакта       | ✅ JWT      |
| DELETE | `/v1/contacts/:id`          | Деактивация контакта      | ✅ JWT      |
| PATCH  | `/v1/contacts/:id/activate` | Восстановление контакта   | ✅ JWT      |
| GET    | `/v1/contacts/search`       | Поиск контактов           | ✅ JWT      |
| GET    | `/v1/contacts/archived`     | Архивированные контакты   | ✅ JWT      |

### 🔐 Авторизация

Все эндпоинты требуют JWT токен в заголовке:

```
Authorization: Bearer <ваш_jwt_токен>
```

## 📋 Подробное описание API

### 1. Создание контакта

**POST** `/v1/contacts`

**Тело запроса:**

```json
{
  "contactUserId": "cm7abc123def456",
  "notes": "Коллега из отдела маркетинга",
  "tags": ["работа", "коллега", "маркетинг"]
}
```

**Ответ (201):**

```json
{
  "id": "cm7contact789xyz",
  "userId": "cm7user123abc",
  "contactUserId": "cm7abc123def456",
  "notes": "Коллега из отдела маркетинга",
  "tags": ["работа", "коллега", "маркетинг"],
  "isActive": true,
  "createdAt": "2024-12-27T10:00:00.000Z",
  "updatedAt": "2024-12-27T10:00:00.000Z",
  "contactUser": {
    "id": "cm7abc123def456",
    "name": "Иван Иванов",
    "email": "ivan@example.com"
  }
}
```

**Возможные ошибки:**

- `400` - Попытка добавить самого себя
- `400` - Контакт уже существует
- `404` - Пользователь для добавления не найден

### 2. Получение списка контактов

**GET** `/v1/contacts`

**Query параметры:**

- `page` (number, default: 1) - Номер страницы
- `limit` (number, default: 10) - Размер страницы
- `search` (string) - Поиск по имени или email
- `tags` (string[]) - Фильтр по тегам
- `isActive` (boolean) - Фильтр по активности
- `sortBy` (string, default: "createdAt") - Поле сортировки
- `sortOrder` ("asc" | "desc", default: "desc") - Направление сортировки

**Пример запроса:**

```
GET /v1/contacts?page=1&limit=5&search=иван&tags=работа&sortBy=name&sortOrder=asc
```

**Ответ (200):**

```json
{
  "data": [
    {
      "id": "cm7contact789xyz",
      "userId": "cm7user123abc",
      "contactUserId": "cm7abc123def456",
      "notes": "Коллега из отдела маркетинга",
      "tags": ["работа", "коллега"],
      "isActive": true,
      "createdAt": "2024-12-27T10:00:00.000Z",
      "updatedAt": "2024-12-27T10:00:00.000Z",
      "contactUser": {
        "id": "cm7abc123def456",
        "name": "Иван Иванов",
        "email": "ivan@example.com"
      }
    }
  ],
  "meta": {
    "page": 1,
    "limit": 5,
    "total": 1,
    "totalPages": 1,
    "hasNext": false,
    "hasPrev": false
  }
}
```

### 3. Получение контакта по ID

**GET** `/v1/contacts/:id`

**Ответ (200):** Объект контакта (см. структуру выше)

**Возможные ошибки:**

- `404` - Контакт не найден

### 4. Обновление контакта

**PUT** `/v1/contacts/:id`

**Тело запроса:**

```json
{
  "notes": "Обновленные заметки",
  "tags": ["новый", "тег"]
}
```

**Ответ (200):** Обновленный объект контакта

**Возможные ошибки:**

- `404` - Контакт не найден

### 5. Деактивация контакта

**DELETE** `/v1/contacts/:id`

**Ответ (200):** Объект контакта с `isActive: false`

**Возможные ошибки:**

- `404` - Контакт не найден

### 6. Восстановление контакта

**PATCH** `/v1/contacts/:id/activate`

**Ответ (200):** Объект контакта с `isActive: true`

**Возможные ошибки:**

- `404` - Контакт не найден

### 7. Поиск контактов

**GET** `/v1/contacts/search`

Принимает те же параметры, что и список контактов. Особенности:

- Поиск работает по полям `name` и `email` связанного пользователя
- Поддерживает нечувствительный к регистру поиск
- Можно комбинировать с фильтрами по тегам

### 8. Архивированные контакты

**GET** `/v1/contacts/archived`

Возвращает только деактивированные контакты (`isActive: false`).
Принимает параметры пагинации и сортировки.

## 🔍 Возможности фильтрации и поиска

### Поиск по тексту

- **По имени пользователя**: нечувствительный к регистру
- **По email**: нечувствительный к регистру
- **По заметкам**: поиск в личных заметках

### Фильтрация

- **По тегам**: `tags=работа,друзья` (OR логика)
- **По статусу**: `isActive=true/false`
- **Комбинированная**: можно совмещать все фильтры

### Сортировка

- **По дате создания**: `sortBy=createdAt`
- **По имени контакта**: `sortBy=name`
- **По дате обновления**: `sortBy=updatedAt`
- **Направление**: `sortOrder=asc/desc`

### Пагинация

- **Размер страницы**: `limit=10` (по умолчанию)
- **Номер страницы**: `page=1` (по умолчанию)
- **Метаданные**: информация о пагинации в ответе

## 🛡️ Безопасность

### Авторизация

- JWT токен обязателен для всех эндпоинтов
- Пользователь может управлять только своими контактами

### Валидация

- **contactUserId**: обязательное строковое поле
- **notes**: опциональная строка
- **tags**: опциональный массив строк

### Ограничения

- Нельзя добавить самого себя в контакты
- Нельзя создать дублирующий контакт
- Доступ только к собственным контактам

## 📊 Примеры использования

### Создание контакта с тегами

```bash
curl -X POST http://localhost:3000/v1/contacts \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "contactUserId": "cm7abc123def456",
    "notes": "Менеджер проекта X",
    "tags": ["работа", "проект-x", "важный"]
  }'
```

### Поиск контактов по тегу

```bash
curl "http://localhost:3000/v1/contacts/search?tags=работа&limit=20" \
  -H "Authorization: Bearer $JWT_TOKEN"
```

### Получение архивированных контактов

```bash
curl "http://localhost:3000/v1/contacts/archived?page=1&limit=10" \
  -H "Authorization: Bearer $JWT_TOKEN"
```

### Обновление заметок контакта

```bash
curl -X PUT http://localhost:3000/v1/contacts/cm7contact789xyz \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "notes": "Обновленная информация о контакте",
    "tags": ["работа", "важный", "друг"]
  }'
```

## 🧪 Тестирование

### Запуск тестов

```bash
# Unit тесты сервиса
pnpm test contacts.service.spec.ts

# E2E тесты контроллера
pnpm test contacts.controller.spec.ts

# Все тесты
pnpm test
```

### Покрытие тестами

- ✅ **16 unit тестов** сервиса
- ✅ **16 e2e тестов** контроллера
- ✅ **100% покрытие** всех методов и сценариев

### Ручное тестирование

Используйте файл `src/contacts/contacts.http` для ручного тестирования всех эндпоинтов.

## 🚀 Развертывание

### База данных

Убедитесь, что выполнены миграции:

```bash
npx prisma migrate deploy
```

### Environment переменные

```env
DATABASE_URL="postgresql://user:password@localhost:5432/whitebox"
JWT_SECRET="your-secret-key"
```

### Swagger документация

После запуска приложения документация доступна по адресу:

```
http://localhost:3000/api
```

## 🔄 Интеграция с другими модулями

### Модуль пользователей

- Использует `UserService` для проверки существования пользователей
- Зависит от JWT аутентификации

### Модуль базы данных

- Использует `PrismaService` для работы с БД
- Поддерживает транзакции и связи

## 📈 Производительность

### Оптимизация запросов

- Индексы на часто используемые поля
- Selective includes для связанных данных
- Пагинация для больших результатов

### Кэширование

В будущем можно добавить:

- Redis кэш для часто запрашиваемых контактов
- Кэширование результатов поиска

## 🛠️ Техническая информация

### Зависимости

- **NestJS**: веб-фреймворк
- **Prisma**: ORM для работы с БД
- **class-validator**: валидация DTO
- **JWT**: аутентификация

### Версии

- Node.js: 18+
- PostgreSQL: 12+
- TypeScript: 5+

---

_Документация обновлена: 27 декабря 2024_
