import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEmail, IsOptional, IsString, MinLength } from "class-validator";

export class RegisterDto {
  @ApiProperty({
    example: "user@example.com",
    description: "Email адрес пользователя",
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: "password123",
    description: "Пароль пользователя",
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiPropertyOptional({
    example: "Иван Иванов",
    description: "Полное имя пользователя",
  })
  @IsOptional()
  @IsString()
  name?: string;
}
