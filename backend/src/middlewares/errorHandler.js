import { AppError } from "../utils/appError.js";

// Global Error Handler Middleware
export const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error for debugging
  console.error(`[ERROR] ${err.statusCode || 500} - ${err.message}`);
  console.error(err.stack);

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ");
    error = new AppError(message, 400, "VALIDATION_ERROR");
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    const message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
    error = new AppError(message, 409, "DUPLICATE_FIELD_ERROR");
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    error = new AppError("Invalid token", 401, "INVALID_TOKEN");
  }

  if (err.name === "TokenExpiredError") {
    error = new AppError("Token expired", 401, "TOKEN_EXPIRED");
  }

  // MongooseError - cast to ObjectId
  if (err.name === "CastError") {
    error = new AppError("Invalid resource ID", 400, "INVALID_ID");
  }

  // Handle if it's already an AppError
  if (!(error instanceof AppError)) {
    error = new AppError(
      error.message || "Something went wrong",
      error.statusCode || 500,
      "INTERNAL_SERVER_ERROR"
    );
  }

  res.status(error.statusCode || 500).json({
    success: false,
    statusCode: error.statusCode || 500,
    errorCode: error.errorCode || "INTERNAL_SERVER_ERROR",
    message: error.message || "Internal server error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

// 404 Not Found Handler
export const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    statusCode: 404,
    errorCode: "ROUTE_NOT_FOUND",
    message: `Route ${req.originalUrl} not found`,
  });
};
