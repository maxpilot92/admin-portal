/*
  Warnings:

  - You are about to drop the column `for` on the `Category` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Category" DROP COLUMN "for",
ADD COLUMN     "categoryFor" TEXT NOT NULL DEFAULT 'general';
