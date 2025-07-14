import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsOptional, IsString } from "class-validator";

export class CreateContactDto {
  @ApiProperty({
    description: "ID пользователя, которого добавляем в контакты",
    example: "cm123abc456def789",
  })
  @IsString()
  contactUserId: string;

  @ApiProperty({
    description: "Личные заметки о контакте",
    example: "Коллега из отдела маркетинга",
    required: false,
  })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({
    description: "Теги для категоризации контакта",
    example: ["работа", "коллега", "маркетинг"],
    type: [String],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}
