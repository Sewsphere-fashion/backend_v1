import rateLimit from "express-rate-limit";

class RateLimiter {
  static limiter = rateLimit({
    // Ms(milliseconds:timeout)
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Too many requests,please try again later.",
    standardHeaders: true,
    legacyHeaders: false,
  });

  static waitlistLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: "Too many signup attempts,please try again later",
    skipSuccessfulRequests: true,
  });

  static registerLimiter = rateLimit({
    windowMs:60*60*1000,
    max:5,
    standardHeaders:true,
    legacyHeaders:false,
    message:"Too many registration attempts, please try again later",
    skipSuccessfulRequests:true
  });

  static loginLimiter = rateLimit({
    windowMs:15*60*1000,
    max:5,
    standardHeaders:true,
    legacyHeaders:false,
    message:"Too many login attempts,please try again",
    skipSuccessfulRequests:true
  })
}

export default RateLimiter;
