import { Router } from 'express';
import { adminOnly, protect } from '../middlewares/authMiddleware.ts';
import { createTask, deleteTask, getDashboardData, getTaskByID, getTasks, getUserDashboardData, updateTask, updateTaskChecklist, updateTaskStatus } from '../controllers/taskController.ts';



const router = Router();

router.get("/dashboard-data", protect, getDashboardData);
router.get("/user-dashboard-data", protect, getUserDashboardData);
router.get("/", protect, getTasks);
router.get("/:tid", protect, getTaskByID);
router.post("/", protect, adminOnly, createTask);
router.put("/:tid", protect, updateTask);
router.delete("/:tid", protect, adminOnly, deleteTask);
router.put("/:tid/status", protect, updateTaskStatus);
router.put("/:tid/todo", protect, updateTaskChecklist);



export default router