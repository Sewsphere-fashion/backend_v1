import express from "express";
import {
  uploadPortfolioItem,
  removePortfolioItem,
  getDesignerPortfolio,
} from "../designerPortfolio/designerPortfolio.controller.js";
import { authMiddleware } from "../../Middlewares/authMiddleware.js";
import {restrictTo} from "../../Middlewares/restrictTo.js"

const portfolioRouter = express.Router();

portfolioRouter.get("/", authMiddleware, getDesignerPortfolio); 
portfolioRouter.post("/", authMiddleware, restrictTo(['designer']),uploadPortfolioItem); 
portfolioRouter.delete("/:itemId", authMiddleware,restrictTo(['designer']), removePortfolioItem); 

export default portfolioRouter;
