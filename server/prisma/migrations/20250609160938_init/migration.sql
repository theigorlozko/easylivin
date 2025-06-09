/*
  Warnings:

  - Added the required column `roomType` to the `Property` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "RoomType" AS ENUM ('SingleRoom', 'DoubleRoom', 'TwinRoom', 'Suite', 'Studio', 'SharedRoom', 'EnsuiteRoom', 'LoftRoom', 'AtticRoom', 'BasementRoom');

-- AlterTable
ALTER TABLE "Property" ADD COLUMN     "roomType" "RoomType" NOT NULL;
