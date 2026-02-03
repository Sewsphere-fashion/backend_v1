// destructing basics from winston
import {createLogger,format,transports} from "winston"

const logger = createLogger({
    // 
    level:"info", //logs only if info.level is less than or equal to this level
    format:format.combine(
        format.timestamp({format:"YYYY-MM-DD HH:mm:ss"}),
        format.colorize(), 
        format.printf((info)=>{return `${info.timestamp} [${info.level.toUpperCase()}] [${info.label}] ${info.message}`})
        
    ),
    transports:[
        // writes all logs to console
        new transports.Console(),
        // write all logs with level "error" to a file error.log
        new transports.File({filename:"error.log",level:"error"}),
        // writes all logs to combined.log
        new transports.File({filename:"combined.log"})
    ]

    
});

// logger.error("this is an error")
// logger.warn("this is a warning")
// logger.info("this is an info message")
export default logger;
