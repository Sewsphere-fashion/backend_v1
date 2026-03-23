import dotenv from "dotenv"
dotenv.config()

export default{
    port:process.env.PORT,
    mongo_uri:process.env.MONGO_URI,
    user:process.env.EMAIL_USER,
    pass:process.env.EMAIL_PASS,
    axiom_api_key:process.env.AXIOM_API_KEY,
   axiom_dataset:process.env.AXIOM_DATASET,
   resend_api:process.env.RESEND_API,
   frontend_URL:process.env.FRONTEND_URL,
   secret_key:process.env.SECRET_KEY,
   email_verification_api:process.env.EMAIL_VERIFICATION_API,
   waitlist_followUpMail_api:process.env.WAITLIST_FOLLOWUP_MAIL_API,
   reset_password_mail:process.env.RESET_PASSWORD_EMAIL_API,
    load_testing_db:process.env.LOAD_TESTING_DB
}
