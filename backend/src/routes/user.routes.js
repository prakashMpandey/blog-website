import { Router } from "express";
import { registerUser,logInUser,logOutUser,updatePassword,updateDetails ,updateAvatar,deleteUser} from "../controllers/user.controller.js";
import { upload } from "../middleware/multer.middleware.js";
import { verifyJWT } from "../middleware/Auth.middleware.js";


const router=Router()

router.route("/register").get((req,res)=>{
    res.render("registration.ejs",{errorMessage:" "});

}).post(registerUser)



router.route("/login").post(logInUser).get((req,res)=>{
    res.render("login.ejs",{errorMessage:" "})
})


//secured routes

router.route("/logout").get(verifyJWT,logOutUser,);



router.route("/changePassword").get(verifyJWT,(req,res)=>{
    const user=req.user
    res.render("password",{user})
})
.post(verifyJWT,updatePassword)



router.route("/edit").post(verifyJWT,updateDetails).get(verifyJWT,(req,res)=>{
    const avatar=req.user.avatar
    const user=req.user
    res.render("profile_setting",{avatar,user});
   
})
router.route("/updateAvatar").patch(verifyJWT,upload.single("avatar"),updateAvatar)
router.route("/deleteaccount").post(verifyJWT,deleteUser)




export default router