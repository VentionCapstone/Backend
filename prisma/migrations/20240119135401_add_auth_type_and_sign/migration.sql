-- CreateEnum
CREATE TYPE "AuthType" AS ENUM ('EMAIL', 'GOOGLE');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "authSocialSign" TEXT,
ADD COLUMN     "authType" "AuthType" NOT NULL DEFAULT 'EMAIL';
