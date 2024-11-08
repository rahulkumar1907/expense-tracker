import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./route/route.mjs";
import cookieParser from "cookie-parser";
import { createClient } from "redis";
import rateLimit from "express-rate-limit";
import winston from "winston";

dotenv.config();

const app = express();
app.use(cookieParser());
// Middleware to parse JSON bodies
app.use(express.json());
const logDir = "./logs"; // Assuming the 'logs' directory exists in the same directory as the app

// Configure Winston logger with debug level and detailed logging format
const logger = winston.createLogger({
  level: "debug", // Change the level to "debug" to capture more detailed logs
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
    new winston.transports.File({
      filename: `${logDir}/app.log`, // Write logs to the predefined log directory
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
    }),
  ],
});

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
    logger.info("Connected to Redis server");
  })
  .catch((err) => {
    logger.error("Failed to connect to Redis:", err);
  });

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    logger.info("MongoDB connected");
  })
  .catch((err) => {
    logger.error("MongoDB connection error:", err);
  });

// Rate limiting using express-rate-limit
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  message: "Too many requests, please try again later.",
  handler: (req, res) => {
    const userIp = req.ip;
    const method = req.method;
    const url = req.originalUrl;
    const timestamp = new Date().toISOString();

    // Log request details when rate-limiting is triggered
    logger.debug(
      `Rate limit triggered - IP: ${userIp}, Method: ${method}, URL: ${url}, Time: ${timestamp}`
    );

    client.incr(`rate-limit:${userIp}`).then(() => {
      logger.warn(
        `Rate limit exceeded for IP: ${userIp}, Method: ${method}, URL: ${url}`
      );
    });

    res.status(429).send("Too many requests, please try again later.");
  },
});

// Apply rate limiting middleware globally
app.use(limiter);

// Monitor Redis for spikes
const monitorRateLimiting = () => {
  setInterval(async () => {
    // Example logic: Check the last 10 minutes for IPs that have hit the rate limit often
    const keys = await client.keys("rate-limit:*");
    for (const key of keys) {
      const count = await client.get(key);
      if (parseInt(count) > 10) {
        // Detecting spikes (more than 10 requests)
        logger.warn(`Spike detected for IP: ${key} with ${count} requests`);
      }
    }
  }, 60000); // Run every minute
};

// Start monitoring spikes
monitorRateLimiting();

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
  logger.info(`Server running on port ${PORT}`);
});
