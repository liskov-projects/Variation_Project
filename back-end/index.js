// backend/index.js
import express from "express";
import cors from "cors";
import { config } from "dotenv";
import profileRoutes from "./routes/profileRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import connectDB from "./config/dbStarter.js";

// Load environment variables
config();

const app = express();

// Middleware
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? "https://variation-front-end.onrender.com"
        : ["http://localhost:3000", "http://localhost:3001", "http://localhost:3002"],
  })
);

app.use(express.json({ limit: '10mb' })); // For logo uploads
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Connect to MongoDB
connectDB();

// Routes
app.use("/api/profile", profileRoutes);
app.use("/api/projects", projectRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Error handler for middleware and routes
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Server Error",
    error: process.env.NODE_ENV === "development" ? err.message : "Something went wrong",
  });
});

// This line is what makes /uploads publicly accessible,temporarily used for logo.
app.use("/uploads", express.static("uploads"));

// Start server
// const PORT = 5002;
const PORT = process.env.BACKEND_PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
