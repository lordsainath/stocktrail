import mongoose from "mongoose";

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI environment variable is not set");
    }

    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log(`[DB] MongoDB connected successfully: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error("[DB] MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

export default connectDB;