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
        : "http://localhost:3000",
  })
);

app.use(express.json());

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

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
