// backend/migrations/add-signature-fields.js
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

const runMigration = async () => {
  try {
    // Debug: Check if the environment variable is loaded
    console.log("MongoDB URI exists:", !!process.env.MONGO_URI);

    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not defined in environment variables");
    }

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    // First, let's check the current state of the database
    console.log("Checking current database state...");

    const projects = await Project.find({
      variations: { $exists: true, $ne: [] },
    });

    console.log(`Found ${projects.length} projects with variations`);

    let variationsNeedingUpdate = 0;

    // Manually update each variation
    for (const project of projects) {
      let projectUpdated = false;

      for (let i = 0; i < project.variations.length; i++) {
        const variation = project.variations[i];

        // Check if fields are missing
        if (
          variation.signatureToken === undefined ||
          variation.signatureTokenExpiresAt === undefined ||
          variation.signatureData === undefined ||
          variation.signedAt === undefined ||
          variation.signedBy === undefined
        ) {
          console.log(`Updating variation ${variation._id} in project ${project._id}`);

          // Update the fields explicitly
          project.variations[i].signatureToken = null;
          project.variations[i].signatureTokenExpiresAt = null;
          project.variations[i].signatureData = null;
          project.variations[i].signedAt = null;
          project.variations[i].signedBy = null;

          projectUpdated = true;
          variationsNeedingUpdate++;
        }
      }

      if (projectUpdated) {
        // Mark the variations array as modified
        project.markModified("variations");
        await project.save();
        console.log(`Saved updates for project ${project._id}`);
      }
    }

    console.log(`Migration complete: Updated ${variationsNeedingUpdate} variations`);

    // Verify the updates
    console.log("\nVerifying updates...");
    const verifyProjects = await Project.find({
      variations: { $exists: true, $ne: [] },
    });

    let verificationIssues = 0;
    for (const project of verifyProjects) {
      for (const variation of project.variations) {
        if (
          variation.signatureToken === undefined ||
          variation.signatureTokenExpiresAt === undefined ||
          variation.signatureData === undefined ||
          variation.signedAt === undefined ||
          variation.signedBy === undefined
        ) {
          console.log(
            `Verification failed for variation ${variation._id} in project ${project._id}`
          );
          verificationIssues++;
        }
      }
    }

    if (verificationIssues > 0) {
      console.log(
        `WARNING: ${verificationIssues} variations still don't have the signature fields`
      );
    } else {
      console.log("All variations successfully updated with signature fields");
    }

    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log("Migration completed");
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
};

// Run the migration
runMigration();
