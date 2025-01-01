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
