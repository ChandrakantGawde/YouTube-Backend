import mongoose, { Schema} from "mongoose";

const subscriptionScema = new Schema(
   {
     subscriber: {
        type: Schema.Types.ObjectId,  // one who subscribing the channel, User
        ref: "User"
     },
     channel: {
        type: Schema.Types.ObjectId,  // one to whom subscriber subscribing, User
        ref: "User"
     }
   }
);

export const Subscription = mongoose.model("Subscription", subscriptionScema);