import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { validationResult } from "express-validator";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/apiResponse.js";

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

export { registerUser }