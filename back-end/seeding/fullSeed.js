import mongoose from "mongoose";
import { config } from "dotenv";
import { setupProfileToSeed } from "./seedingScripts/seedProfile.js";
import { seedProjects } from "./seedingScripts/seedProjects.js";
import { seedVariationsToProjects } from "./seedingScripts/seedVariations.js";
import Profile from "../models/profileModel.js";

config();

const runFullSeed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Create profile
    const profileData = await setupProfileToSeed();
    const profile = new Profile(profileData);
    await profile.save();
    console.log(`✅ Profile seeded: ${profile.profileData.fullName}`);

    // Seed projects for this user
    await seedProjects(5, false, profileData.userId); // adjust count if needed

    // Seed variations for these projects
    await seedVariationsToProjects();

    await mongoose.disconnect();
    console.log("🎉 All seeding done!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error in fullSeed:", error);
    await mongoose.disconnect();
    process.exit(1);
  }
};

runFullSeed();
