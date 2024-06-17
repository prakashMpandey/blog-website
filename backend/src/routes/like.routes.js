import { Router } from "express";
import { verifyJWT } from "../middleware/Auth.middleware.js";
import { likePost,isLikedPost } from "../controllers/like.controller.js";


const router=Router()

router.route("/like/:postId").post(verifyJWT,likePost)

router.route("/like/:postId/status").get(verifyJWT,isLikedPost)
export default router