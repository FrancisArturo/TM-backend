import { Router } from "express";
import { adminOnly, protect } from '../middlewares/authMiddleware.ts';
import { deleteUser, getUserById, getUsers } from "../controllers/userController.ts";


const router = Router();

//admin only
router.get("/", protect, adminOnly, getUsers);
router.delete("/:uid", protect, adminOnly, deleteUser);

//get a user by id
router.get("/:uid", protect, getUserById);


export default router