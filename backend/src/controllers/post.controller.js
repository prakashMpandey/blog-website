import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Post } from "../models/post.models.js";
import { User } from "../models/user.models.js";
import { deleteOnCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const createPost = asyncHandler(async (req, res) => {
  const { title, content } = req.body;

  if (!(title && content)) {
    console.log("title and content not found");
  }
  const postImageLocalPath = req.file?.path;
  let postImage;
  if (postImageLocalPath) {
    postImage = await uploadOnCloudinary(postImageLocalPath);
  }
 
  const post = await Post.create({
    title: title,
    content: content,
    postImage: postImage?.url || "",
    author: req.user,
  });

  if (!post) {
    res.json(new ApiResponse(400, post, "post not uploaded"));
  }
  return res
    .status(200)
    .redirect("/api/v1/home/");
});
const getPost = asyncHandler(async (req, res) => {
  const postId = req.params.postId;
const user=req.user
  if (!postId) {
    console.log("post id not found");
  }
  const post = await Post.findById(postId);
 const author=await User.findById(post.author).select({username:1})

 

  res.status(200).render("read",{post,user,author})
});

// const updatePost=asyncHandler(async (req,res)=>{
//   const postId=req.params.postId;
//   console.log(postId)
//   console.log(req.body)
// })

const deletePost = asyncHandler(async (req, res) => {
  const postId = req.params.postId;

  if (!postId) {
    console.log("post id not found");
  }
  const userId = String(req.user._id);
  const post = await Post.findById(postId);
  const author = String(post.author._id);

  if (userId != author) {
    console.log("you cannot delete post");
    console.log(userId, author);
  }

  await Post.findByIdAndDelete(postId);

  res.status(200).redirect("/api/v1/post/myPosts");

});


const updatePost = asyncHandler(async (req, res) => {

  const postId = req.params.postId;
  const { title, content } = req.body;
  console.log(postId)
 

  


  if (!postId) {
    console.log("post id not found");
  }

  if (!(title || content)) {
    console.log("no field found");
  }

  const updatedPost = await Post.findByIdAndUpdate(
    postId,
    { $set: { title: title, content: content } },
    { new:true}
  );

  if (!updatedPost) {
    console.log("some problem while changing");
  }
  console.log(updatedPost);
  res.status(200).redirect("/api/v1/post/myPosts") //.json(200, updatedPost, "post updated successfully");
});
const getAllPost = asyncHandler(async (req, res) => {
 try {
   let { query, sortBy, sortType, page = 1, limit = 10 } = req.query;
   page = Number(page);
   limit = Number(limit);
   let sort = 1;
   let sortByField = "title";
   
   if (!query) {
     console.log("Search value not found");
   }
 

 
   if (sortType) {
    sortType==="desc"?sort=-1:sort=1
   }
 
   if (sortBy) {
     sortByField = sortBy;
   }
 
  
   const skip=(page - 1) * limit
   const post = await Post.aggregate([
     {
       $match: {
         title: { $regex: query, $options: "i" },
       },
     },
     {
       $sort: {
         [sortByField]: sort,
       },
     },
     {
       $skip: skip, 
     },
     {
       $limit: limit, 
     },
     {
      $addFields: { "creationDate":  {$dateToString:{format: "%d-%m-%Y", date: "$createdAt"}}}
    },
     
     
     {
      $project:{updatedAt:0,__v:0}
    }
   ]);
   console.log(post)
   if(!post)
    {
      res.json(message="no post found")
    }
   const user=req.user
   res.status(200).render("search",{post,query,user});
 } 
 catch (error) {
  res.status(500).json(new ApiResponse(500,error,"something went wrong while searching document"))
 }
});


const getAllMyPost=asyncHandler(async (req,res)=>{

 

   
 
   
   try {
    const user=req.user
    const userId = user._id;
    let sort = 1;
    let sortByField = "title";
    console.log(sortByField, sort);
    const posts = await Post.aggregate([
      {
        $match: {
          author: userId
        }
      },
      {
        $sort: {
          [sortByField]: sort
        }
      },
      {
        $project:{title:1,content:1,likes:1}
      }
     
      
    ]);
    res.render("myPost",{user,posts})
  
    // console.log("User's Posts:", posts,posts.length
    // ); 
  
    
  }
   
  catch (error) {
    console.error("Error fetching user's posts:", error); 
    res.status(500).json(new ApiResponse(500,error,"error fetching user's posts"));
  }
  


})

const allPost=async function(){
  return await Post.find()




}

export { allPost,createPost, getPost, deletePost, updatePost, getAllPost,getAllMyPost};
