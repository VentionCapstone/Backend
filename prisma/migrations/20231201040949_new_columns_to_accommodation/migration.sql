/*
  Warnings:

  - You are about to alter the column `price` on the `Accommodation` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - You are about to drop the column `numberOfRooms` on the `Amenity` table. All the data in the column will be lost.
  - You are about to drop the column `squareMeters` on the `Amenity` table. All the data in the column will be lost.
  - Added the required column `availableFrom` to the `Accommodation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `availableTo` to the `Accommodation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `numberOfRooms` to the `Accommodation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `previewImgUrl` to the `Accommodation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `squareMeters` to the `Accommodation` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `zipCode` on the `Address` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Accommodation" ADD COLUMN     "availableFrom" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "availableTo" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "numberOfRooms" INTEGER NOT NULL,
ADD COLUMN     "previewImgUrl" TEXT NOT NULL,
ADD COLUMN     "squareMeters" INTEGER NOT NULL,
ALTER COLUMN "description" DROP NOT NULL,
ALTER COLUMN "price" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "Address" DROP COLUMN "zipCode",
ADD COLUMN     "zipCode" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Amenity" DROP COLUMN "numberOfRooms",
DROP COLUMN "squareMeters";
