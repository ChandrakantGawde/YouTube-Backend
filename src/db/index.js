import mongoose from "mongoose";
import { DB_NAME } from "../constants.js"; // get database name

const connectDB = async ()=> {
    try{
        const connectionInstance =  await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        console.log(`\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`)
    } catch(error){
       console.log("MONGODB connection failed ", error); 
       process.exit(1); // node.js provide extra feature called process to get out of this like exsit 
    }
}
export default connectDB;

// here in this project we use async handler many time 
// so better way we use customize function and use it every time 