import { V2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({ 
    cloud_name: process.env.CLOUDINAY_CLOUD_NAME, 
    api_key: process.env.CLOUDINAY_API_KEY, 
    api_secret: process.env.CLOUDINAY_API_SECRET 
});

const uploadOnCloudinary = async (localFilePath) => {
 
    try{
        if(!localFilePath) return null ;

        // Upload file on cloudinary
        const response = await cloudinary.uploader.upload( localFilePath, { resource_type : "auto"});

        // if file upload 
        console.log("File is upload on cloudinary ", response.url)
        return response;

    } catch (error){
         // here we have to remove the file from our server as upload operation got faild 

         fs.unlinkSync(localFilePath);  
         return null ;
    }
}

export {uploadOnCloudinary}