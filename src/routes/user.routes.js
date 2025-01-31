import { Router } from "express";
import { changeCurrentPassword, getCurrentUser, getUserChannelProfile, getWatchHistory, loginUser, logoutUser, refreshAccessToken, registerUser, updateAccountDetails, updateUserAvatar, updateUserCoverImage } from "../controllers/user.controller.js";
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

router.route("/login").post( loginUser);

//Secured routs 
router.route("/logout").post( verifyJWT, logoutUser); // add verifyJWT as middleware to check user is Authrorized or not
router.route("/refresh-token").post(refreshAccessToken);
router.route("/change-password").post(validateRegisterUser, verifyJWT, changeCurrentPassword);
router.route("/current-user").get(verifyJWT, getCurrentUser);
router.route("/update-account").patch(validateRegisterUser, verifyJWT, updateAccountDetails);

router.route("/avatar").patch(verifyJWT, upload.single("avatar"), updateUserAvatar);
router.route("/cover-image").patch(verifyJWT, upload.single("coverImage"), updateUserCoverImage);

router.route("/c/:username").get(verifyJWT, getUserChannelProfile);
router.route("/history").get(verifyJWT, getWatchHistory);


export default router;
