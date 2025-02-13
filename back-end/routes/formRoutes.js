import express from 'express';
import {submitForm} from '../controllers/formController';
import clerkMiddleware from '../middleware/auth.js';

const router=express.Router();

router.route("/submit").post(clerkMiddleware,submitForm);

export default router;