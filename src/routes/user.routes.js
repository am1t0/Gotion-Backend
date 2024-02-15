import {Router } from "express";
 import { veryfyJWT } from "../middlewares/auth.middleware.js";
import { registerUser,loginUser,logoutUser,refreshAccessToken } from "../controllers/user.controller.js";

const router = Router();

router.route("/register").post(registerUser)

router.route("/login").post(loginUser);

// secured routes 
router.route("/logout").post(
   veryfyJWT, logoutUser
)

router.route("/refresh-token").post(
  refreshAccessToken
)


export default router