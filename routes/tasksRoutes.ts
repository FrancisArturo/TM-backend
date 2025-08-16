import { Router } from 'express';
import { adminOnly, protect } from '../middlewares/authMiddleware.ts';
import { createTask, deleteTask, getDashboardData, getTaskByID, getTasks, getUserDashboardData, updateTask, updateTaskChecklist, updateTaskStatus } from '../controllers/taskController.ts';



const router = Router();

router.get("/dashboard-data", protect, getDashboardData);
router.get("/user-dashboard-data", protect, getUserDashboardData);
router.get("/", protect, getTasks);
router.get("/:uid", protect, getTaskByID);
router.post("/", protect, adminOnly, createTask);
router.put("/:uid", protect, updateTask);
router.delete("/:uid", protect, adminOnly, deleteTask);
router.put("/:uid/status", protect, updateTaskStatus);
router.put("/:uid/todo", protect, updateTaskChecklist);



export default router