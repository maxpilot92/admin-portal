/*
  Warnings:

  - You are about to drop the column `categoryId` on the `Blog` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Blog" DROP CONSTRAINT "Blog_categoryId_fkey";

-- AlterTable
ALTER TABLE "Blog" DROP COLUMN "categoryId";

-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "for" TEXT NOT NULL DEFAULT 'someDefault';
