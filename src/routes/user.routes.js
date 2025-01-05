import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { validateRegisterUser } from "../middlewares/validateRegisterUser.middleware.js";

const router = Router();

router.route("/register").post(
  upload.fields([  // add uplod middleware to uplod files, here we have 2 files hence we use fields with array of object
    { name: "avatar", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  validateRegisterUser,
  registerUser
);

export default router;
