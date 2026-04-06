import express from "express"
import { registerUser,loginUser,forgotPassword,resetPassword,resendVerification,changePassword ,logoutUser,getGoogleAuthUrlController,googleCallbackController,completeGoogleProfileController} from "./user.controller.js"
import { verifyEmail } from "./user.controller.js"
import RateLimiter from "../guards/rateLimiter.js"
import { authMiddleware } from "../Middlewares/authMiddleware.js"
import { verifyLoggedInUser} from "../Middlewares/verifyUserMiddleware.js"

const userRoute = express.Router()

// userRoute.post("/register", RateLimiter.registerLimiter,registerUser)
userRoute.post("/register", registerUser)
userRoute.get("/verify-email",verifyEmail)
// userRoute.post("/resend-verification",RateLimiter.resendVerificationLimiter, resendVerification)
userRoute.post("/resend-verification",resendVerification)
// userRoute.post("/login",RateLimiter.loginLimiter,loginUser)
userRoute.post("/login",loginUser)
userRoute.post("/forgot-password",RateLimiter.forgotPasswordLimiter,forgotPassword)
// userRoute.post("/reset-password",RateLimiter.resetPasswordLimiter,resetPassword)
userRoute.post("/reset-password",resetPassword)
userRoute.patch("/change-password",authMiddleware,verifyLoggedInUser,changePassword)
userRoute.post("/logout",authMiddleware,logoutUser)

// oauth routes
userRoute.get("/google/url", getGoogleAuthUrlController);
userRoute.get("/google/callback", googleCallbackController);
userRoute.post("/google/complete-profile",completeGoogleProfileController)

export default userRoute;