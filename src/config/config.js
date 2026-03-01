import dotenv from "dotenv"
dotenv.config()

export default{
    port:process.env.PORT,
    mongo_uri:process.env.MONGO_URI,
    user:process.env.EMAIL_USER,
    pass:process.env.EMAIL_PASS,
    axiom_api_key:process.env.AXIOM_API_KEY,
   axiom_dataset:process.env.AXIOM_DATASET,
//    resend_api:process.env.RENDER_API
}
