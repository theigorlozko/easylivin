import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Create a new review
export const createReview = async (req: Request, res: Response): Promise<void> => {
  try {
    const { content,
      rating,
      dateFrom,
      dateTo,
      managerCommunicationRating,
      managerResponseRating,
      managerComment,
      propertyCleanlinessRating,
      propertyConditionRating,
      propertyAmenitiesRating,
      propertyComment,
      areaSafetyRating,
      areaTransportRating,
      areaServicesRating,
      areaComment,
      wouldRecommend,
      summary,
      totalRating,
      propertyId,
    } = req.body;

    if (!req.user) {
      res.status(401).json({ message: "Unauthorized: User not authenticated" });
      return;
    }

    // Assume req.user.id === cognitoId
    const tenant = await prisma.tenant.findUnique({
      where: { cognitoId: req.user.id },
    });

    if (!tenant) {
      res.status(403).json({ message: "Only tenants can write reviews" });
      return;
    }

    const review = await prisma.review.create({
      data: {
        content,
        rating: Number(rating),
        dateFrom: dateFrom ? new Date(dateFrom) : null,
        dateTo: dateTo ? new Date(dateTo) : null,
        managerCommunicationRating: Number(managerCommunicationRating),
        managerResponseRating: Number(managerResponseRating),
        managerComment,
        propertyCleanlinessRating: Number(propertyCleanlinessRating),
        propertyConditionRating: Number(propertyConditionRating),
        propertyAmenitiesRating: Number(propertyAmenitiesRating),
        propertyComment,
        areaSafetyRating: Number(areaSafetyRating),
        areaTransportRating: Number(areaTransportRating),
        areaServicesRating: Number(areaServicesRating),
        areaComment,
        wouldRecommend: Boolean(wouldRecommend),
        summary,
        totalRating: Number(totalRating),
        propertyId: Number(propertyId),
        tenantId: tenant.id,
      },
    });

  // Fetch the current property details
  const property = await prisma.property.findUnique({
    where: { id: Number(propertyId) },
    select: { averageRating: true, numberOfReviews: true },
  });

  if (property) {
    const currentAverageRating = property.averageRating || 0;
    const currentNumberOfReviews = property.numberOfReviews || 0;

    // Calculate the new average rating
    const updatedNumberOfReviews = currentNumberOfReviews + 1;
    const updatedAverageRating =
      (currentAverageRating * currentNumberOfReviews + Number(rating)) /
      updatedNumberOfReviews;

    // Update the property with the new average rating and number of reviews
    await prisma.property.update({
      where: { id: Number(propertyId) },
      data: {
        averageRating: updatedAverageRating,
        numberOfReviews: updatedNumberOfReviews,
      },
    });
  }

    res.status(201).json(review);
  } catch (error: any) {
    console.error("Error creating review:", error);
    res.status(500).json({ message: `Error creating review: ${error.message}` });
  }
};

// Get reviews for a property
export const getPropertyReviews = async (req: Request, res: Response): Promise<void> => {
  try {
    const { propertyId } = req.params;

    const reviews = await prisma.review.findMany({
      where: { propertyId: Number(propertyId) },
      include: { tenant: true }, // Include tenant info for display
    });

    res.status(200).json(reviews);
  } catch (error: any) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ message: `Error fetching reviews: ${error.message}` });
  }
};
