/*
  Warnings:

  - You are about to drop the column `floor` on the `Amenity` table. All the data in the column will be lost.
  - You are about to drop the column `numberOfPeople` on the `Amenity` table. All the data in the column will be lost.
  - You are about to drop the column `numberOfRooms` on the `Amenity` table. All the data in the column will be lost.
  - You are about to drop the column `squareMeters` on the `Amenity` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Accommodation" ALTER COLUMN "availability" SET DEFAULT false;

-- AlterTable
ALTER TABLE "Amenity" DROP COLUMN "floor",
DROP COLUMN "numberOfPeople",
DROP COLUMN "numberOfRooms",
DROP COLUMN "squareMeters",
ALTER COLUMN "wifi" SET DEFAULT false,
ALTER COLUMN "parking" SET DEFAULT false,
ALTER COLUMN "airConditioning" SET DEFAULT false,
ALTER COLUMN "airportTransfer" SET DEFAULT false,
ALTER COLUMN "backyard" SET DEFAULT false,
ALTER COLUMN "childFriendly" SET DEFAULT false,
ALTER COLUMN "closeToCenter" SET DEFAULT false,
ALTER COLUMN "hospitalNearby" SET DEFAULT false,
ALTER COLUMN "kitchen" SET DEFAULT false,
ALTER COLUMN "laundryService" SET DEFAULT false,
ALTER COLUMN "otherAmenities" DROP NOT NULL,
ALTER COLUMN "petAllowance" SET DEFAULT false,
ALTER COLUMN "quiteArea" SET DEFAULT false,
ALTER COLUMN "smokingAllowance" SET DEFAULT false,
ALTER COLUMN "swimmingPool" SET DEFAULT false,
ALTER COLUMN "tv" SET DEFAULT false;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "isEmailVerified" SET DEFAULT false,
ALTER COLUMN "isVerified" SET DEFAULT false;
