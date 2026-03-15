// helpers/email.ts
import { Resend } from "resend";
import config from "../config/config.js";
import Labels from "../utils/labels.js";

const resend = new Resend(config.resend_api);
const emailVerificationApi= new Resend(config.email_verification_api)
const waitlistfollowUp = new Resend(config.waitlist_followUpMail_api)

// send waitlist welcome message
export const sendNewEmail = async (to, role) => {
  try {
    const currentYear = new Date().getFullYear();

    const html = `
    <div style="font-family: Arial, sans-serif; background:#f4f6f8; padding:30px 15px;">
  
  <div style="max-width:600px; margin:auto; background:#ffffff; border-radius:12px; padding:40px 30px; border:1px solid #eaeaea;">
    
    <div style="text-align:center; margin-bottom:25px;">
      <h1 style="color:#C76B4A; font-size:26px; margin:0;">
        Welcome to the SewSphere Waitlist 🎉
      </h1>
      <p style="font-size:18px; color:#333; margin-top:10px;">
        You’re officially in!
      </p>
    </div>

    <p style="font-size:16px; color:#444; line-height:1.6;">
      Thanks for joining the SewSphere waitlist. We’re building a platform that connects 
      talented designers with people looking for custom fashion made just for them.
    </p>

    <p style="font-size:16px; color:#444; line-height:1.6;">
      You’ll be among the first to know when we open early access.
    </p>

    <p style="font-size:16px; color:#444; line-height:1.6;">
      Stay tuned — exciting things are coming.
    </p>

    <div style="text-align:center; margin:35px 0;">
      <a href="https://www.sewsphere.co"
         style="background:#C76B4A; color:white; padding:14px 30px; border-radius:8px; text-decoration:none; font-size:15px;">
         Visit SewSphere
      </a>
    </div>

    <hr style="border:none; border-top:1px solid #C76B4A; margin:30px 0;">

    <p style="font-size:13px; color:#888; text-align:center; margin-bottom:6px;">
      You're receiving this email because you joined the SewSphere waitlist.
    </p>

    <p style="font-size:13px; color:#888; text-align:center;">
      © ${currentYear} SewSphere. All rights reserved
    </p>

  </div>

</div>
    `;

    const response = await resend.emails.send({
      from: "SewSphere <hello@sewsphere.co>",
      to,
      subject: "Welcome to SewSphere! 🎉",
      html,
    });
    Labels.serviceLog.info(`Welcome email sent to ${to}`,{to})
    return response;
  } catch (error) {
    Labels.serviceLog.error(`Failed to send welcome email to ${to}`,{error,to})
  }
};


// send verification email
export const sendVerificationEmail = async (to, token) => {
  try {
    const currentYear = new Date().getFullYear();
    // production url
    // const verificationUrl = `https://api.sewsphere.co/verify-email?token=${token}`;
    // const verificationUrl = `http://localhost:8080/api/users/verify-email?token=${token}`;
    const verificationUrl = `https://nonopposable-hugo-triadic.ngrok-free.dev/api/users/verify-email?token=${token}`;

    const html = `
<div style="font-family: Arial, sans-serif; background:#f4f6f8; padding:30px 15px;">
  <div style="max-width:600px; margin:auto; background:#ffffff; border-radius:12px; padding:40px 30px; border:1px solid #eaeaea;">
    <div style="text-align:center; margin-bottom:25px;">
      <h1 style="color:#C76B4A; font-size:26px; margin:0;">
        Welcome to SewSphere 🎉
      </h1>
      <p style="font-size:18px; color:#333; margin-top:10px;">
        Verify your email to get started
      </p>
    </div>

    <p style="font-size:16px; color:#444; line-height:1.6;">
      Thanks for signing up! Please confirm your email address by clicking the button below.
    </p>

    <div style="text-align:center; margin:35px 0;">
      <a href="${verificationUrl}"
         style="background:#C76B4A; color:white; padding:14px 30px; border-radius:8px; text-decoration:none; font-size:15px;">
         Verify Email
      </a>
      <p>or copy this link to your browser :</p>
      <p>${verificationUrl}</p>
    </div>

    <p style="font-size:16px; color:#444; line-height:1.6;">
      If you did not create an account, you can safely ignore this email.
    </p>

    <hr style="border:none; border-top:1px solid #C76B4A; margin:30px 0;">

    <p style="font-size:13px; color:#888; text-align:center; margin-bottom:6px;">
      You're receiving this email because you signed up at SewSphere.
    </p>

    <p style="font-size:13px; color:#888; text-align:center;">
      © ${currentYear} SewSphere. All rights reserved
    </p>
  </div>
</div>
    `;
    const response = await emailVerificationApi.emails.send({
      from: "SewSphere Verification <noreply@sewsphere.co>",
      to,
      subject: "Verify Your Email for SewSphere ✨",
      html,
    });
    Labels.serviceLog.info(`Verification mail sent to ${to}`,{to})
    return response;
  } catch (error) {
    Labels.serviceLog.error(`Failed to send verification mail to ${to}`,{error,to})
  }
};

// export default sendVerificationEmail;

export const waitlistFollowUpEmail = async (to, role) => {
  try {
    const currentYear = new Date().getFullYear();

    const html = `
    <div style="font-family: Arial, sans-serif; background:#f4f6f8; padding:30px 15px;">
      <div style="max-width:600px; margin:auto; background:#ffffff; border-radius:12px; padding:40px 30px; border:1px solid #eaeaea;">
        
        <div style="text-align:center; margin-bottom:25px;">
          <h1 style="color:#C76B4A; font-size:26px; margin:0;">
            Exciting Updates Are Coming! 🚀
          </h1>
          <p style="font-size:18px; color:#333; margin-top:10px;">
            Stay tuned — fashion awaits!
          </p>
        </div>

        <p style="font-size:16px; color:#444; line-height:1.6;">
          Hi there! We’re thrilled to have you on the SewSphere waitlist.
        </p>

        <p style="font-size:16px; color:#444; line-height:1.6;">
          Our launch is approaching fast, and we can’t wait to share our platform connecting talented designers with people looking for custom fashion.
        </p>

        <p style="font-size:16px; color:#444; line-height:1.6;">
          While you wait, why not catch some of the latest fashion shows from around the world? Stay inspired and get a glimpse of what’s coming!
        </p>

        <div style="text-align:center; margin:35px 0;">
          <a href="https://lagosfashionweek.ng/"
             style="background:#C76B4A; color:white; padding:14px 30px; border-radius:8px; text-decoration:none; font-size:12px;">
             Watch Latest Fashion Shows 🎥
          </a>
        </div>

        <hr style="border:none; border-top:1px solid #C76B4A; margin:30px 0;">

        <p style="font-size:13px; color:#888; text-align:center; margin-bottom:6px;">
          You're receiving this email because you joined the SewSphere waitlist.
        </p>

        <p style="font-size:13px; color:#888; text-align:center;">
          © ${currentYear} SewSphere. All rights reserved
        </p>

      </div>
    </div>
    `;

    const response = await waitlistfollowUp.emails.send({
      from: "SewSphere Updates <updates@sewsphere.co>",
      to,
      subject: "Stay tuned – fashion updates are coming! 🎥",
      html,
    });

    Labels.serviceLog.info(`Follow-up email with fashion link sent to ${to}`, { to });
    return response;
  } catch (error) {
    Labels.serviceLog.error(`Failed to send follow-up email to ${to}`, { error, to });
  }
};
