import { requireAuth } from '@clerk/express';
import { config } from 'dotenv';

config();

const clerkMiddleware = requireAuth();

export default clerkMiddleware;