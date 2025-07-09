import express from 'express';
import { 
  getProfile, 
  createProfile, 
  updateProfile,
  uploadLogo,
  deleteLogo
} from '../controllers/profileController.js';
import clerkMiddleware from '../middleware/auth.js';
import upload from '../middleware/uploadLogoMiddleWare.js';

const router = express.Router();
router.use((req, res, next) => {
  console.log("Incoming request:", req.method, req.originalUrl,req.file);
  next();
});


// All routes are protected with Clerk authentication
router.use(clerkMiddleware);

// Existing profile routes
router.route('/:userId').get(getProfile);
router.route('/').post(createProfile);
router.route('/:userId').put(updateProfile);

// NEW: Logo management routes (Task 5)
router.route('/:userId/logo')
  .post(upload.single('logo'), uploadLogo) // Upload logo
  .delete(deleteLogo); // Delete logo

export default router;
