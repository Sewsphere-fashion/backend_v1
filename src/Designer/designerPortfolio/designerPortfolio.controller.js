import { addPortfolioItem, deletePortfolioItem, getPortfolio } from "../designerPortfolio/designerPortfolio.service.js";
import { uploadImage } from "../../config/cloudinary.config.js";
import AppError from "../../errorHandlers/appError.js";
import Labels from "../../utils/labels.js";
import ResponseHandler from "../../utils/responseHandler.js";

export const uploadPortfolioItem = (req, res, next) => {
  uploadImage.single("photo")(req, res, async function (err) {
    if (err) {
      Labels.controllerLog.warn("Portfolio image upload failed", {
        userId: req.user?._id,
        reason: err.message,
      });
      return next(new AppError(err.message, 400));
    }

    try {
      const imageUrl = req.file.path;
      const publicId = req.file.filename;
      const { description } = req.body;

      if (!description) return next(new AppError("Description is required", 400));

      const item = await addPortfolioItem(req.user._id, imageUrl, publicId, description);

      Labels.controllerLog.info("Portfolio item added", {
        userId: req.user._id,
      });

      return ResponseHandler.success(res, "Portfolio item added", item);
    } catch (err) {
      if (err.isOperational) {
        Labels.controllerLog.warn("Add portfolio item failed", {
          userId: req.user?._id,
          reason: err.message,
        });
        return next(err);
      }
      Labels.controllerLog.error("Unexpected error adding portfolio item", {
        userId: req.user?._id,
        error: err,
      });
      return next(new AppError("Something went wrong", 500));
    }
  });
};

export const removePortfolioItem = async (req, res, next) => {
  try {
    await deletePortfolioItem(req.user._id, req.params.itemId);

    Labels.controllerLog.info("Portfolio item deleted", {
      userId: req.user._id,
      itemId: req.params.itemId,
    });

    return ResponseHandler.ok(res, "Portfolio item deleted");
  } catch (err) {
    if (err.isOperational) {
      Labels.controllerLog.warn("Delete portfolio item failed", {
        userId: req.user?._id,
        itemId: req.params.itemId,
        reason: err.message,
      });
      return next(err);
    }
    Labels.controllerLog.error("Unexpected error deleting portfolio item", {
      userId: req.user?._id,
      itemId: req.params.itemId,
      error: err,
    });
    return next(new AppError("Something went wrong", 500));
  }
};

export const getDesignerPortfolio = async (req, res, next) => {
  try {
    const items = await getPortfolio(req.user._id);

    Labels.controllerLog.info("Portfolio retrieved", {
      userId: req.user._id,
      count: items.length,
    });

    return ResponseHandler.ok(res, "Portfolio retrieved", {
      count: items.length,
      items,
    });
  } catch (err) {
    if (err.isOperational) {
      Labels.controllerLog.warn("Get portfolio failed", {
        userId: req.user?._id,
        reason: err.message,
      });
      return next(err);
    }
    Labels.controllerLog.error("Unexpected error fetching portfolio", {
      userId: req.user?._id,
      error: err,
    });
    return next(new AppError("Something went wrong", 500));
  }
};