import { config } from "dotenv";
// import mongodb from "mongodb";
import mongoose from "mongoose";

config();

export const mongooseConnect = async () => {
  await mongoose.connect(process.env.DATABASE_URL, {
    serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
  });
};
