// db.js - Enhanced version
import mongoose from "mongoose";
import config from "./config.js";

const connectDb = async () => {
    try {
        // prevents depreciation warnings
        mongoose.set('strictQuery', false); 
        
        const conn = await mongoose.connect(config.mongo_uri);
        
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
        process.exit(1);
    }
};

export default connectDb;