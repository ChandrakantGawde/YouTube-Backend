import { Router } from "express";
import { loginUser, logoutUser, registerUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { validateRegisterUser } from "../middlewares/validateRegisterUser.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(
  upload.fields([  // add uplod middleware to uplod files, here we have 2 files hence we use fields with array of object
    { name: "avatar", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  validateRegisterUser,
  registerUser
);

router.route("/login").post(loginUser);

//Secured routs 
router.route("/logout").post( verifyJWT, logoutUser); // add verifyJWT as middleware to check user is Authrorized or not

export default router;
