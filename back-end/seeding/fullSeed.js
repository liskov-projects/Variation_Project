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

    // 1️⃣ Create profile
    const profileData = setupProfileToSeed();
    const profile = new Profile(profileData);
    await profile.save();
    console.log(`✅ Profile seeded: ${profile.profileData.fullName}`);

    // 2️⃣ Seed projects for this user
    await seedProjects(5, false); // adjust count if needed

    // 3️⃣ Seed variations for these projects
    await seedVariationsToProjects();

    await mongoose.disconnect();
    console.log("🎉 All seeding done!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error in mother seed:", error);
    await mongoose.disconnect();
    process.exit(1);
  }
};

runFullSeed();
