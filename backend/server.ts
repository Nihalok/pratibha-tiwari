import express from "express";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from 'url';
import backendApp from "./app.js";
import { seedAdmin } from "./utils/seedAdmin.js";
import { seedTestimonials } from "./utils/seedTestimonials.js";
import { seedPosts } from "./utils/seedPosts.js";
import connectDB from "./config/db.js";

const rootDir = process.cwd();

dotenv.config();

const PORT = 3000;

async function startServer() {
  try {
    // Connect to MongoDB (non-blocking)
    connectDB()
      .then(() => {
        seedAdmin();
        if (process.env.NODE_ENV !== "production") {
          seedTestimonials();
          seedPosts();
        }
      })
      .catch((err) => {
        console.error(`[${new Date().toISOString()}] Initial MongoDB connection failed. Server is running; Mongoose will retry connection in the background. Error:`, err.message);
      });

    // Vite middleware for development
    if (process.env.NODE_ENV !== "production") {
      const vite = await createViteServer({
        root: path.join(rootDir, "frontend"),
        base: '/',
        server: { 
          middlewareMode: true,
          hmr: false 
        },
        appType: "spa",
      });
      backendApp.use(vite.middlewares);
    } else {
      const distPath = path.join(rootDir, 'frontend/dist');
      backendApp.use(express.static(distPath));
      backendApp.get('*', (req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
      });
    }

    backendApp.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server ready on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error(`[${new Date().toISOString()}] CRITICAL: Failed to start server:`, error);
    process.exit(1);
  }
}

startServer();
