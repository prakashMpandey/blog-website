import { asyncHandler } from "../utils/asyncHandler.js";
import { Post } from "../models/post.models.js";
import { Comment } from "../models/comment.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const publishComment = asyncHandler(async (req, res) => {
  const postId = req.params.postId;
  const content = req.body.content;

  try {
    if (!postId) {
      return res.status(400).json({ message: "Post ID is required." });
    }

    if (!content) {
      return res.status(400).json({ message: "Comment content is required." });
    }

    const comment = await Comment.create({
      content: content,
      author: req.user,
      post: postId,
    });

    if (!comment) {
      return res.status(400).json({ message: "Failed to create comment." });
    }

    return res
      .status(200)
      .json(new ApiResponse(200, {comment:comment.content,author:comment.author.username,avatar:comment.author.avatar,id:comment._id}, "comment puclished successfully"));
  }
  catch (error) {
    console.error("Error publishing comment:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
});


const updateComment = asyncHandler(async (req, res) => {
  const { postId, commentId } = req.params;
  const content = req.body.content;
  
  if (!(postId || commentId)) {
    console.log("no post or comment id provided");
  }

  const comment = await Comment.findByIdAndUpdate(
    { post: postId, _id: commentId },
    { $set: { content: content } },
    { $new: 0 }
  );
  
  if (!comment) {
    console.log("comment not updated");
  }

  res
    .status(200)
    .json(new ApiResponse(200, comment, "comment updated successfully"));
});
const deleteComment = asyncHandler(async (req, res) => {
  const { postId, commentId } = req.params;

  if (!(postId || commentId)) {
    console.log("no post or comment id provided");
  }
  const isCommentExist = await Comment.findById(commentId);
  if (!isCommentExist) {
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "comment does not exists"));
  }
  const comment = await Comment.findByIdAndDelete({
    post: postId,
    _id: commentId,
  });

  if (!comment) {
    console.log("comment not deleted");
  }

  res.status(200).json(200, comment, "comment deleted successfully");
});
const getAllComments = asyncHandler(async (req, res) => {
    try {
    
      const postId = req.params.postId;
      let { page = 1, limit = 10 } = req.query;
      page = Number(page);
      limit = Number(limit);
      let skip = (page - 1) * limit;
    
    if(!postId)
    {
        console.log("no post id found")
    }
    
      
      const comments = (await Comment.find({ post: postId }).skip(skip).limit(limit).populate("author","username avatar"));
  
      if(!comments)
      {
        return res.status(404).json({ message: "No comments found for the specified post." });
      }
      comments.forEach((comment)=>{
        console.log(comment)
      })
      
      res.status(200).json(new ApiResponse(200,{comments}))
} catch (error) {
    res.status(500).json({success:"false",message:"internal server error while fetching comments"})
}
});


export { publishComment, updateComment, deleteComment, getAllComments };
