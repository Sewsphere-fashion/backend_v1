// controllers/userController.js
import UserService from "./user.service.js";
import {
  registerUserValidationSchema,
  loginUserValidationSchema,
} from "./user.validation.js";
import AppError from "../errorHandlers/appError.js";
import ResponseHandler from "../utils/responseHandler.js";
import Labels from "../utils/labels.js";

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
    Labels.controllerLog.error("Unexpected error during user registration", {
      email: req.body?.email,
      error: err,
    });
    next(err);
  }
};

export const verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.query;
    const result = await UserService.verifyEmail(token);
    Labels.controllerLog.info(`${result.user.email} successfully verified`, {
      email: result.user.email,
    });
    //  return res.redirect("/verification-success")

    return res.status(200).json({
      status: "success",
      message: "Email verifcation successful",
    });
  } catch (err) {
    Labels.controllerLog.error("Email verification failed", { error: err });
    // return res.redirect("/verification-failed")
    return res.status(err.statusCode || 400).json({
      status: "failed",
      message: "Email verification failed",
    });
    next(error);
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
    Labels.controllerLog.error("Resend verification failed", { error: err });
    return res.status(err.statusCode || 400).json({
      status: "fail",
      message: err.message || "Resend verification failed",
    });
  }
};

export const loginUser = async (req, res, next) => {
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

    Labels.controllerLog.info("User logged in successfully", {
      email: result.user.email,
      role: result.user.role,
    });

    return ResponseHandler.success(
      res,
      "Login successful",
      { user: result.user, token: result.token },
      200,
    );
  } catch (err) {
    Labels.controllerLog.error("Unexpected error during login", {
      email: req.body?.email,
      error: err,
    });
    next(err);
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

    const result = await UserService.forgotPassword(value.email);
    return res.status(200).json({
      status: "success",
      message: result.message,
    });
  } catch (err) {
    Labels.controllerLog.error("Forgot password failed", { error: err });
    return res.status(err.statusCode || 400).json({
      status: "fail",
      message: err.message || "Forgot password failed",
    });
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
      return next(new AppError(messages.join(", "), 400));
    }

    const { token } = req.query;
    const result = await UserService.resetPassword(token, value.newPassword);
    return res.status(200).json({
      status: "success",
      message: result.message,
    });
  } catch (err) {
    Labels.controllerLog.error("Reset password failed", { error: err });
    return res.status(err.statusCode || 400).json({
      status: "fail",
      message: err.message || "Reset password failed",
    });
  }
};
