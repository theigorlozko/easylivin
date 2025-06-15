import express from "express";
import {
  getManager,
  createManager,
  updateManager,
  getManagerProperties,
} from "../controllers/managerControllers";
import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/:cognitoId", getManager);
router.put("/:cognitoId",authMiddleware(["manager"]), updateManager);
router.get("/:cognitoId/properties",authMiddleware(["manager"]), getManagerProperties);
router.post("/",authMiddleware(["manager"]), createManager);

export default router;
