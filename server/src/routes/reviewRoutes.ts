import express from "express";
import { createReview, getPropertyReviews } from "../controllers/reviewControllers";
import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

// Create a review (authenticated tenants only)
router.post("/",authMiddleware(["tenant"]), createReview);

// Get reviews for a property
router.get("/:propertyId", getPropertyReviews);

export default router;