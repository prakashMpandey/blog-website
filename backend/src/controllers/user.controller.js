import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.models.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
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


const registerUser= async (req,res)=>{
   try {
      const {username,fullname,email,password}= req.body
 
     if(
         [username,fullname,email,password].some((field)=>{
         field?.trim()===" "
     }))
     {
     throw new ApiError(400)
 
    
     }
 
     const existingUser=await User.findOne({
         $or:[{email},{username}]
     })
     if(existingUser)
     {
         throw new ApiError(400,"user already exists")

        
     }
    
     const avatarLocalPath=req.file?.path
 
     if(!avatarLocalPath) throw new ApiError(400,"avatar file not found")
     
     console.log(avatarLocalPath)
 
     const avatar = await uploadOnCloudinary(avatarLocalPath)
     
     console.log(avatar)
     if(!avatar)
     {
         throw new ApiError(500,"avatar  not found")
     }
  
 
 
 
 
 
    const user= await User.create({
         username:username,
         fullname:fullname,
         email:email,
         password:password,
         avatar:avatar.url
 
     })
 
 
    const createdUser=await User.findById(user._id).select(
     "-password -refreshToken"
    )
 
 
 
 if(!createdUser)
 {
     throw new ApiError(500,"internal server error while registering")
     
 }
 console.log(createdUser)
 return res.status(200).json(new ApiResponse(200,createdUser,"user created successfully"))
 
 }
    catch (error) {
        return res.status(401).json(new ApiError(400,"error in creating user"))
    
   }
   
}

const logInUser =async(req,res)=>{
    //username or email,password
    //check fields are not empty
    //check username exists or not
    //check password is right or not
     //aaccess token generate
    //refresh token generate
    //send cookies
    //login
   
    const {username,email,password}=req.body
    if(!(username ||  email)) throw new ApiError(400,"username or email is required")

   


    const user=await User.findOne({
        $or:[{username},{email}]
    })
    if(!user)
    {
        throw new ApiError(400,"user doesn't exist")
    }
    // if(!password) throw new ApiError(400,"enter password")

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
   .json(new ApiResponse(200,{
    user:loggedInUser
   },"user logged in successfully"))
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

   res.status(200).clearCookie("accessToken",options).clearCookie("refreshToken",options).json(new ApiResponse(200,{},"user llogged out successfully"))

    
}

export {registerUser,logOutUser,logInUser}




