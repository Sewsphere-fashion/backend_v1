import AppError from "../errorHandlers/appError.js";

export const restrictTo = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError("You are not logged in", 401));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new AppError("You do not have permission to perform this action", 403));
    }

    next(); 
  };
};