// routes/projectRoutes.js
import express from 'express';
import { getProjects, getProjectById, createProject, updateProject, deleteProject, addVariation } from '../controllers/projectController.js';
import clerkMiddleware from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(clerkMiddleware);

// Project routes
router.route('/')
  .get(getProjects)
  .post(createProject);

router.route('/:id')
  .get(getProjectById)
  .put(updateProject)
  .delete(deleteProject);

// Variation routes (nested under projects)
router.route('/:id/variations')
  .post(addVariation);

export default router;