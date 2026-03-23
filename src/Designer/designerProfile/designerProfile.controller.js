// controllers/designer.controller.js
import DesignerService from "./designerProfileService.js";
import { DesignerValidator } from "./designerProfileValidationSchema.js";
import AppError from "../../errorHandlers/appError.js";
import Labels from "../../utils/labels.js";
import ResponseHandler from "../../utils/responseHandler.js";

class DesignerController {

 
// Create designer profile
   
  static createDesignerProfile = async (req, res, next) => {
    try {
      //Validate input using Joi
      const { error, value } = DesignerValidator.validate(req.body, { abortEarly: false });

      if (error) {
        const messages = error.details.map(d => d.message).join(", ");
        Labels.controllerLog.warn("Designer validation failed", { messages, userId: req.user.id });
        return next( new AppError(messages, 400));
      }

      //  Get userId from JWT (req.user set by auth middleware)
      const userId = req.user._id;

      //  Call service layer to create designer
      const result = await DesignerService.createDesigner(userId, value);

      Labels.controllerLog.info("Profile successfully created",{result})
     
      return ResponseHandler.success("Profile successfully created",result)

    } catch (err) {
      next(err); 
    }
  };


  //  Get logged-in designer profile

  static getMyDesignerProfile = async (req, res, next) => {
    try {
      const userId = req.user._id;
      const designerProfile = await DesignerService.getDesignerByUserId(userId);

      return ResponseHandler.ok("Profile successfully retrieved",designerProfile)
    } catch (err) {
      next(err);
    }
  };


  //  Update designer profile

  static updateDesignerProfile = async (req, res, next) => {
    try {
      const userId = req.user._id;

      // Validate input
      const { error, value } = DesignerValidator.validate(req.body, { abortEarly: false });
      if (error) {
        const messages = error.details.map(d => d.message).join(", ");
        Labels.controllerLog.warn("Designer update validation failed", { messages, userId });
        return next( new AppError(messages, 400));
      }

      const updatedDesigner = await DesignerService.updateDesigner(userId, value);
      return ResponseHandler.success("Profile successfully updated",updatedDesigner)
      
    } catch (err) {
      next(err);
    }
  };
}

export default DesignerController;