import express, { json } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import ejs from "ejs";




const app=express();

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))
app.use(json({
    limit:"16kb"
}))
app.use(express.urlencoded({extended:true,limit:"10kb"}))

app.use(cookieParser())
app.set("view engine","ejs")
app.use(express.static("public"))

app.set("views","views")
//routes

import userRouter from "./routes/user.routes.js"
import postRouter from "./routes/post.routes.js"
import likeRouter from "./routes/like.routes.js"
import commentRouter from "./routes/comment.routes.js"
import homeRouter from "./routes/home.routes.js"
//routes declaration
app.use("/api/v1/users",userRouter)
app.use("/api/v1/post",postRouter)
app.use("/api/v1/post",likeRouter)
 app.use("/api/v1/post",commentRouter)
 app.use("/api/v1/home",homeRouter)


export {app}