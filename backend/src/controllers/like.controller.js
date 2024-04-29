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

  console.log(postId, userId);
  const existingLike = await Like.findOne({ post: postId, author: userId });
  console.log(existingLike, "Existing like found");

  if (existingLike) {
    await Like.findByIdAndDelete(existingLike._id);

    await Post.findByIdAndUpdate(postId, { $inc: { likes: -1 } });

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Like removed successfully"));
  }

  const like = await Like.create({ post: postId, author: req.user });

  await Post.findByIdAndUpdate(postId, { $inc: { likes: 1 } });

  console.log(like);

  res.status(200).json(new ApiResponse(200, like, "Post liked successfully"));
});

export { likePost };
