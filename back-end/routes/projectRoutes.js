// routes/projectRoutes.js
import express from 'express';
import { getUserProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  addVariation,
  updateVariation,
  deleteVariation,sendForSignature } from '../controllers/projectController.js';
import clerkMiddleware from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(clerkMiddleware);

// Project routes
router.route('/user/:userId')
  .get(getUserProjects);

  router.route('/').post(createProject);

router.route('/:projectId')
  .get(getProjectById)
  .put(updateProject)
  .delete(deleteProject);

// Variation routes (nested under projects)
router.route('/:projectId/variations')
  .post(addVariation);

router.route('/:projectId/variations/:variationId').put(updateVariation);

router.route('/:projectId/variations/:variationId').delete(deleteVariation);

router.route('/projects/:projectId/variations/:variationId/send-for-signature').post(sendForSignature)

export default router;