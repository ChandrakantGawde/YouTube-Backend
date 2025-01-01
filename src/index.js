//require('dotenv').config({path: './env'}); // this not a god practice
import dotenv from "dotenv";
import connectDB from "./db/index.js";

dotenv.config({
    path: "./env"
})

connectDB()







/* import express from "express";
const app = express();

// here we can use normal function to write database logic and connect it 
// in profetional way here we use IIFe that is emidiatly invoke function 

// best practice to use ; semi colen that it take fresh line some time we not use semicolen in privius line then it will help us
;( async ()=> {
    try{
       await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
       app.on("error", (error)=> {
          console.log( "error", error);
          throw error;
       })

       app.listen(process.env.PORT, ()=> {
        console.log(`App is listening on port ${process.env.PORT}`)
       })
    } catch (error) {
       console.log("ERROR ", error);
       throw error
    }
} )()
*/    