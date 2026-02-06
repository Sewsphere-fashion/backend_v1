import CreateWaitlist from "./waitlist.service.js";
import ResponseHandler from "../utils/responseHandler.js";
import Labels from "../utils/labels.js";

class WaitListController{

    static createEmail = async(req,res,next)=>{

        try{
            const {email,role} = req.body
            const user = await CreateWaitlist.waitlistEmail(email,role)
            Labels.controllerLog.info(`Email ${email} successfully added to waitlist as ${role}`)
            
            return ResponseHandler.success(res,"Successfully added to the waitlist",user)
        }
        catch(error){
            next(error)
        }

    }
    static getAllEmails = async(req,res,next)=>{

        try{
            const emails = await CreateWaitlist.getWaitlistEmails()
            Labels.controllerLog.info(`All email retrieved: ${emails.length} total`)
            return ResponseHandler.success(res,"all waitlist email retrieved",emails)
        }
        catch(error){
            Labels.controllerLog.error("Error retrieving emails")
            next(error)
        }
    }
};

export default WaitListController;