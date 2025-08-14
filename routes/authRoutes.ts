import { Router } from "express";
import { getUserProfile, loginUser, registerUser, updateUserProfile } from "../controllers/authController";
import { protect } from "../middlewares/authMiddleware";


const router = Router();

router.post("/register", registerUser);
router.post("/register", loginUser);
router.get("/register", protect, getUserProfile);
router.put("/register", protect, updateUserProfile);

export default router;