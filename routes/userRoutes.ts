import { Router } from "express";
import { adminOnly, protect } from '../middlewares/authMiddleware.ts';
import { deleteUser, getUserById, getUsers } from "../controllers/userController.ts";


const router = Router();

router.get("/", protect, adminOnly, getUsers);
router.get("/:id", protect, getUserById);
router.delete("/:id", protect, adminOnly, deleteUser);

export default router