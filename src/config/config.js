import dotenv from "dotenv"
dotenv.config()

export default{
    port:process.env.PORT,
    mongo_url:process.env.MONGO_URL
}
