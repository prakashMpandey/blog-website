import { Router } from "express";
import { verifyJWT } from "../middleware/Auth.middleware.js";
import { publishComment ,updateComment,deleteComment,getAllComments} from "../controllers/comment.controller.js";


const router=Router()

router.route("/:postId/comment").post(verifyJWT,publishComment)

router.route("/:postId/comments").get(verifyJWT,getAllComments)
router.route("/:postId/comment/update/:commentId").post(verifyJWT,updateComment)
router.route("/:postId/comment/delete/:commentId").post(verifyJWT,deleteComment)

export default router