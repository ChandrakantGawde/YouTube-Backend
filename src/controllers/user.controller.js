import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { validationResult } from "express-validator";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/apiResponse.js";
import jwt from "jsonwebtoken";

const generateAccessAndRefreshTokens = async (userId) => { // create sampre method for tokens
    
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new ApiError(404, "User not found");
        }
        
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError( 500, "Somethig went wrong while generating refresh and access token");
    }

}

const registerUser = asyncHandler( async (req, res) => {
    
    //  get user details from frontend
    // apply validation check filds are not empty
    // check user is allready exists : base on unique key like email or username
    // check for images, avatar
    // upload them on cloudinary
    // create user object - create entry in db
    // remove password and refrech token fild from response
    // check for user creation 
    // return res

    const { username, email, fullName, password } = req.body ;
    console.log("Request body ", req.body);
    console.log("Request files ", req.files);
    // here we apply some method while creating array of req.body filds and apply validation 

    // if([ username, email, fullName, password ].some( (filds) => filds.trim === " " ) ){
    //     throw new ApiError( 400, "All fields are required")
    // }

    const errors = validationResult(req); // get errors as validationResult from express-validator 

    if (!errors.isEmpty()) {
        // Map validation errors into a readable format
        const errorDetails = errors.array().map(err => ({
            field: err.param,
            message: err.msg,
        }));

        throw new ApiError( 400,  "Validation Error",  errorDetails);
    }  

    // validation is ok then check user allready exists
    const existedUser = await User.findOne({
        $or: [{username}, {email}]
    });

    if(existedUser) {
        throw new ApiError( 409, "User with Email or Username already exists");
    };

    // get image path from file
    const avatarLocalPath = req.files?.avatar[0]?.path;
    //const coverImageLocaalPath = req.files?.coverImage[0]?.path;

    let coverImageLocaalPath ;
    if( req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){
        coverImageLocaalPath = req.files?.coverImage[0]?.path;
    }

    if(!avatarLocalPath){
        throw new ApiError( 400, "Avatar file is required")
    }

    // uploa on cloudinary
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocaalPath);

    if(!avatar){
        throw new ApiError( 400, "Avatar file is required")
    }


    const user = await User.create({
        fullName,
        avatar: avatar.url,  // here we check the avatar so we directly store it in database 
        coverImage: coverImage?.url || " ", // here we not check the coverimage so...
        email: email,
        password: password,
        username: username.toLowerCase()
    })
    console.log("user", user)

    const createdUser = await User.findById(user._id).select("-password -refreshToken"); // remove password and refreshToken 
    console.log("createdUser", createdUser)                                                                                    // while returning the user 

    if(!createdUser){
        throw new ApiError( 500, "Something went wrong while creating the user")
    }

    return res.status(201).json(
        new ApiResponse( 200, createdUser, "User registered Successfully" )
    )
});

const loginUser = asyncHandler( async (req, res) => {

    // get the username, email and password from reqbody
    // find the user 
    // check paasword
    // access and refresh token
    // send cookie

    const {email, username, password} = req.body;

    if( !(email || username)){
        throw new ApiError(400, "Username or Password is required")
    };

    const user = await User.findOne({
        $or: [{email}, {username}]
    });

    if(!user){
        throw new ApiError(404, "user does not exist");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if(!isPasswordValid){
        throw new ApiError(401, "Invalid user credentials")
    };

    const { accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id)// create tokens with saprate method
    // destructure the object 
    const loggenedInUser = await User.findById(user._id).select("-password -refreshToken");// remove this filds from return object


    // here we have to send cookies to user 
    // here we have one problem that we can modify the cookie in frontend it a default dehaviour of cookie

    const options = {    // hence we set options that cookie can not be modifyed on frontend
        httpOnly : true, // it modify only on server
        secure : true
    };

    return res.status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200,
            {
                user: loggenedInUser, accessToken, refreshToken
                       // here we pass seprate accesToken and refreshToken if user want to store it local storage
            }, 
            "User logged In Sucessfully"
        )
    )
});

const logoutUser = asyncHandler( async (req, res) => {
    // if we have to logout user then we clear the cookies and allso clear the refreshToken present in user schema

    await User.findByIdAndUpdate(req.user._id,{ // here we use findByIdAndUpdate because in normal method we have to save user after update 
        $set: {                           // and this method save user automatically 
            refreshToken : undefined
        }
    },
    {
        new : true   // add extra parameter that gives entire updated object of User
    });

    const options = {    
       httpOnly: true,
       secure: true
    }

    return res.status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json( new ApiResponse(200, {}, "User logged Out"));
    
});

const refreshAccessToken = asyncHandler( async (req, res) => {

    // get refresh token from user 
    // not get then throw error
    // verify the token here we get decodedToken
    // get id from decodedToken and find the user in database
    // compare that user refreshToken and our incomingRefreshToken 
    // genrate new Refresh token with generateAccessAndRefreshTokens 

    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken // handle both pc and mobile user

    if(!incomingRefreshToken){
        throw new ApiError(401, "Unauthorized Request")
    }

   try {
     const decodedToken = jwt.verify(     // decoded token 
         incomingRefreshToken,
         process.env.REFRESH_TOKEN_SECRT
     )
 
     const user = await User.findById(decodedToken._id);
 
     if(!user){
         throw new ApiError(401, "Invalid Refresh Token")
     };
 
     if(incomingRefreshToken !== user.refreshToken){
         throw new ApiError(401, "Refresh Token is expired or used");
     }
 
     const { accessToken, newRefreshToken } = await generateAccessAndRefreshTokens(user._id);
 
     const options = {
         httpOnly: true,
         secure: true
     }
     return res
     .status(200)
     .cookie("accessToken", accessToken, options)
     .cookie("refreshToken", newRefreshToken, options)
     .json(
         new ApiResponse(
             200,
             {accessToken, refreshToken: newRefreshToken},
             "Access Token Refreshed"
         )
     )
   } catch (error) {
     throw new ApiError(401, error?.message || "Invalid Refresh Token")
   }
});

export { registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken
 }