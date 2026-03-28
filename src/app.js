import RateLimiter from "./guards/rateLimiter.js";
import express, { urlencoded } from "express";
import cors from "cors";
import mongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";
import hpp from "hpp";
import helmet from "helmet";
import waitlistRouter from "./waitlist/waitlist.route.js";
import { globalErrorHandler } from "./errorHandlers/globalErrorHandler.js";
import { notFoundHandler } from "./errorHandlers/notFoundError.js";
import routeLogger from "./Middlewares/routeLogger.js";
// import pingRoute from "./pingRoute/ping.route.js";
import config from "./config/config.js";
import userRoute from "./Users/user.route.js";
import designerRoute from "./Designer/designerProfile/designerProfile.route.js";

const app = express();
app.set("trust proxy", 1);

// security middlewares
app.use(helmet());
app.use(express.json({ limit: "10kb" }));
app.use(urlencoded({ extended: true, limit: "10kb" }));
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());

const allowedCORS = [
  "https://sewsphere-mvp.vercel.app",
  "https://www.sewsphere.co",
];

app.use(
  cors({
    origin: allowedCORS,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);


// logging route 
app.use(routeLogger);
// rate limiting
// app.use(RateLimiter.limiter);

// route
app.use("/api/waitlist", (req, res, next) => {
    if (req.path === "/ping") return next(); // skip rate limiter
    RateLimiter.waitlistLimiter(req, res, next);
}, waitlistRouter);

app.use("/api/v1/users",userRoute)
app.use("/api/v1/designer",designerRoute)
// ping route
app.get("/ping", (req, res) => {
  res.json({ status: "alive" });
});

// error handlers
app.use(notFoundHandler);
app.use(globalErrorHandler);

export default app;
