/*
  Warnings:

  - Added the required column `allowedNumberOfPeople` to the `Accommodation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Accommodation" ADD COLUMN     "allowedNumberOfPeople" INTEGER NOT NULL;
