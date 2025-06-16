// routes/projectRoutes.js
import express from "express";
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
  signVariation,
} from "../controllers/projectController.js";
import clerkMiddleware from "../middleware/auth.js";

const router = express.Router();

// Public routes (token-based authentication)
router.route("/variations/validate-token").get(validateSignatureToken);
router.route("/variations/sign").post(signVariation);

// All other routes require authentication
router.use(clerkMiddleware);

// Project routes
router.route("/user/:userId").get(getUserProjects);

router.route("/").post(createProject);

router.route("/:projectId").get(getProjectById).put(updateProject).delete(deleteProject);

// Variation routes (nested under projects)
router.route("/:projectId/variations").post(addVariation);

router.route("/:projectId/variations/:variationId").put(updateVariation);

router.route("/:projectId/variations/:variationId").delete(deleteVariation);

router.route("/:projectId/variations/:variationId/send-for-signature").post(sendForSignature);

export default router;
