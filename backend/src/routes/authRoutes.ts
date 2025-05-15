import { RequestHandler, Router } from 'express';
import { register, login, checkAuthStatus } from '../controllers/authController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

// Register route
router.post('/register', register);

// Login route
router.post('/login', login);

// Check authentication status route
router.get('/status', authenticateToken as RequestHandler, checkAuthStatus);

export default router;
