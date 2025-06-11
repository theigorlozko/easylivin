import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Create a new review
export const createReview = async (req: Request, res: Response): Promise<void> => {
  try {
    const { content, rating, propertyId } = req.body;

    if (!req.user) {
      res.status(401).json({ message: "Unauthorized: User not authenticated" });
      return;
    }

    // Assume req.user.id === cognitoId
    const tenant = await prisma.tenant.findUnique({
      where: { cognitoId: req.user.id },
    });
    console.log("req.user.id:", req.user?.id);
    console.log("Tenant lookup result:", tenant);

    if (!tenant) {
      res.status(403).json({ message: "Only tenants can write reviews" });
      return;
    }

    const review = await prisma.review.create({
      data: {
        content,
        rating: Number(rating),
        propertyId: Number(propertyId),
        tenantId: tenant.id,
      },
    });

   

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
      include: {
        tenant: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json(reviews);
  } catch (error: any) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ message: `Error fetching reviews: ${error.message}` });
  }
};
