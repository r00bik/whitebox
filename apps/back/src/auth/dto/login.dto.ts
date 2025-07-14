import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString } from "class-validator";

export class LoginDto {
  @ApiProperty({
    example: "user@example.com",
    description: "Email адрес пользователя",
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: "password123",
    description: "Пароль пользователя",
    minLength: 1,
  })
  @IsString()
  password: string;
}
