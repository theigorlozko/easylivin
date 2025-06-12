/*
  Warnings:

  - Added the required column `areaSafetyRating` to the `Review` table without a default value. This is not possible if the table is not empty.
  - Added the required column `areaServicesRating` to the `Review` table without a default value. This is not possible if the table is not empty.
  - Added the required column `areaTransportRating` to the `Review` table without a default value. This is not possible if the table is not empty.
  - Added the required column `managerCommunicationRating` to the `Review` table without a default value. This is not possible if the table is not empty.
  - Added the required column `managerResponseRating` to the `Review` table without a default value. This is not possible if the table is not empty.
  - Added the required column `propertyAmenitiesRating` to the `Review` table without a default value. This is not possible if the table is not empty.
  - Added the required column `propertyCleanlinessRating` to the `Review` table without a default value. This is not possible if the table is not empty.
  - Added the required column `propertyConditionRating` to the `Review` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalRating` to the `Review` table without a default value. This is not possible if the table is not empty.
  - Added the required column `wouldRecommend` to the `Review` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Review" ADD COLUMN     "areaComment" TEXT,
ADD COLUMN     "areaSafetyRating" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "areaServicesRating" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "areaTransportRating" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "dateFrom" TIMESTAMP(3),
ADD COLUMN     "dateTo" TIMESTAMP(3),
ADD COLUMN     "managerComment" TEXT,
ADD COLUMN     "managerCommunicationRating" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "managerResponseRating" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "propertyAmenitiesRating" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "propertyCleanlinessRating" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "propertyComment" TEXT,
ADD COLUMN     "propertyConditionRating" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "summary" TEXT,
ADD COLUMN     "totalRating" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "wouldRecommend" BOOLEAN NOT NULL;
