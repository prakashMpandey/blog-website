import { Router } from "express";
import { verifyJWT } from "../middleware/Auth.middleware.js";
import { likePost } from "../controllers/like.controller.js";


const router=Router()

router.route("/:postId/likePost").post(verifyJWT,likePost)

export default router