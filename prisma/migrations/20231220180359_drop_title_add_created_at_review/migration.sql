/*
  Warnings:

  - You are about to drop the column `title` on the `Review` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Review" DROP COLUMN "title",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
