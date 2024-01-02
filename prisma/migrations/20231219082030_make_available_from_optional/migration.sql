-- AlterTable
ALTER TABLE "Accommodation" ALTER COLUMN "availableFrom" DROP NOT NULL,
ALTER COLUMN "availableFrom" SET DEFAULT CURRENT_DATE;
