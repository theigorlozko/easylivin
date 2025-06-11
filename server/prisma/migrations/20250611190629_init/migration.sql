-- AlterTable
ALTER TABLE "Property" ADD COLUMN     "communalAreas" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "currentOccupantsDescription" TEXT DEFAULT '',
ADD COLUMN     "kitchenDetails" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "laundry" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "outdoorSpace" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "securityFeatures" TEXT[] DEFAULT ARRAY[]::TEXT[];
