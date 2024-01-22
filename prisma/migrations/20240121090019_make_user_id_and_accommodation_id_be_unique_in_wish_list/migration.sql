/*
  Warnings:

  - A unique constraint covering the columns `[userId,accommodationId]` on the table `Wishlist` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Wishlist_userId_accommodationId_key" ON "Wishlist"("userId", "accommodationId");
