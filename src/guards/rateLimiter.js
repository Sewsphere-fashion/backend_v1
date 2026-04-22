import rateLimit, { ipKeyGenerator } from "express-rate-limit";

class RateLimiter {
  // General limiter for the whole app
  static limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Too many requests, please try again later.",
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => ipKeyGenerator(req),
  });

  // Waitlist limiter
  static waitlistLimiter = rateLimit({
    windowMs: 2 * 60 * 1000,
    max: 5,
    message: "Too many attempts, please try again later",
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: true,
    keyGenerator: (req) => ipKeyGenerator(req),
  });

  // Register limiter (IP based)
  static registerLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 5,
    message: "Too many registration attempts, please try again later",
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: true,
    keyGenerator: (req) => ipKeyGenerator(req),
  });

  // Login limiter (Email + IP based)
  static loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: "Too many login attempts, please try again later",
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: true,
    keyGenerator: (req) => {
      const email = req.body.email?.toLowerCase().trim();
      return email
        ? `${email}-${ipKeyGenerator(req)}`
        : ipKeyGenerator(req);
    },
  });

  // Verify email limiter
  static verifyEmailLimiter = rateLimit({
    windowMs: 30 * 60 * 1000,
    max: 10,
    message: "Too many verification attempts, please try again later",
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => {
      const email = req.body.email?.toLowerCase().trim();
      return email || ipKeyGenerator(req);
    },
  });

  // Resend verification limiter
  static resendVerificationLimiter = rateLimit({
    windowMs: 30 * 60 * 1000,
    max: 3,
    message: "Too many verification email requests, please try again later",
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => {
      const email = req.body.email?.toLowerCase().trim();
      return email || ipKeyGenerator(req);
    },
  });

  // Forgot password limiter
  static forgotPasswordLimiter = rateLimit({
    windowMs: 30 * 60 * 1000,
    max: 3,
    message: "Too many password reset requests, please try again later",
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => {
      const email = req.body.email?.toLowerCase().trim();
      return email || ipKeyGenerator(req);
    },
  });

  // Reset password limiter
  static resetPasswordLimiter = rateLimit({
    windowMs: 30 * 60 * 1000,
    max: 5,
    message: "Too many password reset attempts, please try again later",
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => {
      const email = req.body.email?.toLowerCase().trim();
      return email || ipKeyGenerator(req);
    },
  });
}

export default RateLimiter;