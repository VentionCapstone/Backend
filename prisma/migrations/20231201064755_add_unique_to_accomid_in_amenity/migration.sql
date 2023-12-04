/*
  Warnings:

  - A unique constraint covering the columns `[accommodationId]` on the table `Amenity` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Amenity_accommodationId_key" ON "Amenity"("accommodationId");
