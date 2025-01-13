import { User } from "../models/user.model.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

                                           // ( res, res, next) here sometime we not use res hence we use _ 
export const verifyJWT = asyncHandler( async (req, _ , next) => {
 
    try{
          // we have to get cookies from req
          const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")

          if(!token){
              throw new ApiError(401, "Unauthorized request");  
          };

          const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRT);

          const user = User.findById(decodedToken._id).select("-password -refreshToken");// remove this 2 filds 
              // here we use decodedToken._id because while creating token we pass _id in it with email or useename 

         if(!user){
            throw new ApiError(401, "Invalid Access Token");
         };

         req.user = user;
         next() // this is the middleware thats why we use next 

    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid Access Token");
    }
});