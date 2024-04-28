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


export {createPost}