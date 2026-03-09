// helpers/email.ts
import { Resend } from "resend";
import config from "../config/config.js";

const resend = new Resend(config.resend_api);

const sendNewEmail = async (to, role) => {
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
         style="background:#ff4081; color:white; padding:14px 30px; border-radius:8px; text-decoration:none; font-size:15px;">
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
    return response;
  } catch (error) {
    console.error("Failed to send welcome email:", error);
  }
};

export default sendNewEmail;
