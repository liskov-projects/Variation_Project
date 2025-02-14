import express from 'express';
import {submitForm} from '../controllers/formController.js';
import clerkMiddleware from '../middleware/auth.js';
import { config } from 'dotenv';

config();
const router=express.Router();

router.route("/submit").post(clerkMiddleware,submitForm);

export default router;