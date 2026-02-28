import RateLimiter from "./guards/rateLimiter.js";
import express, { urlencoded } from "express";
import cors from "cors";
// import mongoSanitize from "express-mongo-sanitize";
import hpp from "hpp";
import helmet from "helmet";
import waitlistRouter from "./waitlist/waitlist.route.js";
import { globalErrorHandler } from "./errorHandlers/globalErrorHandler.js";
import { notFoundHandler } from "./errorHandlers/notFoundError.js";
import routeLogger from "./Middlewares/routeLogger.js";

const app = express();
app.set("trust proxy", 1);

// security middlewares
app.use(helmet());
app.use(express.json({ limit: "10kb" }));
app.use(urlencoded({ extended: true, limit: "10kb" }));
// app.use(mongoSanitize());
app.use(hpp());
app.use(cors({
  origin: "https://frontend-six-eta-46.vercel.app",
  methods: ["POST"]
}));


// logging route 
app.use(routeLogger);
// rate limiting
app.use(RateLimiter.limiter);

// route
app.use("/api/waitlist", RateLimiter.waitlistLimiter, waitlistRouter);

// error handlers
app.use(notFoundHandler);
app.use(globalErrorHandler);

export default app;
