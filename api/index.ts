import dotenv from "dotenv";
dotenv.config();

import type { Request, Response } from "express";
import mongoose from "mongoose";
import app from "../backend/app.js";
import { seedAdmin } from "../backend/utils/seedAdmin.js";

// Cache the DB connection across warm serverless invocations
let isDbConnected = false;
let isSeeded = false;

async function ensureDbConnected() {
  if (isDbConnected && mongoose.connection.readyState === 1) {
    return;
  }
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("MONGODB_URI is not defined");
    return;
  }
  try {
    await mongoose.connect(uri, {
      autoIndex: true,
      family: 4,
    });
    isDbConnected = true;
    console.log("MongoDB connected (serverless)");

    // Seed admin on first connection only
    if (!isSeeded) {
      await seedAdmin();
      isSeeded = true;
    }
  } catch (err: any) {
    console.error("MongoDB connection error:", err.message);
    isDbConnected = false;
  }
}

// Wrap the Express app: connect to DB before forwarding the request
const handler = async (req: Request, res: Response) => {
  await ensureDbConnected();
  return app(req, res);
};

export default handler;
