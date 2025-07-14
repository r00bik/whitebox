/*
  Warnings:

  - You are about to drop the column `avatar` on the `contacts` table. All the data in the column will be lost.
  - You are about to drop the column `company` on the `contacts` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `contacts` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `contacts` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `contacts` table. All the data in the column will be lost.
  - You are about to drop the column `position` on the `contacts` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,contactUserId]` on the table `contacts` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `contactUserId` to the `contacts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "contacts" DROP COLUMN "avatar",
DROP COLUMN "company",
DROP COLUMN "email",
DROP COLUMN "name",
DROP COLUMN "phone",
DROP COLUMN "position",
ADD COLUMN     "contactUserId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "contacts_userId_contactUserId_key" ON "contacts"("userId", "contactUserId");

-- AddForeignKey
ALTER TABLE "contacts" ADD CONSTRAINT "contacts_contactUserId_fkey" FOREIGN KEY ("contactUserId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
