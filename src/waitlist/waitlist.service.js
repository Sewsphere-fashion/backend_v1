import AppError from "../errorHandlers/appError.js";
import Waitlist from "./waitlist.model.js";
import EmailsVerifications from "../helpers/sendEmails.js";
import Labels from "../utils/labels.js";

class WaitlistService {
  static waitlistEmail = async (email, role) => {
    const existingUser = await Waitlist.findOne({ email });

    if (existingUser) {
      Labels.serviceLog.warn(`${email} already exists`, {
        email: email,
        role: role,
      });
      throw new AppError("Email already exists on the waitlist", 409);
    }

    const user = await Waitlist.create({ email, role });
    Labels.serviceLog.info(`${email} successfully added to waitlist`, {
      email: email,
      role: role,
    });

    // send verification email
    try {
      const emailLog = Labels.createLabel("emailVerifcationEmail");
      await EmailsVerifications.sendWaitlistWelcome(email, role);
      emailLog.info(`email verifcation sent to: ${email}`, {
        email: email,
      });
    } catch (err) {
      emailLog.error(`error sending verifcation mail to ${email}`, err);
    }
    return user;
  };

  static getWaitlistEmails = async () => {
    try {
      const getAllEmails = Labels.createLabel("allWaitlistEmail");
      const emails = await Waitlist.find();
      getAllEmails.info(`All emails retrieved ${emails.lenght}`);
      return emails;
    } catch (err) {
      getAllEmails.error(`Error retrieving emails`);
      throw err;
    }
  };
}

export default WaitlistService;
