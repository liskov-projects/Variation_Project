import { ClerkExpressWithAuth } from '@clerk/clerk-sdk-node';
import { config } from 'dotenv';

config();

const clerkMiddleware = ClerkExpressWithAuth({
  apiKey: process.env.CLERK_API_KEY,
});

export default clerkMiddleware;