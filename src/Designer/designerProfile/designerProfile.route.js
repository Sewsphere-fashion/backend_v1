import { verifyLoggedInUser} from "../../Middlewares/verifyUserMiddleware.js";
import { authMiddleware } from "../../Middlewares/authMiddleware.js";
import { restrictTo } from "../../Middlewares/restrictTo.js";
import DesignerController from "./designerProfile.controller.js";
import express from "express"

const designerRoute = express.Router()

designerRoute.post("/",authMiddleware,verifyLoggedInUser,restrictTo("designer"),DesignerController.createDesignerProfile)
designerRoute.get("/me",authMiddleware, verifyLoggedInUser, restrictTo("designer"), DesignerController.getMyDesignerProfile);
designerRoute.patch("/me", authMiddleware,verifyLoggedInUser, restrictTo("designer"), DesignerController.updateDesignerProfile);

export default designerRoute;