import rateLimit from "express-rate-limit";

class RateLimiter{

    static limiter = rateLimit({
        windowMs:15 * 60 * 1000,
        max:100,
        message:"Too many requests,please try again later.",
        standardHeaders:true,
        legacyHeaders:false
    });

    static waitlistLimiter = rateLimit({
        windowMs: 60 * 60 *1000,
        max:3,
        message:"Too many signup attempts,please try again later",
        skipSuccessfulRequests:false
    })
}

export default  RateLimiter;