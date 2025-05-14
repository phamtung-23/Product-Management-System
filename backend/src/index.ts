import dotenv from "dotenv";
import express, { Request, Response } from "express";
import cors from "cors";
import mongoose, { ConnectOptions } from "mongoose";
import authRoutes from './routes/authRoutes';
import productRoutes from './routes/productRoutes';

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Simple route for testing
app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Welcome to Product Catalog API" });
});

// Use auth routes
app.use('/auth', authRoutes);

// Use product routes
app.use('/products', productRoutes);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/product-catalog", {
  } as ConnectOptions)
  .then(() => {
    console.log("Connected to MongoDB");
    // Start server after successful DB connection
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
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("Shutting down gracefully...");
  await mongoose.connection.close();
  process.exit(0);
});
