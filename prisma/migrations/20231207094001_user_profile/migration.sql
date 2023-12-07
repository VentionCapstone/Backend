/*
  Warnings:

  - You are about to drop the column `photoUrl` on the `UserProfile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Address" ALTER COLUMN "zipCode" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "UserProfile" DROP COLUMN "photoUrl",
ADD COLUMN     "imageUrl" TEXT;
