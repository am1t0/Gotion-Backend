import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js"
import jwt from "jsonwebtoken"
import User from '../modals/user.modal.js'

// response (res) is not be used here hence underscore used ___
export const veryfyJWT = asyncHandler(async (req,_,next)=>
{
   
    try {
    
    // here we are creating  a variable called token that will store the jwt sent by the user in the header. We can
    const token = req.cookies?.accessToken || req.header
    ("Authorization")?.replace("Bearer " ,"");

    //const token = localStorage.getItem('access_token') || req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

    if(!token){
        throw new ApiError(401,"Unauthorized request");
    }

    //decoding the token and getting details that we have stored while creating it 
 const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)

   // now finding user from database
const user = await User.findById(decodedToken?._id).select
("-password -refreshToken")

// if not found user with that access token
if(!user){
    // 
    throw new ApiError(404,'User not found')
}
req.user = user;

next() ;

} catch (error) {
        throw new ApiError(401,error.message || "Invalid access token")
}
}) 