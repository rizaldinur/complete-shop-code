import { config } from "dotenv";
// import mongodb from "mongodb";
import mongoose from "mongoose";

config();

export const mongooseConnect = async () => {
  await mongoose.connect(process.env.DATABASE_URL);
};
