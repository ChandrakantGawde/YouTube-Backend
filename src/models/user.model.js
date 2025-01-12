import mongoose, { Schema } from  "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new Schema(
    {
        username: {
            type: String,
            require: true,
            unique: true,
            lowecase: true,
            trim: true,
            index: true  // create index on frequently use fild 
        },
        email: {
            type: String,
            require: true,
            unique: true,
            lowecase: true,
            trim: true,
        },
        fullName: {
            type: String,
            require: true,
            trim: true,
            index: true
        },
        avatar: {
            type: String, // cloudinary url
            require: true
        },
        coverImage: {
            type: String, // cloudinary url
        },
        watchHistory: [
            {
                type: Schema.Types.ObjectId,
                ref: "Video"
            }
        ],
        password: {
            type: String,
            require: [true, 'Password is required']
        },
        refreshToken: {
            type: String
        }
    },
    {
        timestamps: true
    }
); 

// use for crypting the password - bcrypt 
// before the user saves, this function runs and hashes the password
userSchema.pre("save", async function (next) {  // here we not use arrow function because here we want this context
                                                // and arrow function dosent have this 
    // now here every time user change any fild this password encrypted 
    // this is not a good approtch we have to stop that
    
    if(!this.isModified("password")) return next(); // password fild is not modify return 

    // if modify
    this.password = await bcrypt.hash(this.password, 10) // because here we have to deal with userSchema 
    next();
});

// now here we store the password in the form of hash and at the time of login, user enter password charactors 
// here we have to decryp the password 

// use coustomise method
userSchema.methods.isPasswordCorrect = async function (password) { // get user entered password from user
    return await bcrypt.compare(password, this.password); // compare user entered password and compare with the database password 
}   // here we get ture or false 


userSchema.method.generateAccessToken = function() {   
    return jwt.sign(   // jwt.sign( payload, secrt, expiresIn)
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRT, // secrt key for genrate Access token
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
};

userSchema.method.generateRefreshToken = function() { 
    return jwt.sign(   // jwt.sign( payload, secrt, expiresIn)
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRT, // secrt key for genrate Refresh token
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User", userSchema);