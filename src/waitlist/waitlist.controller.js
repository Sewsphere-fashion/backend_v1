import CreateWaitlist from "./waitlist.service.js";
import ResponseHandler from "../utils/responseHandler.js";
import Labels from "../utils/labels.js";

class WaitListController{

    static createEmail = async(req,res,next)=>{

        try{
            const {email,role} = req.body
            const user = await CreateWaitlist.waitlistEmail(email,role)
            Labels.controllerLog.info(`${req.body} successfully added to waitlist`)
            return ResponseHandler.success(res,"Successfully added to the waitlist",user)
        }
        catch(error){
            next(error)
        }

    }
    static getAllEmails = async(req,res,next)=>{

        try{
            const emails = await CreateWaitlist.getWaitlistEmails()
            return ResponseHandler.success(res,"all waitlist email retrieved",emails)
        }
        catch(error){
            next(error)
        }

    }
};

export default WaitListController;