import { Router } from "express";
import {
  getDashboardSummary,
  getMonthlyEarnings,
} from "../controllers/dashboardController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.use(protect);
router.get("/summary", getDashboardSummary);
router.get("/monthly-earnings", getMonthlyEarnings);

export default router;
