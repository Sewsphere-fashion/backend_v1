// db.js - Enhanced version
import mongoose from "mongoose";
import config from "./config.js";
import Labels from "../utils/labels.js";
import {exitAfterFlush} from "../utils/logger.js"
// import { error } from "winston";

const connectDb = async () => {
    try {
        // prevents depreciation warnings
        mongoose.set('strictQuery', false); 
        Labels.dbLog.info("db connection started")
        
        const conn = await mongoose.connect(config.mongo_uri);
        // const conn = await mongoose.connect(config.load_testing_db)
        Labels.dbLog.info("db connection successful",{
            host:conn.connection.host,
            database:conn.connection.name,
            port:conn.connection.port
        })
        
        // Connection event listeners
        mongoose.connection.on('error', (err) => {
            Labels.dbLog.error("MongoDb connection error",{
                error:err.message,
                code:err.code,
                codeName:err.codeName
            //    labels: Array.from(err.errorLabels || []),
            })
        });
        mongoose.connection.on('disconnected', () => {
            Labels.dbLog.warn("mongoDB disconnected")
        });
    } catch (error) {
        console.error("MongoDB connection failed:", error);
        Labels.dbLog.error("connection to db failed",)
        // Wait for Winston to finish writing before exiting
         await exitAfterFlush()
        
        process.exit(1);
    }
};

export default connectDb;