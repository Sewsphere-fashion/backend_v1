import AppError from "../errorHandlers/appError";
import Waitlist from "./waitlist.model";

class WaitlistService{

    static waitlistEmail = async(email)=>{

        // ensures the right mail format
        const normalizedEmail = email.toLowerCase().trim()
        const existingUser = await Waitlist.findOne({email:normalizedEmail})

        if(existingUser){
            throw new AppError("Email already exists",400)
        }

        const user = await Waitlist.create({email:normalizedEmail})
        return user
    }

    static getWaitlistEmails = async()=>{
        const emails = await Waitlist.find()
        return emails;
    }
}

export default WaitlistService;