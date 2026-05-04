import jwt from "jsonwebtoken";
import { InternalServerError } from "./appError.js";

export const generateToken = (payload, expiresIn) => {
  try {
    if (!payload) {
      throw new Error("Payload is required to generate token");
    }
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not configured");
    }
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
  } catch (error) {
    throw new InternalServerError(`Error generating token: ${error.message}`);
  }
};

export const verifyToken = (token) => {
  try {
    if (!token) {
      throw new Error("Token is required");
    }
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not configured");
    }
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      throw new Error("Token has expired");
    } else if (error.name === "JsonWebTokenError") {
      throw new Error("Invalid token");
    }
    throw error;
  }
};