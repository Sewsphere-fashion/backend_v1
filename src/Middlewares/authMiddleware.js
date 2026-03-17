import User from "../Users/user.model.js"
import AppError from "../errorHandlers/appError.js";
import jwt from "jsonwebtoken"
import config from "../config/config.js";
// import {promisify} from "util"

export const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next(new AppError("Unauthorized: No token provided", 401));
    }

    const token = authHeader.split(" ")[1];

    let decoded;
    try {
      decoded = jwt.verify(token, config.secret_key);
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return next(new AppError("Session expired. Please log in again", 401));
      }
      return next(new AppError("Invalid token. Please log in again", 401));
    }

    const user = await User.findById(decoded.id).select("-password -__v");
    if (!user) {
      return next(new AppError("User no longer exists", 401));
    }

    if (user.passwordChangedAt) {
      const changedAt = parseInt(user.passwordChangedAt.getTime() / 1000);
      if (decoded.iat < changedAt) {
        return next(new AppError("Password recently changed. Please log in again", 401));
      }
    }

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};