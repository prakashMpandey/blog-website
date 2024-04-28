import { Router } from "express";
import { upload } from "../middleware/multer.middleware.js";
import { verifyJWT } from "../middleware/Auth.middleware.js";
import { createPost } from "../controllers/video.controller.js";

const router=Router()

router.route("/createPost").post(verifyJWT,upload.single("postImage"),createPost)

export default router