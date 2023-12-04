/*
  Warnings:

  - Added the required column `airConditioning` to the `Amenity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `airportTransfer` to the `Amenity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `backyard` to the `Amenity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `childFriendly` to the `Amenity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `closeToCenter` to the `Amenity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `floor` to the `Amenity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hospitalNearby` to the `Amenity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `kitchen` to the `Amenity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `laundryService` to the `Amenity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `numberOfPeople` to the `Amenity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `otherAmenities` to the `Amenity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `petAllowance` to the `Amenity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quiteArea` to the `Amenity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `smokingAllowance` to the `Amenity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `swimmingPool` to the `Amenity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tv` to the `Amenity` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Amenity" ADD COLUMN     "airConditioning" BOOLEAN NOT NULL,
ADD COLUMN     "airportTransfer" BOOLEAN NOT NULL,
ADD COLUMN     "backyard" BOOLEAN NOT NULL,
ADD COLUMN     "childFriendly" BOOLEAN NOT NULL,
ADD COLUMN     "closeToCenter" BOOLEAN NOT NULL,
ADD COLUMN     "floor" INTEGER NOT NULL,
ADD COLUMN     "hospitalNearby" BOOLEAN NOT NULL,
ADD COLUMN     "kitchen" BOOLEAN NOT NULL,
ADD COLUMN     "laundryService" BOOLEAN NOT NULL,
ADD COLUMN     "numberOfPeople" BOOLEAN NOT NULL,
ADD COLUMN     "otherAmenities" TEXT NOT NULL,
ADD COLUMN     "petAllowance" BOOLEAN NOT NULL,
ADD COLUMN     "quiteArea" BOOLEAN NOT NULL,
ADD COLUMN     "smokingAllowance" BOOLEAN NOT NULL,
ADD COLUMN     "swimmingPool" BOOLEAN NOT NULL,
ADD COLUMN     "tv" BOOLEAN NOT NULL;
