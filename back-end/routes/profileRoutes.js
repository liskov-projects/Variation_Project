// backend/routes/profileRoutes.js
import express from 'express';
import { getProfile, createProfile, updateProfile } from '../controllers/profileController.js';
import clerkMiddleware from '../middleware/auth.js';

const router = express.Router();

// All routes are protected with Clerk authentication
router.use(clerkMiddleware);

// Profile routes
router.route('/:userId').get(getProfile);
router.route('/').post(createProfile);
router.route('/:userId').put(updateProfile);

export default router;