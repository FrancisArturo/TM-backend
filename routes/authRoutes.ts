import { Router, type Request, type Response } from "express";
import { getUserProfile, loginUser, registerUser, updateUserProfile } from "../controllers/authController.ts";
import { protect } from "../middlewares/authMiddleware.ts";
import { upload } from "../middlewares/uploadMiddleware.ts";


const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, updateUserProfile);

router.post("/upload-image", upload.single("image"), (req: Request, res: Response) => {
    if(!req.file){
        return res.status(400).json({
            ok: false,
            message: "No file upload"
        });
    }
    const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    res.status(200).json({
        ok: true,
        imageUrl
    });
});

export default router;