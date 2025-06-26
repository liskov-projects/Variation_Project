import express from "express";
import multer from "multer";
import { uploadLogo } from "../controllers/uploadController.js"; 

const router = express.Router();

// Store uploaded file in memory buffer
const upload = multer({ storage: multer.memoryStorage() });

router.post(
  "/:userId/logo",
  upload.single("logo"),  
  uploadLogo,
             
);

export default router;
