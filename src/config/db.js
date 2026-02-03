// db.js - Enhanced version
import mongoose from "mongoose";
import config from "./config.js";
import Labels from "../utils/labels.js";

const connectDb = async () => {
    try {
        // prevents depreciation warnings
        mongoose.set('strictQuery', false); 
        Labels.dbLog.info("db connection started")
        
        const conn = await mongoose.connect(config.mongo_uri);
        Labels.dbLog.info("db connection successful")
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        
        // Connection event listeners
        mongoose.connection.on('error', (err) => {
            console.error('MongoDB connection error:', err);
        });
        mongoose.connection.on('disconnected', () => {
            console.log('MongoDB disconnected');
        });
    } catch (error) {
   
        console.error("MongoDB connection failed:", error.message);
        Labels.dbLog.error("connection to db faild",error)
        process.exit(1);
    }
};

export default connectDb;