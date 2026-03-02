import express from "express"
import WaitListController from "./waitlist.controller.js"
import validate from "../Middlewares/validationMiddleware.js";
import waitlistValidationSchema from "./waitlist.validationSchema.js";
// import sendNewEmail from "../helpers/email.js";

const waitlistRouter = express.Router()

// waitlistRouter.get("/test-email",async(req,res)=>{
//     await sendNewEmail("olubiyibabajide@gmail.com","Designer")
//     res.send("Email sent")
// })
waitlistRouter.get("/ping",(req,res)=>{
     res.status(200).json({status : "alive"})
})
waitlistRouter.post("/",validate(waitlistValidationSchema),WaitListController.createEmail)
waitlistRouter.get("/",WaitListController.getAllEmails)

export default waitlistRouter;