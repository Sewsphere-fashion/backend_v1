import rateLimit,{ipKeyGenerator} from "express-rate-limit";

class RateLimiter {

  // General limiter for the whole app
  static limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Too many requests, please try again later.",
    standardHeaders: true,
    legacyHeaders: false,
  });

  // Waitlist limiter
  static waitlistLimiter = rateLimit({
    windowMs: 2 * 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: "Too many attempts, please try again later",
    skipSuccessfulRequests: true,
  });

  // Register limiter (IP based)
  static registerLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: "Too many registration attempts, please try again later",
    skipSuccessfulRequests: true
  });

  // Login limiter (Email based)
  static loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: "Too many login attempts, please try again later",
    skipSuccessfulRequests: true,
    keyGenerator: (req) => {
      return req.body.email || ipKeyGenerator(req.ip);
    }
  });

  // Verify email limiter (IP based)
  static verifyEmailLimiter = rateLimit({
    windowMs: 30 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: "Too many verification attempts, please try again later"
  });

  // Resend verification limiter (Email based)
  static resendVerificationLimiter = rateLimit({
    windowMs: 30 * 60 * 1000,
    max: 3,
    standardHeaders: true,
    legacyHeaders: false,
    message: "Too many verification email requests, please try again later",
    keyGenerator: (req) => {
      return req.body.email || ipKeyGenerator(req.ip);
    }
  });

  // Forgot password limiter (Email based)
  static forgotPasswordLimiter = rateLimit({
    windowMs: 30 * 60 * 1000,
    max: 3,
    standardHeaders: true,
    legacyHeaders: false,
    message: "Too many password reset requests, please try again later",
    keyGenerator: (req) => {
      return req.body.email || ipKeyGenerator(req.ip);
    }
  });

  // Reset password limiter (IP based)
  static resetPasswordLimiter = rateLimit({
    windowMs: 30 * 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: "Too many password reset attempts, please try again later"
  });

}

export default RateLimiter;