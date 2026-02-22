import nodemailer from "nodemailer"
import config from "../config/config.js"

const emailTransporter = nodemailer.createTransport({
    service:"gmail",
    auth:{
        user:config.user,
        pass:config.pass
    }
})

export default emailTransporter;