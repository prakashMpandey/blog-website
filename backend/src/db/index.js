import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";
const connectDB=async ()=>{
    try {
        const connectionInstance=await mongoose.connect(`${process.env.MONGO_URL}/${DB_NAME}`)
        console.log(`mongodb connection successful `)
    } catch (error) {
        console.log("monogDB connection error",error)
        process.exit(1)
        
    }

}
export default connectDB