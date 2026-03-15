import app from "./app.js";
import connectDb from "./config/db.js";
import config from "./config/config.js";
import Labels from "./utils/labels.js";
import mongoose from "mongoose";
import startFollowUpManager from "./cronNotifications/waitlistNotifications.js";

// reference to server so it can be stopped later
let server;
const startServer = async () => {
  try {
    await connectDb();
    Labels.dbLog.info("Database connected");
    startFollowUpManager()

    server = app.listen(config.port || 5000, () => {
      Labels.dbLog.info("app up and running");
    });
  } catch (error) {
    Labels.dbLog.error("failed to start server", error);
    process.exit(1);
  }
};

// Graceful shutdown
const shutdown = () => {
  Labels.dbLog.info("Shutting down gracefully...");
  server.close(() => {
    mongoose.connection.close();
    Labels.dbLog.info("Shutdown complete");
    process.exit(0);
  });
};

// Handle signals and errors
process.on("SIGTERM", shutdown);
// this works locally
process.on("SIGINT",shutdown)
process.on("uncaughtException", (error) => {
  Labels.dbLog.error("Uncaught Exception:", error);
  shutdown();
});
process.on("unhandledRejection", (reason) => {
  Labels.dbLog.error("Unhandled Rejection:", reason);
  shutdown();
});

startServer();

