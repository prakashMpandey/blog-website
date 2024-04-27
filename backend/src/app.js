import express, { json } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app=express();

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))
app.use(json({
    limit:"16kb"
}))
app.use(express.urlencoded({extended:true,limit:"10kb"}))
app.use(express.static('punlic'))
app.use(cookieParser())


//routes

import userRouter from "./routes/user.routes.js"


//routes declaration
app.use("/api/v1/users",userRouter)
 

export {app}