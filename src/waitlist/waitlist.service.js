import AppError from "../errorHandlers/appError.js";
import Waitlist from "./waitlist.model.js";
import EmailsVerifications from "../helpers/sendEmails.js";
import Labels from "../utils/labels.js";

class WaitlistService{

    static waitlistEmail = async(email,role)=>{

        
        const existingUser = await Waitlist.findOne({email})

        if(existingUser){
                 Labels.serviceLog.warn(`${email} already exists`,{
                email:email,
                role:role
            })
            throw new AppError("Email already exists",409)
       
        }

        const user = await Waitlist.create({email,role})
        Labels.serviceLog.info(`${email} successfully added to waitlist`,{
            email:email,
            role:role
        })

        // send verification email
       try{
        const emailLog = Labels.createLabel("emailVerifcationEmail")
        await EmailsVerifications.sendWaitlistWelcome(email,role)
        emailLog.info(`email verifcation sent to: ${email}`,{
            email:email
        })
        console.log("Welcome email sent successfully");
        
       }
       catch(err){
        console.error("failed to send welcome mail",err);
        emailLog.error(`error sending verifcation mail to ${email}`)
       }
        return user
    }

    static getWaitlistEmails = async()=>{
        const getAllEmails = Labels.createLabel("allWaitlistEmail")
        const emails = await Waitlist.find()
        getAllEmails.info("all emails retrieved",{
            emails:emails
        })
        return emails;
    }
}

export default WaitlistService;