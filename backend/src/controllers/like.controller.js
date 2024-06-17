import { asyncHandler } from "../utils/asyncHandler.js";

import { Post } from "../models/post.models.js";

import { Like } from "../models/like.models.js";

import { ApiResponse } from "../utils/ApiResponse.js";

const likePost = asyncHandler(async (req, res) => {
  const postId = req.params.postId;
  const userId = req.user._id;

  if (!postId) {
    console.log("Post ID not found");
    return res.status(400).json(new ApiResponse(400, {}, "Post ID not found"));
  }

  
  const existingLike = await Like.findOne({ post: postId, author: userId });
 

  if (existingLike) {
    await Like.findByIdAndDelete(existingLike._id);

   const post= await Post.findByIdAndUpdate(postId, [{
    $set:{
      likes:{
        $max:[
          {
            $add:["$likes",-1]
          }
          ,0
          
        ]

      }
    }}
   ],{new:true});

    return res
      .status(200)
      .json( {likes:post.likes, message:"Like removed successfully"});
  }

   await Like.create({ post: postId, author: req.user });

 const post= await Post.findByIdAndUpdate(postId, { $inc: { likes: 1 } },{new:true});


  res.status(200).json({likes:post.likes,message:"liked"});
});


const isLikedPost=asyncHandler(async (req,res)=>{

  const postId=req.params.postId
  const userId=req.user._id
  if(!postId)
    {
      console.log("post id not found")
    }
    const isAlreadyLiked = await Like.findOne({ post: postId, author: userId });
    if(isAlreadyLiked)
      {
        return res.json({isAlreadyLiked:true})
      }
 else{
  return res.json({isAlreadyLiked:false})
 }
})
export { likePost ,isLikedPost};
