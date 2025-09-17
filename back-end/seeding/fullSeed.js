import mongoose from "mongoose";
import { config } from "dotenv";
import { setupProfileToSeed } from "./seedingScripts/seedProfile.js";
import { seedProjects } from "./seedingScripts/seedProjects.js";
import { seedVariationsToProjects } from "./seedingScripts/seedVariations.js";
import Profile from "../models/profileModel.js";
import Project from "../models/projectModel.js";

config();

const runFullSeed = async () => {
  const userIdToSeed = process.argv[2] || process.env.PROFILE_ID;
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // STEP 0: setup profile object
    const profileData = await setupProfileToSeed();

    // STEP 1: clear old profile and related projects
    await Profile.deleteMany({
      $or: [{ userId: userIdToSeed }, { email: profileData.email }],
    });
    await Project.deleteMany({ userId: userIdToSeed });
    console.log("🗑️ Cleared old profile and projects for this user");

    // STEP 2: save new profile
    const savedProfile = await Profile.create(profileData);
    console.log(`✅ Saved new profile for ${savedProfile.profileData.fullName}`);

    // STEP 3: seed projects
    await seedProjects(5, false, savedProfile.userId);

    // STEP 4: seed variations for these projects
    await seedVariationsToProjects(savedProfile.userId); // make sure your variations function accepts userId

    await mongoose.disconnect();
    console.log("✅ Done seeding profile, projects, and variations");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error during full seed:", err);
    await mongoose.disconnect();
    process.exit(1);
  }
};

runFullSeed();
