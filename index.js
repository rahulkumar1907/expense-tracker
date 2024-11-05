import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./route/route.mjs";
import cookieParser from "cookie-parser";
import { createClient } from "redis";
import rateLimit from "express-rate-limit";
import winston from "winston";
// import cluster from "cluster";
// import os from "os";

dotenv.config();

const app = express();
app.use(cookieParser());
// Middleware to parse JSON bodies
app.use(express.json());

// Initialize Redis client
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

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

// Rate limiting using express-rate-limit
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  message: "Too many requests, please try again later.",
  handler: (req, res) => {
    // Log rate limiting attempts to Redis (for spike detection)
    const userIp = req.ip;
    client.incr(`rate-limit:${userIp}`).then(() => {
      console.log(`Rate limit triggered for IP: ${userIp}`);
    });
    return res.status(429).send("Too many requests, please try again later.");
  },
});

// Apply rate limiting middleware globally
app.use(limiter);

// Debugging and logging using winston
const logger = winston.createLogger({
  level: "info",
  transports: [
    new winston.transports.Console({ format: winston.format.simple() }),
    new winston.transports.File({
      filename: "logs/app.log",
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
    }),
  ],
});

// Use user routes
app.use("/api", userRoutes);

// Start server
const PORT = process.env.PORT || 4000;

// Cluster setup to fork processes based on available CPUs
// if (cluster.isMaster) {
//   const numCPUs = os.cpus().length;
//   console.log(`Master process is running. Forking ${numCPUs} workers...`);

//   for (let i = 0; i < numCPUs; i++) {
//     cluster.fork();
//   }

//   cluster.on("exit", (worker, code, signal) => {
//     console.log(`Worker ${worker.process.pid} died`);
//   });
// } else {
//   app.listen(PORT, () => {
//     console.log(`Worker ${process.pid} is running on port ${PORT}`);
//   });
// }

// single instance
app.listen(PORT, () => {
  console.log(`Worker ${process.pid} is running on port ${PORT}`);
});

// Monitor Redis for spikes
const monitorRateLimiting = () => {
  setInterval(async () => {
    // Example logic: Check the last 10 minutes for IPs that have hit the rate limit often
    const keys = await client.keys("rate-limit:*");
    for (const key of keys) {
      const count = await client.get(key);
      if (count > 10) {
        logger.warn(`Spike detected for IP: ${key} with ${count} requests`);
      }
    }
  }, 60000); // Run every minute
};

monitorRateLimiting();
