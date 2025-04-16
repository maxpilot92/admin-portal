/*
  Warnings:

  - Added the required column `data` to the `Media` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Media" ADD COLUMN     "data" BYTEA NOT NULL,
ALTER COLUMN "url" DROP NOT NULL;
