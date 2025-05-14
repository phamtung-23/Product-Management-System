import { Router, RequestHandler } from "express";
import {
  getProducts,
  createProduct,
  searchProducts,
} from "../controllers/productController";
import { toggleLike } from "../controllers/likeController";
import { authenticateToken } from "../middleware/authMiddleware";
import { cacheMiddleware } from "../middleware/cacheMiddleware";

const router = Router();

// Get products with pagination with cache (30 minutes TTL)
router.get(
  "/",
  cacheMiddleware("products", 1800) as RequestHandler,
  getProducts as RequestHandler
);

// Create a new product (protected route)
router.post(
  "/",
  authenticateToken as RequestHandler,
  createProduct as RequestHandler
);

// Search products
router.get(
  "/search",
  cacheMiddleware("products:search", 1800) as RequestHandler,
  searchProducts as RequestHandler
);

// Like or unlike a product (protected route)
router.post(
  "/:id/like",
  authenticateToken as RequestHandler,
  toggleLike as RequestHandler
);

export default router;
