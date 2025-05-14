import dotenv from "dotenv";
import express, { Request, Response } from "express";
import cors from "cors";
import mongoose, { ConnectOptions } from "mongoose";
import authRoutes from "./routes/authRoutes";
import productRoutes from "./routes/productRoutes";
import { connectRedis, redisClient } from "./services/redisService";
import initI18n from "./utils/i18n";
import { i18nMiddleware } from "./middleware/i18nMiddleware";
import i18next from 'i18next';

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize i18n
const i18n = initI18n();
app.use(i18nMiddleware);

// Simple route for testing
app.get("/", (req: Request, res: Response) => {
  const language = req.language || 'en';
  res.json({ 
    message: i18next.t("welcome"),
    language
  });
});

// Use auth routes
app.use("/auth", authRoutes);

// Use product routes
app.use("/products", productRoutes);

// Connect to MongoDB and Redis
mongoose
  .connect(
    process.env.MONGODB_URI || "mongodb://localhost:27017/product-catalog",
    {} as ConnectOptions
  )
  .then(async () => {
    console.log("Connected to MongoDB");
    // Connect to Redis
    await connectRedis();
    // Start server after successful connections
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("Shutting down gracefully...");
  await mongoose.connection.close();
  await redisClient.quit();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("Shutting down gracefully...");
  await mongoose.connection.close();
  await redisClient.quit();
  process.exit(0);
});
