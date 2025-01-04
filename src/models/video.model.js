import mongoose, { Schema } from 'mongoose';
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new Schema(
    {
        videoFile: {
            type: String,  // cloudinary url
            require: true
        },
        thumbnail: { 
            type: String,  // cloudinary url
            require: true
        },
        description: { 
            type: String,  
            require: true
        },
        duration: { 
            type: Number,  
        },
        views: {
            type: Number,
            default: 0
        },
        isPublic: {
            type: Boolean,
            default: true
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    },
    {
        timestamps: true
    }
);

videoSchema.plugin(mongooseAggregatePaginate);

export const Video = mongoose.Schema("Video", videoSchema);