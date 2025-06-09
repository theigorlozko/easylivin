/*
  Warnings:

  - Added the required column `roomNumber` to the `Property` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "RoomAmenityEnum" AS ENUM ('Desk', 'Chair', 'Wardrobe', 'ChestOfDrawers', 'BedsideTable', 'Mirror', 'LockOnDoor', 'KeypadEntry', 'MiniFridge', 'PrivateBathroom', 'SharedBathroom', 'TV', 'WifiIncluded', 'Balcony', 'BlackoutCurtains', 'Heating', 'AirConditioning');

-- AlterTable
ALTER TABLE "Property" ADD COLUMN     "isOwnerOccupied" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isSmokers" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "roomNumber" DOUBLE PRECISION NOT NULL,
ALTER COLUMN "applicationFee" DROP NOT NULL;
