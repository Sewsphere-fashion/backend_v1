import AppError from "../errorHandlers/appError.js";

export const verifyUser = (req, res, next) => {
  if (!req.user) {
    return next(new AppError("Authentication required", 401));
  }

  if (!req.user.isVerified) {
    return next(new AppError("Please verify your email to access this route", 403));
  }

  next();
};