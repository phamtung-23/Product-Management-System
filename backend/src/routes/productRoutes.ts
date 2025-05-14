import { Router, RequestHandler } from 'express';
import { getProducts, createProduct, searchProducts } from '../controllers/productController';
import { toggleLike } from '../controllers/likeController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

// Get products with pagination
router.get('/', getProducts);

// Create a new product (protected route)
router.post('/', authenticateToken as RequestHandler, createProduct as RequestHandler);

// Search products
router.get('/search', searchProducts);

// Like or unlike a product (protected route)
router.post('/:id/like', authenticateToken as RequestHandler, toggleLike as RequestHandler);

export default router;
