/*
  Warnings:

  - You are about to drop the column `numberOfRooms` on the `Amenity` table. All the data in the column will be lost.
  - You are about to drop the column `squareMeters` on the `Amenity` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[accommodationId]` on the table `Amenity` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Amenity"
ADD COLUMN     "airConditioning" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "airportTransfer" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "backyard" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "childFriendly" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "closeToCenter" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hospitalNearby" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "kitchen" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "laundryService" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "otherAmenities" TEXT,
ADD COLUMN     "petAllowance" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "quiteArea" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "smokingAllowance" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "swimmingPool" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "tv" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "wifi" SET DEFAULT false,
ALTER COLUMN "parking" SET DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "Amenity_accommodationId_key" ON "Amenity"("accommodationId");
