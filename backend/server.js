import dotenv from "dotenv";
dotenv.config();

import app from "./src/app.js";
import connectDB from "./src/config/db.js";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Connect to database
    await connectDB();

    // Start server
    app.listen(PORT, () => {
      console.log(`[SERVER] 🚀 Server running on port ${PORT}`);
      console.log(`[SERVER] Environment: ${process.env.NODE_ENV || "development"}`);
    });
  } catch (error) {
    console.error("[SERVER] ❌ Failed to start server:", error.message);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on("unhandledRejection", (error) => {
  console.error("[PROCESS] ❌ Unhandled Rejection:", error.message);
  process.exit(1);
});

// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
  console.error("[PROCESS] ❌ Uncaught Exception:", error.message);
  process.exit(1);
});

startServer();