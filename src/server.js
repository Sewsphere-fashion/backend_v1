import app from "./app.js";
import connectDb from "./config/db.js";
import config from "./config/config.js";

const startServer=async()=>{
    try{
        await connectDb();
        app.listen(config.port || 5000,()=>{
            console.log("app up and running");
        })
    }
    catch(error){
        console.error("failed to start server",error);
        process.exit(1)
    }
}
startServer();