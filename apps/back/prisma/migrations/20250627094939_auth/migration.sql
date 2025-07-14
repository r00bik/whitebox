/*
  Warnings:

  - Added the required column `password` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN');

-- AlterTable - добавляем поля с временными дефолтными значениями
ALTER TABLE "users" ADD COLUMN     "password" TEXT NOT NULL DEFAULT 'temp_password',
ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'USER';

-- Устанавливаем хешированный пароль для существующих пользователей (password123)
UPDATE "users" SET "password" = '$2b$10$K7L1n8fFpE7FhT2r9Qg4ROeKvH1xZn8/c1sE5Zt9f6y0x1Q2W3E4R';

-- Удаляем дефолтное значение password (новые пользователи должны задать пароль)
ALTER TABLE "users" ALTER COLUMN "password" DROP DEFAULT;
