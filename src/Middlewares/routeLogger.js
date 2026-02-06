import Labels from "../utils/labels.js";


const routeLogger = (req,res,next)=>{
    // Record when the request started
    const start = Date.now()

    // log that request came in
    Labels.routeLog.info(`Incoming: ${req.method} ${req.url}`,{
        method:req.method,
        url:req.url,
        ip:req.ip
    });

    // set up a listener for when response finishes
    res.on("finish",()=>{
        // calculate how long it took

        const duration=Date.now() - start

        // log that request completed
        Labels.routeLog.info(`Completed: ${req.method} ${req.url}`,{
            method:req.method,
            url:req.url,
            statusCode:res.statusCode,
            duration:`${duration}ms`,
            ip:req.ip
        })
    })
    // continue to the next 
    next()

}

export default routeLogger;
