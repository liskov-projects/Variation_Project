// backend/migrations/alternative-signature-migration.js
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

const runAlternativeMigration = async () => {
  try {
    console.log("Starting alternative migration...");

    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not defined in environment variables");
    }

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    // Use the MongoDB native driver to update documents
    const collection = mongoose.connection.collection("projects");

    // Update all projects with variations
    const result = await collection.updateMany(
      { variations: { $exists: true } },
      {
        $set: {
          "variations.$[].signatureToken": null,
          "variations.$[].signatureTokenExpiresAt": null,
          "variations.$[].signatureData": null,
          "variations.$[].signedAt": null,
          "variations.$[].signedBy": null,
        },
      }
    );

    console.log(`Modified ${result.modifiedCount} documents`);

    // Now let's verify the update
    const projects = await Project.find({
      variations: { $exists: true, $ne: [] },
    });

    console.log(`Verifying ${projects.length} projects...`);

    let issues = 0;
    for (const project of projects) {
      for (const variation of project.variations) {
        if (
          variation.signatureToken === undefined ||
          variation.signatureTokenExpiresAt === undefined ||
          variation.signatureData === undefined ||
          variation.signedAt === undefined ||
          variation.signedBy === undefined
        ) {
          issues++;
          console.log(`Issue found in variation ${variation._id}`);
        }
      }
    }

    if (issues === 0) {
      console.log("All variations have the new fields!");
    } else {
      console.log(`Found ${issues} variations missing fields`);
    }

    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log("Alternative migration completed");
  } catch (error) {
    console.error("Alternative migration failed:", error);
    process.exit(1);
  }
};

// Run the migration
runAlternativeMigration();
