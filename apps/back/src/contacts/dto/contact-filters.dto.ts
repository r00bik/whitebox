import { ApiPropertyOptional } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { IsArray, IsBoolean, IsInt, IsOptional, IsString, Min } from "class-validator";

export class ContactFiltersDto {
  @ApiPropertyOptional({
    description: "Номер страницы (начиная с 1)",
    example: 1,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    description: "Количество элементов на странице",
    example: 10,
    minimum: 1,
    maximum: 100,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;

  @ApiPropertyOptional({
    description: "Поиск по имени пользователя",
    example: "Иван",
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: "Фильтр по тегам",
    example: ["работа", "друг"],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  tags?: string[];

  @ApiPropertyOptional({
    description: "Фильтр по статусу активности",
    example: true,
  })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({
    description: "Сортировка (name, createdAt, updatedAt)",
    example: "createdAt",
    enum: ["name", "createdAt", "updatedAt"],
  })
  @IsOptional()
  @IsString()
  sortBy?: "name" | "createdAt" | "updatedAt" = "createdAt";

  @ApiPropertyOptional({
    description: "Порядок сортировки",
    example: "desc",
    enum: ["asc", "desc"],
  })
  @IsOptional()
  @IsString()
  sortOrder?: "asc" | "desc" = "desc";
}
