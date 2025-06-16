// backend/migrations/verify-signature-fields.js
import mongoose from "mongoose";
import { config } from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import Project from "../models/projectModel.js";

// Get the directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from the correct path
config({ path: path.join(__dirname, "../.env") });

const verifyMigration = async () => {
  try {
    // Debug: Check if the environment variable is loaded
    console.log("MongoDB URI exists:", !!process.env.MONGO_URI);

    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not defined in environment variables");
    }

    // Connect to MongoDB (removed deprecated options)
    await mongoose.connect(process.env.MONGO_URI);

    console.log("Connected to MongoDB");

    // Check if all projects have the new fields
    const projects = await Project.find({
      variations: { $exists: true, $ne: [] },
    });

    let projectsChecked = 0;
    let variationsChecked = 0;
    let issuesFound = false;

    for (const project of projects) {
      projectsChecked++;

      for (const variation of project.variations) {
        variationsChecked++;

        // Check if any of the new fields are undefined
        if (
          variation.signatureToken === undefined ||
          variation.signatureTokenExpiresAt === undefined ||
          variation.signatureData === undefined ||
          variation.signedAt === undefined ||
          variation.signedBy === undefined
        ) {
          console.log(`Issue found in Project ID: ${project._id}, Variation ID: ${variation._id}`);
          console.log("Missing fields:", {
            signatureToken: variation.signatureToken === undefined,
            signatureTokenExpiresAt: variation.signatureTokenExpiresAt === undefined,
            signatureData: variation.signatureData === undefined,
            signedAt: variation.signedAt === undefined,
            signedBy: variation.signedBy === undefined,
          });
          issuesFound = true;
        }
      }
    }

    console.log(`\nVerification Results:`);
    console.log(`Projects checked: ${projectsChecked}`);
    console.log(`Variations checked: ${variationsChecked}`);
    console.log(`Issues found: ${issuesFound ? "Yes" : "No"}`);

    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log("\nVerification completed");
  } catch (error) {
    console.error("Verification failed:", error);
    process.exit(1);
  }
};

// Run the verification
verifyMigration();
