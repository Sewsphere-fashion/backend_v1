// destructing basics from winston
import {createLogger,format,transports} from "winston"
import config from "../config/config.js"
import {once} from "events"
import {WinstonTransport as AxiomTransport} from "@axiomhq/winston";


export const logger = createLogger({
    // 
    level:"info", //logs only if info.level is less than or equal to this level
    format:format.combine(
        format.timestamp({format:"YYYY-MM-DD HH:mm:ss"}),
        // format.printf((info)=>{return `${info.timestamp} [${info.level.toUpperCase()}] [${info.label}] ${info.message}`})
        format.json()
    ),
    transports:[

        new transports.Console(),
       
        new AxiomTransport({
            dataset:config.axiom_dataset,
            token:config.axiom_api_key
        })
        // writes all logs to console
        // new transports.Console(),
        // write all logs with level "error" to a file error.log
        // new transports.File({filename:"error.log",level:"error"}),
        // writes all logs to combined.log
        // new transports.File({filename:"combined.log"})
    ]
    ,
    exitOnError:false
});


// graceful shutdown
// finish writing all the logs before shutting down
export const exitAfterFlush = async()=>{
    logger.end();
    await once(logger,"finish")

    // (2 seconds is enough time for the logs to reach Axiom's servers)
    await new Promise(resolve => setTimeout(resolve, 2000));

}