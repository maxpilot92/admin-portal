/*
  Warnings:

  - Added the required column `title` to the `Media` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Media" ADD COLUMN     "title" TEXT NOT NULL;
