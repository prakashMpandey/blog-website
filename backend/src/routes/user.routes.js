import { Router } from "express";
import { registerUser,logInUser,logOutUser,updatePassword,updateDetails ,updateAvatar,deleteUser} from "../controllers/user.controller.js";
import { upload } from "../middleware/multer.middleware.js";
import { verifyJWT } from "../middleware/Auth.middleware.js";


const router=Router()

router.route("/register").get((req,res)=>{
    res.render("registration.ejs");
}).post(upload.single("avatar"),registerUser)



router.route("/login").post(logInUser).get((req,res)=>{
    res.render("login.ejs")
})


//secured routes

router.route("/logout").post(verifyJWT,logOutUser)
router.route("/changePassword").post(verifyJWT,updatePassword)
router.route("/updateDetails").post(verifyJWT,updateDetails)
router.route("/updateAvatar").post(verifyJWT,upload.single("avatar"),updateAvatar)
router.route("/deleteUser").post(verifyJWT,deleteUser)




export default router