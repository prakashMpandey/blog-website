import { Router } from "express";
import { upload } from "../middleware/multer.middleware.js";
import { verifyJWT } from "../middleware/Auth.middleware.js";
import { createPost, getPost,deletePost,updatePost, getAllPost } from "../controllers/post.controller.js";

const router=Router()

router.route("/createPost").post(verifyJWT,upload.single("postImage"),createPost)
router.route("/getPost/:postId").post(verifyJWT,getPost)
router.route("/deletePost/:postId").post(verifyJWT,deletePost)
router.route("/updatePost/:postId").post(verifyJWT,updatePost)
router.route("/getAllPost").post(verifyJWT,getAllPost)

export default router