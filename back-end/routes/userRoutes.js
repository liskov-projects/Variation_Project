// back-end/routes/userRoutes.js
import express from 'express';
import { getUserProfile, updateUserProfile } from '../controllers/userController.js';
import clerkMiddleware from '../middleware/auth.js';
import { config } from 'dotenv';

config();
const router = express.Router();

// GET user profile by userId
router.route("/:userId").get(clerkMiddleware, getUserProfile);

// PUT update user profile
router.route("/:userId").put(clerkMiddleware, updateUserProfile);

export default router;