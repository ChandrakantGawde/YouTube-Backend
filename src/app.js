import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

app.use(express.json({limit: "16kb"})); // here we set limit of json 
app.use(express.urlencoded({extended: false, limit: "16kb"}));// pass data in url like if we pass stirng chandu gawde then browser think chandu_gawde
app.use(express.static("public")); // some times we store picture on server here we use public folder to store images 
app.use(cookieParser()); // access cookie from user browser 

// routs import 
import userRouter from './routes/user.routes.js'


// routs declaration
app.use("/api/v1/users", userRouter);

export {app};