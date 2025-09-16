import Project from "../../models/projectModel.js";
import Profile from "../../models/profileModel.js";
import { variationsSeeds } from "../seedsData/variationsSeeds.js";
import { config } from "dotenv";

config();

const userEmail = process.argv[4] || process.env.PROFILE_EMAIL;

export const seedVariationsToProjects = async () => {
  try {
    console.log("🌱 Adding variations to projects...");

    // TODO: seeding to a specified email in .env
    // should check the email is ok (or whatever we use to link a proj and a user)
    const profile = await Profile.findOne({ email: userEmail });
    if (!profile) {
      console.log(`⚠️ No profile found for email ${userEmail}`);
      return { success: false, message: "Profile not found" };
    }

    const projects = await Project.find({ userId: profile.userId });
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
