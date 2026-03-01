// helpers/email.ts
import { Resend } from "resend";
import config from "../config/config.js";

const resend = new Resend(config.resend_api);

const sendNewEmail = async (to, role) => {
  try {
    const currentYear = new Date().getFullYear();

    const html = `
      <div style="font-family: Arial, sans-serif; max-width:600px; margin:auto; padding:20px; background-color:#f9f9f9; border-radius:10px; border:1px solid #e0e0e0;">
        <div style="text-align:center; margin-bottom:30px;">
          <h1 style="color:#ff4081; font-size:24px; margin:0;">Welcome to SewSphere! 🎉</h1>
        </div>
        
        <p style="font-size:16px; color:#333;">
          We're building a platform that connects verified professionals with clients in one seamless experience.
        </p>
        
        <p style="font-size:16px; color:#333;">
          You're officially on the waitlist as <strong style="color:#ff4081;">${role}</strong>.
        </p>
        
        <p style="font-size:16px; color:#333;">
          We'll keep you updated and notify you as soon as early access opens.
        </p>
        
        <p style="font-size:16px; color:#333;">
          Thanks for joining us early — the future of fashion is being built here!
        </p>
        
        <hr style="border:none; border-top:1px solid #e0e0e0; margin:30px 0;">
        
        <p style="font-size:14px; color:#888; text-align:center;">
          © ${currentYear} SewSphere. All rights reserved
        </p>
      </div>
    `;

    await resend.emails.send({
      from: "onboarding@resend.dev",
      to,
      subject: "Welcome to SewSphere! 🎉",
      html,
    });

    console.log("Welcome email sent to", to);
  } catch (error) {
    console.error("Failed to send welcome email:", error);
  }
};

export default sendNewEmail;
