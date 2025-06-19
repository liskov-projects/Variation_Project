import express from 'express';
import { 
  getUserProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  addVariation,
  updateVariation,
  deleteVariation,
  sendForSignature,
  validateSignatureToken,
  signVariation 
} from '../controllers/projectController.js';
import clerkMiddleware from '../middleware/auth.js';

const router = express.Router();

// Public routes (token-based authentication for signature process)
router.route('/variations/validate-token').get(validateSignatureToken);
router.route('/variations/sign').post(signVariation);

// All other routes require Clerk authentication
router.use(clerkMiddleware);

// Project CRUD routes
router.route('/user/:userId').get(getUserProjects);
router.route('/').post(createProject);
router.route('/:projectId')
  .get(getProjectById)
  .put(updateProject)
  .delete(deleteProject);

// Variation management routes (nested under projects)
router.route('/:projectId/variations').post(addVariation);

router.route('/:projectId/variations/:variationId')
  .put(updateVariation)
  .delete(deleteVariation);

// Signature workflow routes
router.route('/:projectId/variations/:variationId/send-signature').post(sendForSignature);

export default router;