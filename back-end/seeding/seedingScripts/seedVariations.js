import mongoose from "mongoose";
import Project from "../../models/projectModel.js";
import Profile from "../../models/profileModel.js";
import { variationsSeeds } from "../seedsData/variationsSeeds.js";
import { config } from "dotenv";

config();

export const seedVariationsToProjects = async () => {
  const userEmail = process.argv[2] || process.env.PROFILE_EMAIL;
  const userId = process.argv[3] || process.env.PROFILE_ID;
  try {
    console.log("🌱 Adding variations to projects...");

    // TODO: seeding to a specified email in .env
    // should check the email is ok (or whatever we use to link a proj and a user)
    const profile = await Profile.findOne({ email: userEmail });
    if (!profile) {
      console.log(`⚠️ No profile found for email ${userEmail}`);
      return { success: false, message: "Profile not found" };
    }

    const projects = await Project.find({ userId: userId });
    console.log("PROJECTS ARE: ", projects);

    if (projects.length === 0) {
      console.log(`⚠️ No projects found for user ${userEmail}`);
      return { success: false, message: "No projects found" };
    }

    let variationsAdded = 0;

    for (const project of projects) {
      // adds 1-3 random variations per project
      const variationsToAdd = variationsSeeds
        .sort(() => Math.random() - 0.5)
        .slice(0, Math.floor(Math.random() * 3) + 1);

      project.variations.push(...variationsToAdd);
      await project.save();
      console.log(
        `✅ Added ${variationsToAdd.length} variations to project "${project.projectName}"`
      );
      variationsAdded += variationsToAdd.length;
    }

    console.log(`🎉 Variations seeding completed! Total variations added: ${variationsAdded}`);
    return { success: true, count: variationsAdded };
  } catch (error) {
    console.error("❌ Error during variations seeding:", error);
    throw error;
  }
};

// to seed variatoins to an existing user
// const run = async () => {
//   try {
//     await mongoose.connect(process.env.MONGO_URI);
//     console.log("✅ Connected to MongoDB");

//     // Pass count, clearExisting, or userId if needed
//     await seedVariationsToProjects();

//     await mongoose.disconnect();
//     console.log("✅ Done seeding variations");
//     process.exit(0);
//   } catch (error) {
//     console.error("❌ Error:", error);
//     await mongoose.disconnect();
//     process.exit(1);
//   }
// };
// run();
