// controllers/userController.js
import UserService from "./user.service.js";
import {
  registerUserValidationSchema,
  loginUserValidationSchema,
  changePasswordValidationSchema,
  resendVerificationValidationSchema,
} from "./user.validation.js";
import AppError from "../errorHandlers/appError.js";
import ResponseHandler from "../utils/responseHandler.js";
import Labels from "../utils/labels.js";
import {
  forgotPasswordValidationSchema,
  resetPasswordValidationSchema,
} from "./user.validation.js";
import { uploadImage } from "../config/cloudinary.config.js";

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
    if (err.isOperational) {
      Labels.controllerLog.warn("Registration failed", {
        email: req.body?.email,
        reason: err.message,
      });
      return next(err);
    }
    Labels.controllerLog.error("Unexpected error during user registration", {
      email: req.body?.email,
      error: err,
    });
    return next(new AppError("Something went wrong during registration", 500));
  }
};

export const verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.params;

    await UserService.verifyEmail(token);

    Labels.controllerLog.info(`Email successfully verified`, { token });

    return res.redirect(
      "https://sewsphere-mvp.vercel.app/verification?status=success",
    );
  } catch (err) {
    if (err.isOperational) {
      Labels.controllerLog.warn("Email verification failed", {
        reason: err.message,
      });
      if (err.message.includes("already verified")) {
        return res.redirect(
          "https://sewsphere-mvp.vercel.app/verification?status=already-verified",
        );
      }
      return res.redirect(
        "https://sewsphere-mvp.vercel.app/verification?status=failed",
      );
    }
    Labels.controllerLog.error("Unexpected error during email verification", {
      error: err,
    });
    return res.redirect(
      "https://sewsphere-mvp.vercel.app/verification?status=failed",
    );
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
      return next(new AppError(messages.join(", "), 400));
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
    if (err.isOperational) {
      Labels.controllerLog.warn("Resend verification failed", {
        email: req.body?.email,
        reason: err.message,
      });
      return next(err);
    }
    Labels.controllerLog.error("Unexpected error during resend verification", {
      error: err,
    });
    return next(new AppError("Something went wrong", 500));
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

    return ResponseHandler.ok(
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
    if (err.isOperational) {
      Labels.controllerLog.warn("Login attempt failed", {
        email: req.body?.email,
        reason: err.message,
      });
      return next(err);
    }
    Labels.controllerLog.error("Unexpected error during login", {
      email: req.body?.email,
      error: err,
    });
    return next(new AppError("Something went wrong", 500));
  }
};

export const refreshToken = async (req, res, next) => {
  const REFRESH_TOKEN_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000;

  try {
    const oldRefreshToken = req.cookies.refreshToken;

    const result = await UserService.refreshToken(oldRefreshToken);

    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: REFRESH_TOKEN_EXPIRY_MS,
    });

    Labels.controllerLog.info("Token refreshed successfully", {
      email: result.user.email,
    });

    return ResponseHandler.ok(
      res,
      "Token refreshed successfully",
      {
        user: result.user,
        accessToken: result.accessToken,
        expiresAt: result.expiresAt,
      },
      200,
    );
  } catch (err) {
    if (err.isOperational) {
      Labels.controllerLog.warn("Token refresh failed", {
        reason: err.message,
      });
      return next(err);
    }
    Labels.controllerLog.error("Unexpected error during token refresh", {
      error: err,
    });
    return next(new AppError("Something went wrong", 500));
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
      Labels.controllerLog.warn("Forgot password validation failed", {
        email: req.body?.email,
        errors: messages,
      });
      return next(new AppError(messages.join(", "), 400));
    }

    await UserService.forgotPassword(value.email);

    return ResponseHandler.success(
      res,
      "If that email exists, a reset link has been sent",
    );
  } catch (err) {
    if (err.isOperational) {
      Labels.controllerLog.warn("Forgot password failed", {
        email: req.body?.email,
        reason: err.message,
      });
      return next(err);
    }
    Labels.controllerLog.error("Unexpected error during forgot password", {
      error: err,
    });
    return next(new AppError("Something went wrong", 500));
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { error, value } = resetPasswordValidationSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const messages = error.details.map((detail) => detail.message);
      Labels.controllerLog.warn("Reset password validation failed", {
        errors: messages,
      });
      return next(new AppError(messages.join(", "), 400));
    }

    const { token } = req.params;
    const result = await UserService.resetPassword(token, value.newPassword);

    return ResponseHandler.success(res, result.message);
  } catch (err) {
    if (err.isOperational) {
      Labels.controllerLog.warn("Reset password failed", {
        reason: err.message,
      });
      return next(err);
    }
    Labels.controllerLog.error("Unexpected error during reset password", {
      error: err,
    });
    return next(new AppError("Something went wrong", 500));
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
        userId: req.user?.id,
        errors: messages,
      });
      return next(new AppError(messages.join(", "), 400));
    }

    const result = await UserService.changePassword(
      req.user.id,
      value.currentPassword,
      value.newPassword,
    );

    Labels.controllerLog.info("Password changed successfully", {
      userId: req.user.id,
    });

    return ResponseHandler.ok(res, result.message);
  } catch (err) {
    if (err.isOperational) {
      Labels.controllerLog.warn("Change password failed", {
        userId: req.user?.id,
        reason: err.message,
      });
      return next(err);
    }
    Labels.controllerLog.error("Unexpected error during change password", {
      userId: req.user?.id,
      error: err,
    });
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

    Labels.controllerLog.info("User logged out successfully", {
      userId: req.user?.id,
    });

    return ResponseHandler.success(res, "Logged out successfully", null, 200);
  } catch (err) {
    if (err.isOperational) {
      Labels.controllerLog.warn("Logout failed", {
        userId: req.user?.id,
        reason: err.message,
      });
      return next(err);
    }
    Labels.controllerLog.error("Unexpected error during logout", {
      userId: req.user?.id,
      error: err,
    });
    return next(err);
  }
};

export const getGoogleAuthUrlController = (req, res, next) => {
  try {
    const url = UserService.getGoogleUrl();
    return ResponseHandler.ok(res, "Google OAuth URL", { url });
  } catch (err) {
    Labels.controllerLog.error("Failed to generate Google OAuth URL", {
      error: err,
    });
    return next(err);
  }
};

export const googleCallbackController = async (req, res, next) => {
  const code = req.query.code;

  if (!code) {
    return next(new AppError("No code provided", 400));
  }

  try {
    const googleUserInfo = await UserService.getGoogleUserInfo(code);
    const result = await UserService.googleLoginFlow(googleUserInfo);

    if (result.isNewUser) {
      return ResponseHandler.ok(res, "Complete your profile to continue", {
        isNewUser: true,
        googleProfile: result.googleProfile,
      });
    }

    const { user, accessToken, refreshToken, displayName } = result;
    return ResponseHandler.ok(res, `Login Successful! Welcome ${displayName}`, {
      isNewUser: false,
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    if (err.isOperational) {
      Labels.controllerLog.warn("Google login failed", {
        reason: err.message,
      });
      return next(err);
    }
    Labels.controllerLog.error("Unexpected error during Google login", {
      error: err,
    });
    return next(new AppError("Failed to login with Google", 500));
  }
};

export const completeGoogleProfileController = async (req, res, next) => {
  try {
    const { user, accessToken, refreshToken } =
      await UserService.completeGoogleProfileFlow(req.body);

    Labels.controllerLog.info("Google profile completed", {
      email: user.email,
    });

    return ResponseHandler.success(res, `Welcome ${user.firstName}!`, {
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        name: user.firstName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    if (err.isOperational) {
      Labels.controllerLog.warn("Google profile completion failed", {
        reason: err.message,
      });
      return next(err);
    }
    Labels.controllerLog.error("Unexpected error completing Google profile", {
      error: err.message,
    });
    return next(err);
  }
};

export const uploadProfilePicture = (req, res, next) => {
  uploadImage.single("photo")(req, res, async function (err) {
    if (err) {
      Labels.controllerLog.warn("Profile picture upload failed", {
        userId: req.user?._id,
        reason: err.message,
      });
      return next(new AppError(err.message, 400));
    }

    try {
      const imageUrl = req.file.path;
      const publicId = req.file.filename;

      const user = await UserService.updateProfilePicture(
        req.user._id,
        imageUrl,
        publicId,
      );

      Labels.controllerLog.info("Profile picture updated successfully", {
        userId: req.user._id,
      });

      res.status(200).json({
        message: "Profile picture updated",
        profilePicture: user.profilePicture,
      });
    } catch (error) {
      Labels.controllerLog.error(
        "Unexpected error during profile picture update",
        { userId: req.user?._id, error },
      );
      next(new AppError(error.message, 500));
    }
  });
};