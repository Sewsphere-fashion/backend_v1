import express from "express"
import { registerUser,loginUser,forgotPassword,resetPassword,resendVerification } from "./user.controller.js"
import { verifyEmail } from "./user.controller.js"
import RateLimiter from "../guards/rateLimiter.js"

const userRoute = express.Router()

userRoute.post("/register",RateLimiter.registerLimiter,registerUser)
userRoute.patch("/verify-email",verifyEmail)
userRoute.post("/resend-verification", RateLimiter.resendVerificationLimiter, resendVerification);
userRoute.post("/login",RateLimiter.loginLimiter,loginUser)
userRoute.post("/forgot-password",RateLimiter.forgotPasswordLimiter,forgotPassword)
userRoute.post("/reset-password",RateLimiter.resetPasswordLimiter,resetPassword)

export default userRoute;