import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./route/route.mjs";

dotenv.config();

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());
import { createClient } from "redis";

// Connect to redis
const client = createClient({
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
});

client
  .connect()
  .then(() => {
    console.log("Connected to Redis server");
  })
  .catch((err) => {
    console.error("Failed to connect to Redis:", err);
  });
// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

// Use user routes
app.use("/api", userRoutes);

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
