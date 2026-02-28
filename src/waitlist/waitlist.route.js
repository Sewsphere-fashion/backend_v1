import express from "express"
import WaitListController from "./waitlist.controller.js"
import validate from "../Middlewares/validationMiddleware.js";
import waitlistValidationSchema from "./waitlist.validationSchema.js";

const waitlistRouter = express.Router()

waitlistRouter.post("/",validate(waitlistValidationSchema),WaitListController.createEmail)
waitlistRouter.get("/",WaitListController.getAllEmails)

export default waitlistRouter;