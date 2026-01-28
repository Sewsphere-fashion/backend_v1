import mongoose from "mongoose";
import config from "./config.js";

const connectDb= async()=>{
    try{
        await mongoose.connect(config.mongo_url)
    }
    catch(error){
        console.log("error connecting db");
    }
}

export default connectDb;
