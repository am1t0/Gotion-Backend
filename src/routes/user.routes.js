import {Router } from "express";
 import { veryfyJWT } from "../middlewares/auth.middleware.js";
import { registerUser,loginUser,logoutUser,refreshAccessToken, getUserData ,getGitToken,updateUser} from "../controllers/user.controller.js";

const router = Router();

router.route("/register").post(registerUser)

router.route("/login").post(loginUser);

// secured routes 
router.route("/logout").post(
   veryfyJWT, logoutUser
)

router.route("/user-data").get(veryfyJWT,getUserData);

router.route("/gitToken/:userId").get(veryfyJWT,getGitToken);

router.route("/refresh-token").post(refreshAccessToken)

router.route("/update-user/:username").patch(veryfyJWT,updateUser)

export default router;