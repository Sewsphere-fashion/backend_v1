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
   secret_key:process.env.SECRET_KEY
}
