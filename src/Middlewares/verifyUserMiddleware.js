import AppError from "../errorHandlers/appError.js";
import User from "../Users/user.model.js";

// verifies logged In users
export const verifyLoggedInUser = (req, res, next) => {
  try {
    if (!req.user) {
      return next(new AppError("Authentication required", 401));
    }
    if (!req.user.emailVerifiedAt) {
      return next(new AppError("Please verify your email to access this route", 403));
    }
    next();
  } catch (err) {
    return next(new AppError("Something went wrong", 500));
  }
};

// used for routes that won't mind enumeration
export const verifyUserByEmail = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) return next(new AppError("Email is required", 400));

    const user = await User.findOne({ email });

    if (!user) {
      return next(new AppError("User not found", 404));
    }

    req.user = user;
    next();
  } catch (err) {
    return next(new AppError("Something went wrong", 500));
  }
};