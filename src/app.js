import RateLimiter from "./guards/rateLimiter.js";
import express, { urlencoded } from "express"
import waitlistRouter from "./waitlist/waitlist.route.js";
import { globalErrorHandler } from "./errorHandlers/globalErrorHandler.js";
import { notFoundHandler } from "./errorHandlers/notFoundError.js";


const app = express()

app.use(express.json())
app.use(urlencoded({extended:true}))

// ratelimiter prevent brute attacks
app.use(RateLimiter.limiter)
app.use("/api/waitlist",RateLimiter.waitlistLimiter,waitlistRouter)

// error handlers
app.use(globalErrorHandler)
app.use(notFoundHandler)
export default app;