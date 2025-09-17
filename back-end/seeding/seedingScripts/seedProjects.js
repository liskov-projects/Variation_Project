// import mongoose from "mongoose";
import { config } from "dotenv";
import Profile from "../../models/profileModel.js";
import Project from "../../models/projectModel.js";
import {
  generateName,
  generatePhone,
  generateStatus,
  generateRole,
  generateProjectType,
  generateEmail,
  generateAddress,
  randint,
} from "../helpers.js";

config();

// const profileName = process.env.PROFILE_NAME;
// const profileEmail = process.env.PROFILE_EMAIL;
const profileId = process.env.PROFILE_ID;
// const clientName = process.env.CLIENT_NAME;
// const clientEmail = process.env.CLIENT_EMAIL;

// should be used like so: node motherSeed.js name email
//  will override .env
// const clientName = process.argv[2]; //  'node'argv[0] '/app/seeding/fullSeed.js' argv[1]
// const clientEmail = process.argv[3];
const clientId = process.argv[2];

export const seedProjects = async (
  count = 5,
  clearExisting = false,
  id = clientId || profileId
) => {
  try {
    console.log(`🌱 Generating ${count} random projects...`);

    if (clearExisting) {
      console.log("🗑️ Clearing existing projects...");
      await Project.deleteMany({});
      console.log("✅ Existing projects cleared");
    }

    const profiles = id ? [{ userId: id }] : await Profile.find({});
    if (!profiles.length) {
      console.log("⚠️ No profiles found. Seed profiles first.");
      return { success: false, message: "No profiles found" };
    }

    const projects = Array.from({ length: count }).map(() => {
      const profile = profiles[0];
      const client = generateName();

      const startDate = new Date();
      startDate.setDate(startDate.getDate() - randint(0, 365));

      const originalEndDate = new Date(startDate);
      originalEndDate.setDate(originalEndDate.getDate() + randint(90, 270)); // 3-9 months

      const contractPrice = randint(100_000, 2_100_000);

      return {
        userId: profile.userId,
        projectName: `${generateProjectType()} - ${client}`,
        clientName: client,
        clientEmail: generateEmail(client),
        clientPhone: generatePhone(),
        propertyAddress: generateAddress(),
        startDate,
        originalEndDate,
        currentEndDate: originalEndDate,
        totalDaysExtended: 0,
        status: generateStatus(),
        description: `Construction of project for ${client}`,
        contractPrice,
        currentContractPrice: contractPrice,
        architect: Math.random() > 0.5 ? generateRole("Architect") : { hasArchitect: false },
        surveyor: Math.random() > 0.2 ? generateRole("Surveyor") : { hasSurveyor: false },
        variations: [],
      };
    });

    await Project.insertMany(projects);
    console.log(`✅ Created ${projects.length} projects`);
    return { success: true, count: projects.length, projects };
  } catch (error) {
    console.error("❌ Error generating projects:", error);
    throw error;
  }
};

//  for seeding existing profiles
// const run = async () => {
//   try {
//     await mongoose.connect(process.env.MONGO_URI);
//     console.log("✅ Connected to MongoDB");

//     // Pass count, clearExisting, or userId if needed
//     await seedProjects(5, false);

//     await mongoose.disconnect();
//     console.log("✅ Done seeding projects");
//     process.exit(0);
//   } catch (error) {
//     console.error("❌ Error:", error);
//     await mongoose.disconnect();
//     process.exit(1);
//   }
// };
// run();
// REVIEW: CLI runner for projects
// const runProjectSeeding = async () => {
//   try {
//     await mongoose.connect(process.env.MONGO_URI);
//     console.log("✅ Connected to MongoDB");

//     const command = process.argv[2];
//     const count = parseInt(process.argv[3]) || 5;

//     switch (command) {
//       case "seed":
//         await seedProjects(false);
//         break;
//       case "seed:clear":
//         await seedProjects(true);
//         break;
//       case "generate":
//         await generateRandomProjects(count, false);
//         break;
//       case "generate:clear":
//         await generateRandomProjects(count, true);
//         break;
//       default:
//         console.log("Available commands:");
//         console.log("  seed              - Seed sample projects");
//         console.log("  seed:clear        - Clear existing and seed sample projects");
//         console.log("  variations        - Add sample variations to existing projects");
//         console.log("  generate [count]  - Generate random projects (default: 5)");
//         console.log("  generate:clear [count] - Clear existing and generate random projects");
//         break;
//     }
//     await mongoose.disconnect();
//     console.log("Disconnected from MongoDB");
//     process.exit(0);
//   } catch (error) {
//     console.error("Project seeding error:", error);
//     await mongoose.disconnect();
//     process.exit(1);
//   }
// };

// Run if called directly
// if (import.meta.url === `file://${process.argv[1]}`) {
//   runProjectSeeding();
// }

// //  unsure if we want this - kept in case
// export const seedProjects = async (clearExisting = false) => {
//   try {
//     console.log("🌱 Starting project seeding...");
//     // STEP 0: clears DB if needed
//     if (clearExisting) {
//       console.log("🗑️  Clearing existing projects...");
//       await Project.deleteMany({});
//       console.log("✅ Existing projects cleared");
//     }

//     //  STEP 1: check if proojects already exist
//     const existingCount = await Project.countDocuments();
//     if (existingCount > 0 && !clearExisting) {
//       console.log(
//         `⚠️  Found ${existingCount} existing projects. Use clearExisting=true to replace them.`
//       );
//       return { success: true, message: "Projects already exist", count: existingCount };
//     }

//     //  STEP 2: verifies that profile exists for the projects
//     const profileUserIds = [...new Set(sampleProjects.map((p) => p.userId))];
//     const existingProfiles = await Profile.find({ userId: { $in: profileUserIds } });
//     const existingProfileUserIds = existingProfiles.map((p) => p.userId);

//     console.log(`📋 Found ${existingProfiles.length} profiles for project seeding`);

//     // STEP 3: creates projects
//     const createdProjects = [];
//     for (const projectData of sampleProjects) {
//       try {
//         // checks if profile exists for this project
//         if (!existingProfileUserIds.includes(projectData.userId)) {
//           console.log(
//             `⚠️  Skipping project "${projectData.projectName}" - no profile found for userId: ${projectData.userId}`
//           );
//           continue;
//         }

//         const project = new Project(projectData);
//         await project.save();
//         createdProjects.push(project);
//         console.log(`✅ Created project: ${project.projectName} (${project.status})`);
//       } catch (error) {
//         console.error(`❌ Error creating project "${projectData.projectName}":`, error.message);
//       }
//     }

//     console.log(`✅ Project seeding completed! Created ${createdProjects.length} projects`);
//     return { success: true, count: createdProjects.length, projects: createdProjects };
//   } catch (error) {
//     console.error("❌ Error during project seeding:", error);
//     throw error;
//   }
// };
