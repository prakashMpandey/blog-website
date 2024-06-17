import { Router } from "express";
import { registerUser,logInUser,logOutUser,updatePassword,updateDetails ,updateAvatar,deleteUser} from "../controllers/user.controller.js";
import { Post } from "../models/post.models.js";
import { verifyJWT } from "../middleware/Auth.middleware.js";
import { allPost } from "../controllers/post.controller.js";

const router=Router()

router.route("/").get(verifyJWT,async (req,res)=>{
    const user=req.user
   const posts=await allPost()
   function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

shuffleArray(posts);

const randomPosts = posts.slice(0, 5); // Select the first 5 posts after shuffling
res.render('home', { user, blogs: randomPosts })

})

export default router;