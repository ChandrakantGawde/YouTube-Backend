# YouTube-Backend
Create youTube backend 

----------------------------------------------
Store images :- 
we can use 3rd party storage like AWS, Asure, Cloudinary
in that we get photos from the user and tempraty we store it on server suppose if user lost connection then we can store it on 3rd party AWS, Asure or Cloudinary , its depends on usecase many compnies directly uplod it on AWS, Asure or Cloudinary.

----------------------------------------------
Push empty folder :- .gitkeep 
We can not push empty folder within folder on Git like public/Temp, here we have to add one file name as .gitkeep 
it help us to push empty folders on git.

----------------------------------------------
.gitignore :-
in this file we can mentions those file that we not push on git, those files can contain sensitive information 
we can have git ignore genrators in market, they create gitignore files for us based on project like node.js 
https://mrkandreev.name/snippets/gitignore-generator/

----------------------------------------------
.env :- files that are not push on git 

----------------------------------------------
For importing modules we use "Type": "module" in package.json  

----------------------------------------------
Prettier :- here we add code standrds that follws by team for example how to use quote, spacing after brakets, tab width

----------------------------------------------
Use mongoose, express, dotenv dependencies

1) When we dealing with data base we have chances that we get error so better way we have to write code in try catch or promises.
2) Database is allways in another continant, we select as mumbai but soppose it code base in US, so it take time to get data so better way use async await

as soon as posible we have to import and configure dotenv in application as thy work properly 

----------------------------------------------
Here in this project we create saprate folder to connectDB connection 
create saprate app.js and import it in index as we declare connectDB as asyinc then it return promise
so here in index.js we use .then to start port and .catch to get error

----------------------------------------------
When we create app with express - focus on Request and Response
Request :- req.params, req.body (forms, json), cookie (npm i cookie-parser)

and to connect forntend with backend we have to cors - to avoid corss origin error

when we use middleware most of the times we write the app.use() hence after connection database we have to listen app 
app.use(cros()) - we can change the setting of cors that is 
here we can pass options as object that witch url is allow like  origin: "http://example.com", 
and we whiteList the url allso 

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

---------------------------------------------
Now we have to deside the what type of data we get from user 

app.use(express.json({limit: "16kb"})); // here we set limit of json 
app.use(express.urlencoded({extended: false, limit: "16kb"}));// pass data in url like if we pass stirng chandu gawde then browser think chandu_gawde
app.use(express.static("public")); // some times we store picture on server here we use public folder to store images 

---------------------------------------------
cookie-parser - we have to access the cookie from user browser and perform curd operations

---------------------------------------------

here we use async and await frequently so better way we can use customize component in that we create function

higher order function - functions define as variable and it except functions as parameter and return 

again for each api we have to pass response in that we have error message or statusCode so 
we have to predefine the structure of that message or statusCode 
so node js provide the predefine class that is Error, so we can extends this class 

but at the time of response we get response from express.js so it not provide any class so 
we have to create the own 

----------------------------------------------
We use mongoose-aggregate : - for aggregation quries, use for complex queries ( npm i mongoose-aggregate-paginate-v2)

----------------------------------------------
For manage password we use 
1) bcrypt - A bcrypt library for Node.js
or
2) bcryptjs - Optimized brycpt in plain javaScript zero dependencies, compatible to 'bcrypt'.

it help us to hash the password

here we generate AccessToken and RefreshToken

----------------------------------------------
Uploading files with Multer - use cloudinary, express-fileupload or multer

for cloudinary we use - npm i cloudinary and multer use npm i multer

here we handle file using multer but we fllow 2 steps process 
1) we store it on our local server ( if user want to change the file before save then it easy for us )
2) and at the time of final save we store it on cloudinary and remove it from local server

for that we use commen folder and reuse it every time 

here we create diskStorage it has object with 2 methods destination and filename, each method had callback function

-----------------------------------------------
Http headers - key value paires send in an http request or response it provide extra information called metadata
Http Methods - perform operstions 

-----------------------------------------------
apply userModal validations with express-validator 
here we create saprate middleware same as multer name as validateRegisterUser 

-----------------------------------------------
loginUser at that time genrate refreshToken and AccessToken for that we create saprate methos and now call them 
while returning response pass cookie with option so its not editable on frontend.        

-----------------------------------------------
Create middleware name as Auth to check user is Authorized or not for sending request
1) implement logout with that auth middleware 
2) get AccessToken from cookies or header that is Bearer present in Authorization 
3) we have to decodedToken and get _id from it and get user
4) pass user to next method

clear cookie and refreshToken       // while login user getting error that accessToken not genrated, 1.5hr bug fix 

------------------------------------------------
AccessToken - keep it at user end used to authenticate and authorize a user, short lived for example minutes to a few hours 
RefreshToken/ seccion storage - store in database used to obtain a new access token without requiring the user to log in again, long lived for example days, weeks, or months

refreshAccessToken : - get token from user and verify with database token 
user has Encoded jwt token but in database we have decoded jwt token consist of header, payload and verify signature 
if user refreshTOken and database user refreshToken match genrate new tokens

