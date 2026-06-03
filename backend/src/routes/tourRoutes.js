import { Router } from "express";
import {
  createTour,
  deleteTour,
  getAvailability,
  getTours,
  markAsPaid,
  updateTour,
} from "../controllers/tourController.js";
import { authorize, protect } from "../middleware/authMiddleware.js";

const router = Router();

router.use(protect);
router.get("/", getTours);
router.get("/availability", authorize("admin", "empleado"), getAvailability);
router.post("/", authorize("admin", "empleado"), createTour);
router.put("/:id", authorize("admin", "empleado"), updateTour);
router.patch("/:id/pay", authorize("admin", "empleado"), markAsPaid);
router.delete("/:id", authorize("admin"), deleteTour);

export default router;
