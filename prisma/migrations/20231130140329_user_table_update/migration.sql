/*
  Warnings:

  - You are about to drop the column `profileId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `UserProfile` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `hashedRefreshToken` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `UserProfile` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_profileId_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "profileId",
DROP COLUMN "status",
ADD COLUMN     "hashedRefreshToken" TEXT NOT NULL,
ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "firstName" DROP NOT NULL,
ALTER COLUMN "lastName" DROP NOT NULL,
ALTER COLUMN "role" SET DEFAULT 'USER',
ALTER COLUMN "isEmailVerified" SET DEFAULT false,
ALTER COLUMN "isVerified" SET DEFAULT false;

-- AlterTable
ALTER TABLE "UserProfile" ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "UserProfile_userId_key" ON "UserProfile"("userId");

-- AddForeignKey
ALTER TABLE "UserProfile" ADD CONSTRAINT "UserProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
