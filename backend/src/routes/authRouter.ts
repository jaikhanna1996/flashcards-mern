import { Router } from 'express';
import { register, login, getMe } from '../controllers/authController';
import { protect } from '../middleware/auth';

const router = Router();

// Define routes
router.post('/register', register);

router.post('/login', login);

// GET /api/auth/me -> calls getMe function (protected route)
// protect middleware runs first, then getMe
router.get('/me', protect, getMe);

export default router;

