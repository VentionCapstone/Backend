/*
  Warnings:

  - Added the required column `title` to the `Accommodation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Accommodation" ADD COLUMN     "title" TEXT NOT NULL;
