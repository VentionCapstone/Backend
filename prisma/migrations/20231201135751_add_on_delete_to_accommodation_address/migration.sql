-- DropForeignKey
ALTER TABLE "Accommodation" DROP CONSTRAINT "Accommodation_addressId_fkey";

-- AddForeignKey
ALTER TABLE "Accommodation" ADD CONSTRAINT "Accommodation_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address"("id") ON DELETE CASCADE ON UPDATE CASCADE;
