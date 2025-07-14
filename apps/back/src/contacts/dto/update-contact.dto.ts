import { ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import { IsArray, IsOptional, IsString } from "class-validator";

import { CreateContactDto } from "./create-contact.dto";

export class UpdateContactDto extends PartialType(CreateContactDto) {
  @ApiPropertyOptional({
    description: "Личные заметки о контакте",
    example: "Обновленные заметки о коллеге",
  })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({
    description: "Теги для категоризации контакта",
    example: ["работа", "друг", "важный"],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}
