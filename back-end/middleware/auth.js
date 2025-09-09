import { requireAuth } from "@clerk/express";
import { config } from "dotenv";

config();

const clerkRequireAuth = requireAuth();

// E2E bypass: when E2E_TEST=true and x-test-user-id header is present,
// simulate an authenticated request for testing purposes only.
const clerkMiddleware = (req, res, next) => {
  const isE2EEnabled = process.env.E2E_TEST === "true";
  const testUserId = req.headers["x-test-user-id"]; // set by Cypress

  if (isE2EEnabled && typeof testUserId === "string" && testUserId.length > 0) {
    req.auth = { userId: testUserId };
    return next();
  }

  return clerkRequireAuth(req, res, next);
};

export default clerkMiddleware;
