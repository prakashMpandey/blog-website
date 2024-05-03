import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.models.js"
import {deleteOnCloudinary, uploadOnCloudinary} from "../utils/cloudinary.js"
import {ApiResponse} from "../utils/ApiResponse.js"



const generateAccessAndRefreshToken=async (userId)=>{
    try {
        

        const user=await User.findById(userId)
        const accessToken=user.generateAccessToken()
     
        const refreshToken=user.generateAccessToken()

        user.refreshToken=refreshToken
        await user.save({validateBeforeSave:false})

        return {accessToken,refreshToken}
        
    } catch (error) {
        throw new ApiError(500,"something wrong while generating tokens")
        
    }
}


const registerUser=asyncHandler( async (req,res)=>{
   try {
    

      const {username,fullname,email,password}= req.body
      console.log(req.body)
     if(
         [username,fullname,email,password].some((field)=>{
         field?.trim()===" "
     }))
     {
     throw new ApiError(400,"enter all fields")
 
    
     }
    //  console.log(username,fullname,email)
     const existingUser=await User.findOne({
         $or:[{email},{username}]
     })
     if(existingUser)
     {
         throw new ApiError(400,"user already exists")

        
     }
     console.log(existingUser)
    
    //  const avatarLocalPath=req.file?.path
 
    //  if(!avatarLocalPath) 
    //  {throw new ApiError(400,"avatar file not found")
    // }
     
    //  console.log(avatarLocalPath)
 
    //  const avatar = await uploadOnCloudinary(avatarLocalPath)
     
    //  console.log(avatar)
    //  if(!avatar)
    //  {
    //      throw new ApiError(500,"avatar  not found")
    //  }
  
 
 
 
 
 
    const user= await User.create({
         username:username,
         fullname:fullname,
         email:email,
         password:password,
         avatar: ""                   //avatar.url ||
 
     })
     console.log(user)
 
    const createdUser=await User.findById(user._id).select(
     "-password -refreshToken"
    )
 
 
 
 if(!createdUser)
 {
     throw new ApiError(500,"internal server error while registering")
     
 }
 console.log(createdUser)
 return res.status(200).render("home",{user})
 res.redirect("login");
 


 
 }
    catch (error) {
        return res.status(401).json(new ApiError(400,"error in creating user"))
    
   }
   
})

const logInUser =async(req,res)=>{

   
    const {input,password}=req.body
    let email,username;
    if(input.indexOf("@")===-1)
    {
        username=input
      
        
    }
    else{
        email=input;
        
    }
    
    if(!(username ||  email)) 
    {throw new ApiError(400,"username or email is required")
}

   if(!password)
   {
    throw new ApiError(400,"password is required")
   }


    const user=await User.findOne({
        $or:[{username},{email}]
    })
    if(!user)
    {
       res.json({message:"wrong username or password"})
    } 



const isPasswordValid = await user.isPasswordCorrect(password)
    console.log(isPasswordValid)

    if(!isPasswordValid)
    {
        throw new ApiError(400,"invalid user credentials")
    }
   const{accessToken,refreshToken}= await generateAccessAndRefreshToken(user._id)

   const loggedInUser=await User.findById(user._id,{password:0,refreshToken:0})

   const options={
    httpOnly:true,
    secure:true
   }
   return res.status(200)
   .cookie("accessToken",accessToken,options).cookie("refresh TOken",refreshToken,options)
   .render("home",{user})

}

const logOutUser=async(req,res)=>{

    console.log(req.user)
   
  await User.findByIdAndUpdate(req.user._id,{
    $set:{
        refreshToken:undefined
    },
   },{
    new:true
   })

   const options={
    httpOnly:true,
    secure:true
   }

   res.status(200).clearCookie("accessToken",options).clearCookie("refreshToken",options).render("login")

    
}

const updatePassword=asyncHandler(async(req,res)=>{
    //check login
    
    //get old password,new password
    //check if available
    //compare old pasword
    //update new password

  
     try {
        const {oldPassword,newPassword}=req.body
        console.log(oldPassword,newPassword)
       
        if(!(oldPassword&&newPassword))
        {
            throw new ApiError(400,"both fields required")
        }
        
        const user=await User.findById(req.user?._id)
        console.log(user)
        
        const ispasswordRight=await user.isPasswordCorrect(oldPassword)
       if(!ispasswordRight)
       {
        throw new ApiError(400,"wrong password entered")
       }
    //    console.log(ispasswordRight)
    if(oldPassword===newPassword)
    {
        res.json(new ApiResponse(400,{},"new password must be different"))
    }
       
        user.password = newPassword;
        // console.log(user.password)
        await user.save({validateBeforeSave: false})
      
    
        return res.status(200).json(new ApiResponse(200,{},"password changer successfully"))
    
    
      
      
   
   }
     catch (error) {
        res.status(500).send(error)
        
     }
    }
)

const updateDetails=asyncHandler(async(req,res)=>{
    try {
        const {email,username,fullname}=req.body
        console.log(email)
        if(!(email||username||fullname))
        {
            res.json(new ApiResponse(400,"no field specified"))
    
        }
        const user=await User.findByIdAndUpdate(req.user._id,{$set:{fullname,email:email,username:username}},{new:true,password:0,refreshToken:0})
        console.log(user)
        console.log(user.username,user.email,user.fullname);
    
        return res.status(200).json(new ApiResponse(200,user,"details changed successfully"))
    } 
    
    catch (error) {
        res.status(500).json(500,{error},"something wrong while changing details")
        
    }
})
const updateAvatar=asyncHandler(async(req,res)=>{
    
    const avatarLocalPath = req.file?.path
    const avatarUrl=req.user.avatar

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is missing")
    }

    

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    console.log(avatar)
    if (!avatar.url) {
        throw new ApiError(400, "Error while uploading on avatar")
        
    }


    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                avatar: avatar.url
            }
        },
        {new: true}
    ).select("-password")

  const deleteImage= await deleteOnCloudinary(avatarUrl)
  console.log(deleteImage)
   

    return res
    .status(200)
    .json(
        new ApiResponse(200, user, "Avatar image updated successfully")
    )
})

const deleteUser=asyncHandler(async (req,res)=>{
    const user=req.user
    const deletedUser=await User.findOneAndDelete(user._id)
    console.log(deletedUser)
    res.status(200).json(new ApiResponse(200,deletedUser,"user deleted successfully"))
})
export {registerUser,logOutUser,logInUser,updatePassword,updateDetails,updateAvatar,deleteUser}




