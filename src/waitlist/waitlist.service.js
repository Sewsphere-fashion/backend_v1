import AppError from "../errorHandlers/appError.js";
import Waitlist from "./waitlist.model.js";
import EmailsVerifications from "../helpers/sendEmails.js";

class WaitlistService{

    static waitlistEmail = async(email,role)=>{

        
        const existingUser = await Waitlist.findOne({email})

        if(existingUser){
            throw new AppError("Email already exists",409)
        }

        const user = await Waitlist.create({email,role})

        // send verification email
       try{
        await EmailsVerifications.sendWaitlistWelcome(email,role)
        console.log("Welcome email sent successfully");
        
       }
       catch(err){
        console.error("failed to send welcome mail",err);
        
       }
       
        return user
    }

    static getWaitlistEmails = async()=>{
        const emails = await Waitlist.find()
        return emails;
    }
}

export default WaitlistService;