import { Router } from "express";
import { exportExcel, exportPdf } from "../controllers/exportController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.use(protect);
router.get("/excel", exportExcel);
router.get("/pdf", exportPdf);

export default router;
