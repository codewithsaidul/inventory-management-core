/* eslint-disable no-console */
import http from "http";
import mongoose from "mongoose";
import app from "./app";
import { envVars } from "./app/config/env";
import { seedSuperAdmin } from "./app/utils/seedSuperAdmin";

let server: http.Server;
const port = envVars.PORT;

const startServer = async () => {
  try {
    await mongoose.connect(`${envVars.DATABASE_URL}`);
    console.log("✅ MongoDB Connected Successfully");

    await seedSuperAdmin();

    server = http.createServer(app);

    server.listen(port, () => {
      console.log(
        `🚀 Inventory Management Server running on port ${port}`
      );
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

const gracefulShutdown = (signal: string) => {
  console.log(`\n${signal} received. Shutting down gracefully...`);

  if (server) {
    server.close(() => {
      console.log("✅ Server closed.");
      // Disconnect DBs if needed (Good Practice)
      mongoose.connection.close(false).then(() => {
        console.log("✅ MongoDB connection closed.");
        process.exit(0); // Success Exit
      });
    });
  } else {
    process.exit(0);
  }
};

// Handle Termination Signals
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

// Handle Uncaught Errors
process.on("unhandledRejection", (err) => {
  console.error("❌ Unhandled Rejection:", err);
  // For unhandled rejection, we exit with error code 1
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});

process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught Exception:", err);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});
