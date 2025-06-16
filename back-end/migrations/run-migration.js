// scripts/run-migration.js
import { migrateContractPrices } from "./add-contract-price-to-projects.js";

async function runMigration() {
  console.log("=== Running Database Migration ===");
  console.log("Migration: Add contract price to projects");
  console.log("Warning: This will modify your database schema and data");
  console.log("Make sure you have a backup of your database before proceeding");

  // Add a confirmation step (optional)
  if (process.argv.includes("--confirm")) {
    try {
      await migrateContractPrices();
      console.log("✅ Migration completed successfully!");
    } catch (error) {
      console.error("❌ Migration failed:", error);
      process.exit(1);
    }
  } else {
    console.log("\nTo run this migration, use: npm run migrate --confirm");
    console.log("or: node scripts/run-migration.js --confirm");
  }
}

runMigration();
