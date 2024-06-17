import { Router } from "express";
import { upload } from "../middleware/multer.middleware.js";
import { verifyJWT } from "../middleware/Auth.middleware.js";
import { createPost, getPost,deletePost,updatePost, getAllPost,getAllMyPost } from "../controllers/post.controller.js";
import { Post } from "../models/post.models.js";
const router=Router()

router.route("/publish").get(verifyJWT,(req,res)=>{
    const user=req.user
    res.render("publish",{user})
}).post(verifyJWT,upload.single("postImage"),createPost)
router.route("/getPost/:postId").get(verifyJWT,getPost)
router.route("/deletePost/:postId").get(verifyJWT,deletePost)
router.route("/updatePost/:postId").post(verifyJWT,updatePost).get(verifyJWT,async (req,res)=>{
    const user=req.user
    const postId=req.params.postId
    const blog=await Post.findById(postId).select({title:1,content:1})
    
    
    res.render("update",{user,postId,blog})
})
router.route("/search").get(verifyJWT,getAllPost)
router.route("/myPosts").get(verifyJWT,getAllMyPost)

export default router