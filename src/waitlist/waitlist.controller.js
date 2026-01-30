import CreateWaitlist from "./waitlist.service.js";
import ResponseHandler from "../utils/responseHandler.js";

class WaitListController{

    static createEmail = async(req,res,next)=>{

        try{
            const {email,role} = req.body
            const user = await CreateWaitlist.waitlistEmail(email,role)
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