import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import kycRoutes from "./routes/kyc.routes.js";
import locationRoutes from "./routes/location.routes.js";
import walletRoutes from "./routes/wallet.routes.js";
import { errorHandler, notFoundHandler } from "./middlewares/errorHandler.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());



// Routes
app.use("/auth", authRoutes);
app.use("/kyc", kycRoutes);
app.use("/locations", locationRoutes);
app.use("/wallet", walletRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
    res.status(200).json({ success: true, message: "Server is running" });
});

// 404 Handler - Must come before error handler
app.use(notFoundHandler);

// Global Error Handler - Must be last
app.use(errorHandler);

export default app;