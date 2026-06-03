import { Router } from "express";
import {
  getDashboardSummary,
  getMonthlyEarnings,
} from "../controllers/dashboardController.js";
import { authorize, protect } from "../middleware/authMiddleware.js";

const router = Router();

router.use(protect);
router.get("/summary", authorize("admin", "empleado"), getDashboardSummary);
router.get("/monthly-earnings", authorize("admin", "empleado"), getMonthlyEarnings);

export default router;
