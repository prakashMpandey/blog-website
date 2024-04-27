import mongoose,{Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
const postSchema= new Schema({
    title:{
        type:String,
        required:[true,"title is required"],       
    },
    content:{
        type:String,
        required:[true,"content is missing"]

    },
    postImage:{
        type:String,
        
    },
    author:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    likes:{
        type:Number,
        default:0
    }
   

},{timestamps:true})
postSchema.plugin(mongooseAggregatePaginate)

export const Post=mongoose.model('Post',postSchema)

