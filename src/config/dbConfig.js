import mongoose from "mongoose";
import { env } from "./serverConfig.js";

export const connectDB = async (req, res, next) => {
  try {
    await mongoose.connect(env.MONGO_URI);
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection failed", err);
    next(err);
  }
};
