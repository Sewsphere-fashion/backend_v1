// controllers/userController.js
import UserService from "./user.service.js";
import {registerUserValidationSchema,loginUserValidationSchema,changePasswordValidationSchema,resendVerificationValidationSchema.logout} from "./user.validation.js";
import AppError from "../errorHandlers/appError.js";
import ResponseHandler from "../utils/responseHandler.js";
import Labels from "../utils/labels.js";
import { forgotPasswordValidationSchema,resetPasswordValidationSchema } from "./user.validation.js";

export const registerUser = async (req, res, next) => {
  try {
    const { error, value } = registerUserValidationSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const messages = error.details.map((detail) => detail.message);
      Labels.controllerLog.warn("User registration validation failed", {
        email: req.body.email,
        errors: messages,
      });
      return next(new AppError(messages.join(", "), 400));
    }

    const result = await UserService.register(value);

    Labels.controllerLog.info("User registration successful", {
      email: result.user.email,
      role: result.user.role,
    });

    return ResponseHandler.success(
      res,
      result.message,
      { user: result.user },
      201,
    );
  } catch (err) {

    if(err.isOperational) return next(err)
    Labels.controllerLog.error("Unexpected error during user registration", {
      email: req.body?.email,
      error: err,
    });
    return next(new AppError("Something went wrong during registration",500));
  }
};

export const verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.query;

    await UserService.verifyEmail(token);

    Labels.controllerLog.info(`Email successfully verified for token: ${token}`, { token });
    return res.redirect("https://sewsphere-mvp.vercel.app/verification?status=success");

  } catch (err) {

    if (err.isOperational) {
      if (err.message.includes("already verified")) {
        return res.redirect("https://sewsphere-mvp.vercel.app/verification?status=already-verified");
      }
      return res.redirect("https://sewsphere-mvp.vercel.app/verification?status=failed");
    }
    
    Labels.controllerLog.error("Email verification failed", { error: err });
    return res.redirect("https://sewsphere-mvp.vercel.app/verification?status=failed");
  }
};

export const resendVerification = async (req, res, next) => {
  try {
    const { error, value } = resendVerificationValidationSchema.validate(
      req.body,
      {
        abortEarly: false,
        stripUnknown: true,
      },
    );

    if (error) {
      const messages = error.details.map((detail) => detail.message);
      Labels.controllerLog.warn("Resend verification validation failed", {
        email: req.body.email,
        errors: messages,
      });
      return next(new AppError(messages.join(", "), 500));
    }

    const result = await UserService.resendVerification(value.email);

    Labels.controllerLog.info("Verification email resent", {
      email: value.email,
    });

    return res.status(200).json({
      status: "success",
      message: result.message,
    });
  } catch (err) {
      if(err.isOperational) return next(err)
    Labels.controllerLog.error("Resend verification failed", { error: err });
    return next (new AppError("Something went wrong",500))

  }
};

export const loginUser = async (req, res, next) => {

  const REFRESH_TOKEN_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000;


  try {
    const { error, value } = loginUserValidationSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const messages = error.details.map((detail) => detail.message);
      Labels.controllerLog.warn("User login validation failed", {
        email: req.body.email,
        errors: messages,
      });
      return next(new AppError(messages.join(", "), 400));
    }

    const result = await UserService.login(value);

    // Send refresh token as httpOnly cookie
    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: REFRESH_TOKEN_EXPIRY_MS,
    });

    Labels.controllerLog.info("User logged in successfully", {
      email: result.user.email,
      role: result.user.role,
    });

    return ResponseHandler.success(
      res,
      "Login successful",
      {
        user: result.user,
        accessToken: result.accessToken,
        expiresAt: result.expiresAt,
      },
      200,
    );
  } catch (err) {
    Labels.controllerLog.error("Unexpected error during login", {
      email: req.body?.email,
      error: err,
    });
    return next(err);
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const { error, value } = forgotPasswordValidationSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const messages = error.details.map((detail) => detail.message);
      return next(new AppError(messages.join(", "), 400));
    }

    const result = await UserService.forgotPassword(value.email)
    return ResponseHandler.success(res, "If that email exists, a reset link has been sent")
  
  } catch (err) {

    if(err.isOperational) return next(err)
    Labels.controllerLog.error("Forgot password failed", { error: err });
    return next(new AppError("Something went wrong",500))

}};

export const resetPassword = async (req, res, next) => {
  try {
    const { error, value } = resetPasswordValidationSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const messages = error.details.map((detail) => detail.message);
      return next(new AppError(messages.join(", "), 400));
    }

    const { token } = req.query;
    const result = await UserService.resetPassword(token, value.newPassword);

    return ResponseHandler.success(res,result.message)
  } catch (err) {
      if(err.isOperational) return next(err)
    Labels.controllerLog.error("Reset password failed", { error: err });
    return next (new AppError("Something went wrong",500))
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const { error, value } = changePasswordValidationSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const messages = error.details.map((detail) => detail.message);
      Labels.controllerLog.warn("Change password validation failed", {
        error: messages,
      });
      return next(new AppError(messages.join(", "), 400));
    }

    const result = await UserService.changePassword(
      req.user.id,
      value.currentPassword,
      value.newPassword
    );

    Labels.controllerLog.info("Password changed successfully", { userId: req.user.id });

    return ResponseHandler.ok(res, result.message);

  } catch (err) {
    if (err.isOperational) return next(err);
    Labels.controllerLog.error("Change password failed", { error: err });
    return next(new AppError("Something went wrong", 500));
  }
};

export const logoutUser = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    await UserService.logout(refreshToken);

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return ResponseHandler.success(res, "Logged out successfully", null, 200);
  } catch (err) {
    Labels.controllerLog.error("Unexpected error during logout", {
      userId: req.user?.id,
      error: err,
    });
    return next(err);
  }
};
