import { v2 as cloudinary } from 'cloudinary';
import fs from "fs";

cloudinary.config({ 
 cloud_name:process.env.CLOUD_NAME, 
  api_key:process.env.API_KEY , 
  api_secret:process.env.API_SECRET
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null
        //upload the file on cloudinary
        console.log(localFilePath)
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        
        // file has been uploaded successfull
        //console.log("file is uploaded on cloudinary ", response.url);
        fs.unlinkSync(localFilePath) 
        return response;

    } catch (error) {
        fs.unlinkSync(localFilePath) 
        // remove the locally saved temporary file as the upload operation got failed
        return error
    }
}

const deleteOnCloudinary= async(publicUrl) =>{
try {
        const publicId = (imageURL) => imageURL.split("/").pop().split(".")[0];
        console.log(publicId)
        const response =await cloudinary.uploader.destroy(publicId, function(result) { console.log(result) });
    
        return response
} catch (error) {
    return error
}

}



export { uploadOnCloudinary,deleteOnCloudinary };
