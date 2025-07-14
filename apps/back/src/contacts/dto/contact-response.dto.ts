import { ApiProperty } from "@nestjs/swagger";

import { ContactEntity } from "../entities/contact.entity";

export class PaginationMeta {
  @ApiProperty({ description: "Текущая страница", example: 1 })
  page: number;

  @ApiProperty({ description: "Количество элементов на странице", example: 10 })
  limit: number;

  @ApiProperty({ description: "Общее количество элементов", example: 45 })
  total: number;

  @ApiProperty({ description: "Общее количество страниц", example: 5 })
  totalPages: number;

  @ApiProperty({ description: "Есть ли следующая страница", example: true })
  hasNext: boolean;

  @ApiProperty({ description: "Есть ли предыдущая страница", example: false })
  hasPrev: boolean;
}

export class ContactResponseDto {
  @ApiProperty({
    description: "Список контактов",
    type: [ContactEntity],
  })
  data: ContactEntity[];

  @ApiProperty({
    description: "Метаданные пагинации",
    type: PaginationMeta,
  })
  meta: PaginationMeta;
}
