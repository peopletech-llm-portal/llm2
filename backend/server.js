import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import examRoutes from "./routes/examRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import resultRoutes from "./routes/resultRoutes.js";
import trainingRoutes from "./routes/trainingRoutes.js";
import scheduleRoutes from "./routes/scheduleRoutes.js";
import * as path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
const allowedOrigins = [
  'https://llm3-am2o.onrender.com',  // <-- change to your actual deployed frontend domain
];
app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use("/api/exams", examRoutes);
app.use("/api/results", resultRoutes);
app.use("/api/training", trainingRoutes);
app.use("/api/schedule", scheduleRoutes);

// Serve static frontend
const distPath = path.join(__dirname, "../../frontend/dist");
app.use(express.static(distPath));

// SPA fallback for client-side routes (must be last route)
app.get("/*", (req, res) => {
  if (req.path.startsWith("/api/")) return res.status(404).json({ message: "API route not found" });
  res.sendFile(path.join(distPath, "index.html"));
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
    console.log("✅ MongoDB Connected");
  })
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));
