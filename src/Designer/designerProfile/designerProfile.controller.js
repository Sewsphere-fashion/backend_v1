import DesignerService from "./designerProfileService.js";
import { DesignerValidator } from "./designerProfileValidationSchema.js";
import AppError from "../../errorHandlers/appError.js";
import Labels from "../../utils/labels.js";
import ResponseHandler from "../../utils/responseHandler.js";

class DesignerController {
  // Create designer profile
  static createDesignerProfile = async (req, res, next) => {
    try {
      const { error, value } = DesignerValidator.validate(req.body, {
        abortEarly: false,
      });

      if (error) {
        const messages = error.details.map((d) => d.message).join(", ");
        Labels.controllerLog.warn("Designer validation failed", {
          messages,
          userId: req.user?._id,
        });
        return next(new AppError(messages, 400));
      }

      const userId = req.user._id;
      const result = await DesignerService.createDesigner(userId, value);

      Labels.controllerLog.info("Designer profile successfully created", {
        userId,
      });

      return ResponseHandler.success(
        res,
        "Profile successfully created",
        result,
      );
    } catch (err) {
      if (err.isOperational) {
        Labels.controllerLog.warn("Create designer profile failed", {
          userId: req.user?._id,
          reason: err.message,
        });
        return next(err);
      }
      Labels.controllerLog.error("Unexpected error creating designer profile", {
        userId: req.user?._id,
        error: err,
      });
      return next(new AppError("Something went wrong", 500));
    }
  };

  // Get logged-in designer profile
  static getMyDesignerProfile = async (req, res, next) => {
    try {
      const userId = req.user._id;
      const designerProfile = await DesignerService.getDesignerByUserId(userId);

      Labels.controllerLog.info("Designer profile successfully retrieved", {
        userId,
      });

      return ResponseHandler.ok(
        res,
        "Profile successfully retrieved",
        designerProfile,
      );
    } catch (err) {
      if (err.isOperational) {
        Labels.controllerLog.warn("Get designer profile failed", {
          userId: req.user?._id,
          reason: err.message,
        });
        return next(err);
      }
      Labels.controllerLog.error(
        "Unexpected error fetching designer profile",
        {
          userId: req.user?._id,
          error: err,
        },
      );
      return next(new AppError("Something went wrong", 500));
    }
  };

  // Update designer profile
  static updateDesignerProfile = async (req, res, next) => {
    try {
      const userId = req.user._id;

      const { error, value } = DesignerValidator.validate(req.body, {
        abortEarly: false,
      });

      if (error) {
        const messages = error.details.map((d) => d.message).join(", ");
        Labels.controllerLog.warn("Designer update validation failed", {
          messages,
          userId,
        });
        return next(new AppError(messages, 400));
      }

      const updatedDesigner = await DesignerService.updateDesigner(
        userId,
        value,
      );

      Labels.controllerLog.info("Designer profile successfully updated", {
        userId,
      });

      return ResponseHandler.success(
        res,
        "Profile successfully updated",
        updatedDesigner,
      );
    } catch (err) {
      if (err.isOperational) {
        Labels.controllerLog.warn("Update designer profile failed", {
          userId: req.user?._id,
          reason: err.message,
        });
        return next(err);
      }
      Labels.controllerLog.error(
        "Unexpected error updating designer profile",
        {
          userId: req.user?._id,
          error: err,
        },
      );
      return next(new AppError("Something went wrong", 500));
    }
  };
}

export default DesignerController;