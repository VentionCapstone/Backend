/*
  Warnings:

  - Added the required column `timezoneOffset` to the `Accommodation` table without a default value. This is not possible if the table is not empty.
  - Made the column `availableFrom` on table `Accommodation` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Accommodation" ADD COLUMN     "timezoneOffset" INTEGER NOT NULL,
ALTER COLUMN "availableFrom" SET NOT NULL;
