import { Router } from "express";
import { exportExcel, exportPdf } from "../controllers/exportController.js";
import { authorize, protect } from "../middleware/authMiddleware.js";

const router = Router();

router.use(protect);
router.get("/excel", authorize("admin", "empleado"), exportExcel);
router.get("/pdf", authorize("admin", "empleado"), exportPdf);

export default router;
