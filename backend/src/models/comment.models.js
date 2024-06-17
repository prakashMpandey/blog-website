import mongoose,{Schema} from "mongoose";

const commentSchema=new Schema({
    content:{
        type:String,
        required:true
    },
    post:{
        type:Schema.Types.ObjectId,
        ref:'Post',
       

    },
    author:{
        type:Schema.Types.ObjectId,
        ref:'User',
        

    }

},{timestamps:true})

const Comment=mongoose.model('Comment',commentSchema)

export {Comment}