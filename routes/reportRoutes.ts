import { Router } from 'express';
import { adminOnly, protect } from '../middlewares/authMiddleware.ts';
import { exportTasksReport, exportUsersReport } from '../controllers/reportController.ts';



const router = Router();

router.get("/export/tasks", protect, adminOnly, exportTasksReport);//export all tasks as Excel/PDF
router.get("/export/users", protect, adminOnly, exportUsersReport);//export user-task report

export default router;