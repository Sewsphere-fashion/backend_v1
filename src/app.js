import RateLimiter from "./guards/rateLimiter";










// before all routes cos it applies to all routes
app.use(RateLimiter.limiter)
// use the waitlist limiter in the waitlist route before the controller