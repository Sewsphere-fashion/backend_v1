import CreateWaitlist from "./waitlist.service";
import ResponseHandler from "../utils/responseHandler";

class WaitListController{

    static createEmail = async(req,res,next)=>{

        try{
            const user = await CreateWaitlist.waitlistEmail(req.body)
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