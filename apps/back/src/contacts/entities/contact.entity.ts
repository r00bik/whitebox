import { ApiProperty } from "@nestjs/swagger";

export class ContactEntity {
  @ApiProperty({
    description: "Уникальный идентификатор контакта",
    example: "cm456def789ghi012",
  })
  id: string;

  @ApiProperty({
    description: "ID владельца контакта",
    example: "cm123abc456def789",
  })
  userId: string;

  @ApiProperty({
    description: "ID пользователя, на которого ссылается контакт",
    example: "cm789ghi012jkl345",
  })
  contactUserId: string;

  @ApiProperty({
    description: "Личные заметки о контакте",
    example: "Коллега из отдела маркетинга",
    nullable: true,
  })
  notes: string | null;

  @ApiProperty({
    description: "Теги для категоризации контакта",
    example: ["работа", "коллега", "маркетинг"],
    type: [String],
  })
  tags: string[];

  @ApiProperty({
    description: "Флаг активности контакта",
    example: true,
  })
  isActive: boolean;

  @ApiProperty({
    description: "Дата создания контакта",
    example: "2024-01-15T10:30:00.000Z",
  })
  createdAt: Date;

  @ApiProperty({
    description: "Дата последнего обновления контакта",
    example: "2024-01-20T14:45:00.000Z",
  })
  updatedAt: Date;

  // Связанные данные пользователя (опционально для расширенных запросов)
  @ApiProperty({
    description: "Данные пользователя-контакта",
    required: false,
  })
  contactUser?: {
    id: string;
    name: string | null;
    email: string;
  };
}
