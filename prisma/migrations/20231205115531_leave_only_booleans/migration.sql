/*
  Warnings:

  - You are about to drop the column `airConditioning` on the `Amenity` table. All the data in the column will be lost.
  - You are about to drop the column `airportTransfer` on the `Amenity` table. All the data in the column will be lost.
  - You are about to drop the column `backyard` on the `Amenity` table. All the data in the column will be lost.
  - You are about to drop the column `childFriendly` on the `Amenity` table. All the data in the column will be lost.
  - You are about to drop the column `closeToCenter` on the `Amenity` table. All the data in the column will be lost.
  - You are about to drop the column `hospitalNearby` on the `Amenity` table. All the data in the column will be lost.
  - You are about to drop the column `kitchen` on the `Amenity` table. All the data in the column will be lost.
  - You are about to drop the column `laundryService` on the `Amenity` table. All the data in the column will be lost.
  - You are about to drop the column `parking` on the `Amenity` table. All the data in the column will be lost.
  - You are about to drop the column `petAllowance` on the `Amenity` table. All the data in the column will be lost.
  - You are about to drop the column `quiteArea` on the `Amenity` table. All the data in the column will be lost.
  - You are about to drop the column `smokingAllowance` on the `Amenity` table. All the data in the column will be lost.
  - You are about to drop the column `swimmingPool` on the `Amenity` table. All the data in the column will be lost.
  - You are about to drop the column `tv` on the `Amenity` table. All the data in the column will be lost.
  - You are about to drop the column `wifi` on the `Amenity` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Address" ALTER COLUMN "zipCode" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Amenity" DROP COLUMN "airConditioning",
DROP COLUMN "airportTransfer",
DROP COLUMN "backyard",
DROP COLUMN "childFriendly",
DROP COLUMN "closeToCenter",
DROP COLUMN "hospitalNearby",
DROP COLUMN "kitchen",
DROP COLUMN "laundryService",
DROP COLUMN "parking",
DROP COLUMN "petAllowance",
DROP COLUMN "quiteArea",
DROP COLUMN "smokingAllowance",
DROP COLUMN "swimmingPool",
DROP COLUMN "tv",
DROP COLUMN "wifi",
ADD COLUMN     "hasAirConditioning" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hasAirportTransfer" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hasBackyard" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hasHospitalNearby" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hasKitchen" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hasLaundryService" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hasParking" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hasPetAllowance" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hasSmokingAllowance" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hasSwimmingPool" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hasTv" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hasWifi" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isChildFriendly" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isCloseToCenter" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isQuiteArea" BOOLEAN NOT NULL DEFAULT false;
