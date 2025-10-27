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

dotenv.config();
const app = express();

// =======================
// Middleware
// =======================
app.use(express.json());

// ✅ Allow frontend to connect from Render
const allowedOrigins = [
  "http://localhost:5173", // local frontend (dev)
  "https://your-frontend-name.onrender.com", // replace with your Render frontend URL
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

// =======================
// API Routes
// =======================
app.use("/api/exams", examRoutes);
app.use("/api/results", resultRoutes);
app.use("/api/training", trainingRoutes);
app.use("/api/schedule", scheduleRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);

// =======================
// Health Check Route
// =======================
app.get("/", (req, res) => {
  res.send("✅ Backend is running on Render!");
});

// =======================
// Database & Server Start
// =======================
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, "0.0.0.0", () =>
      console.log(`🚀 Server running on port ${PORT}`)
    );
    console.log("✅ MongoDB Connected");
  })
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));
