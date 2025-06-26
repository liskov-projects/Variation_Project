// migrations/add-contract-price-to-projects.js
import mongoose from "mongoose";
import Project from "../models/projectModel.js";
import { config } from "dotenv";

config();

// Migration script to add contractPrice field to existing projects
async function migrateContractPrices() {
  try {
    console.log("Starting contract price migration...");

    // Connect to database if not already connected
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGO_URI || process.env.DATABASE_URL);
      console.log("Connected to MongoDB");
    }

    // Find all projects that don't have contractPrice
    const projectsWithoutContractPrice = await Project.find({
      contractPrice: { $exists: false },
    });

    console.log(`Found ${projectsWithoutContractPrice.length} projects without contractPrice`);

    // Update each project
    for (const project of projectsWithoutContractPrice) {
      try {
        // Option 1: Set a default contractPrice of 0 (you can change this)
        project.contractPrice = 0;

        // Option 2: If you have a pattern to derive contractPrice from existing data
        // You might calculate it based on some other field or set a reasonable default
        // For example:
        // project.contractPrice = project.estimatedCost || 0;
        // or
        // project.contractPrice = 10000; // Set a default value

        // Calculate currentContractPrice based on approved variations
        let totalVariationCost = 0;
        if (project.variations && project.variations.length > 0) {
          totalVariationCost = project.variations.reduce((total, variation) => {
            if (variation.status === "approved" && variation.cost) {
              return total + variation.cost;
            }
            return total;
          }, 0);
        }

        project.currentContractPrice = project.contractPrice + totalVariationCost;

        await project.save();
        console.log(
          `Updated project ${project._id} - contractPrice: ${project.contractPrice}, currentContractPrice: ${project.currentContractPrice}`
        );
      } catch (error) {
        console.error(`Error updating project ${project._id}:`, error);
      }
    }

    // Remove newContractPrice field from all variations if it exists
    console.log("Removing newContractPrice from variations...");
    await Project.updateMany(
      { "variations.newContractPrice": { $exists: true } },
      { $unset: { "variations.$[].newContractPrice": 1 } }
    );

    console.log("Migration completed successfully!");

    // Verify the migration
    const migratedProjects = await Project.find({
      contractPrice: { $exists: true },
    });
    console.log(`Total projects with contractPrice: ${migratedProjects.length}`);
  } catch (error) {
    console.error("Migration failed:", error);
    throw error;
  } finally {
    // Close database connection if it was opened in this script
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
      console.log("Disconnected from MongoDB");
    }
  }
}

// Alternative migration with manual contractPrice setting
async function migrateWithPrompt() {
  try {
    console.log("Starting interactive contract price migration...");

    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGO_URI || process.env.DATABASE_URL);
    }

    const projectsWithoutContractPrice = await Project.find({
      contractPrice: { $exists: false },
    }).select("_id projectName clientName variations");

    console.log(`Found ${projectsWithoutContractPrice.length} projects without contractPrice`);

    for (const project of projectsWithoutContractPrice) {
      console.log(`\nProject: ${project.projectName} (${project.clientName})`);
      console.log(`Project ID: ${project._id}`);
      console.log(`Number of variations: ${project.variations.length}`);

      // You can modify this part to prompt for input or use a specific logic
      // For now, setting a default value
      const contractPrice = 0; // You can change this logic

      project.contractPrice = contractPrice;

      // Calculate currentContractPrice
      const totalVariationCost = project.variations.reduce((total, variation) => {
        if (variation.status === "approved" && variation.cost) {
          return total + variation.cost;
        }
        return total;
      }, 0);

      project.currentContractPrice = contractPrice + totalVariationCost;

      await project.save();
      console.log(
        `Set contractPrice to ${contractPrice}, currentContractPrice to ${project.currentContractPrice}`
      );
    }

    console.log("Interactive migration completed!");
  } catch (error) {
    console.error("Interactive migration failed:", error);
    throw error;
  }
}

// Run the migration
if (import.meta.url === `file://${process.argv[1]}`) {
  migrateContractPrices().catch(console.error);
}

export { migrateContractPrices, migrateWithPrompt };
