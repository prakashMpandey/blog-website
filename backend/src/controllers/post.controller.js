import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Post } from "../models/post.models.js";
import { User } from "../models/user.models.js";
import { deleteOnCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const createPost = asyncHandler(async (req, res) => {
  //get title and content
  //get image
  //check if exist//
  //get user id
  //push on database
  const { title, content } = req.body;

  if (!(title && content)) {
    console.log("title and content not found");
  }
  const postImageLocalPath = req.file?.path;
  let postImage;
  if (postImageLocalPath) {
    postImage = await uploadOnCloudinary(postImageLocalPath);
  }
  console.log(postImage);
  const post = await Post.create({
    title: title,
    content: content,
    postImage: postImage?.url || "",
    author: req.user,
  });
  if(!post)
  {
    res.json(new ApiResponse(400,post,"post not uploaded"))

  }
return res.status(200).json(new ApiResponse(200,post,"post uploaded successfully"))

});
const getPost=asyncHandler(async (req,res)=>{
  const postId=req.params.postId

  if(!postId)
  {
    console.log("post id not found")
  }
  const post=await Post.findById(postId)
  console.log(post)
  res.status(200).json(new ApiResponse(200,post,"post found successfully"))

})
const deletePost=asyncHandler(async (req,res)=>{
  const postId=req.params.postId
  
  if(!postId)
  {
    console.log("post id not found")
  }
  const userId=String(req.user._id)
  const post=await Post.findById(postId)
  const author=String(post.author._id)
 
  if(userId!=author)
  {
    console.log("you cannot delete post")
    console.log(userId,author)
  }
  
  await Post.findByIdAndDelete(postId)

  res.send(200,{},"post deleted successfully")

})
const updatePost=asyncHandler(async(req,res)=>{
  const postId=req.params.postId
  
  const {title,content}=req.body

  if(!postId)
  {
    console.log("post id not found")
  }

   
  if(!(title || content))
  {
    console.log("no field found")
  }

  const updatedPost=await Post.findByIdAndUpdate(postId,{$set:{title:title,content:content}},{new:0})

  if(!updatedPost)
  {
    console.log("some problem while changing")
  }
  console.log(updatedPost)
   res.status(200).json(200,updatedPost,"post updated successfully")


})
const getAllPost=asyncHandler(async (req,res)=>{
  const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
  console.log(req.query)
})

export {createPost,getPost,deletePost,updatePost,getAllPost}