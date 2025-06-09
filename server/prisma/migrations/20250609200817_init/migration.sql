/*
  Warnings:

  - Added the required column `availableFrom` to the `Property` table without a default value. This is not possible if the table is not empty.
  - Added the required column `leaseLength` to the `Property` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lookingFor` to the `Property` table without a default value. This is not possible if the table is not empty.
  - Added the required column `minTerm` to the `Property` table without a default value. This is not possible if the table is not empty.
  - Added the required column `roomAdInfo` to the `Property` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Property" ADD COLUMN     "availableFrom" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "isRefNeeded" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "leaseLength" TEXT NOT NULL,
ADD COLUMN     "lookingFor" TEXT NOT NULL,
ADD COLUMN     "maxTerm" INTEGER,
ADD COLUMN     "minTerm" INTEGER NOT NULL,
ADD COLUMN     "roomAdInfo" TEXT NOT NULL,
ADD COLUMN     "roomAmenities" "RoomAmenity"[];
