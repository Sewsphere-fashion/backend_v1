import emailTransporter from "./emailTransporter.js";
import AppError from "../errorHandlers/appError.js";
import config from "../config/config.js";

class EmailsVerifications {
  static waitlistEmail = async ({ to, subject, html }) => {
    try {
        // email configuration
      const mailOptions = {
        from: config.user || ' "SewSphere" <noreply@sewsphere.com>',
        to,
        subject,
        html,
      };
      const info = await emailTransporter.sendMail(mailOptions);
      console.log("email successfully sent", info.messageId);
      return info;
    } catch (error) {
      console.error("Email sending failed", error);
      throw new AppError("Failed to send Email", 500);
    }
  };

  // message template
  static sendWaitlistWelcome = async (email, role = "client") => {

    const subject = "Welcome to SewSphere Waitlist! 🎉";
    const html = `
        <h1 style="font-size:18px">Welcome to SewSphere!🎉</h1>
        <p>We're building a platform that connects verified professionals with clients in one seamless experience.</p>
        <p>You're officially on the waitlist as <strong>${role}</strong> </p>
        <p>We'll keep you updated and notify you as soon as early access opens.</p>
        <p>Thanks for joining us early - the future of fashion is being built here</p>
        <hr>
        <p>© ${new Date().getFullYear()} SewSphere. All rights reserved</p>
        
        `;
    return await this.waitlistEmail({
      to:email,
      subject,
      html,
    });
  };
}

export default EmailsVerifications;
