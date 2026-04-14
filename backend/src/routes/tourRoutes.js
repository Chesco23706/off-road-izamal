import { Router } from "express";
import {
  createTour,
  deleteTour,
  getTours,
  markAsPaid,
  updateTour,
} from "../controllers/tourController.js";
import { authorize, protect } from "../middleware/authMiddleware.js";

const router = Router();

router.use(protect);
router.get("/", getTours);
router.post("/", createTour);
router.put("/:id", updateTour);
router.patch("/:id/pay", markAsPaid);
router.delete("/:id", authorize("admin"), deleteTour);

export default router;
