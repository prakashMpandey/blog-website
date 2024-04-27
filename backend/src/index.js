import dotenv from "dotenv"
import connectDB from "./db/index.js";
import {app} from "./app.js"
dotenv.config()

connectDB()
.then(
    app.listen(process.env.PORT,()=>{
        console.log("server is running")
    })
)
.catch((err)=>{
    console.log("mongo db connection failed",err)
})


