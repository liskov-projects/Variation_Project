// Updated migrate-to-profile.js
import mongoose from "mongoose";
import { config } from "dotenv";
import forms from "./models/dbSchema.js";
import Profile from "../models/profileModel.js";

config();

const migrateToProfileStructure = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    // Get all existing form documents
    const allForms = await forms.find({});
    console.log(`Found ${allForms.length} form documents to migrate`);

    for (const form of allForms) {
      try {
        // Check if a profile already exists for this user
        const existingProfile = await Profile.findOne({ userId: form.userId });

        if (existingProfile) {
          console.log(`Profile already exists for user ${form.userId}, skipping...`);
          continue;
        }

        // Get the latest form data (assuming formData is an array as per your migrations)
        const latestFormData =
          Array.isArray(form.formData) && form.formData.length > 0
            ? form.formData[form.formData.length - 1]
            : form.formData || {};

        // Map the old structure to the new profile structure with default values where needed
        const profileData = {
          fullName: latestFormData.fullName || "Default Builder Name",
          address: latestFormData.address || "Default Address",
          email: form.email || latestFormData.email || "default@example.com",
          phoneNumber: latestFormData.phonenumber || "0000000000",
          company: latestFormData.company || "No",
          companyName:
            latestFormData.company === "Yes" ? latestFormData.companyName || "Default Company" : "",
          partnership: latestFormData.partnership || "No",
          numberOfPartners:
            latestFormData.partnership === "Yes" ? latestFormData.numberOfPartners || "1" : "",
          partners: latestFormData.partners || [],
          acn: latestFormData.acn || "123456789", // Default 9-digit number
          abn: latestFormData.abn || "12345678901", // Default 11-digit number
          brn: latestFormData.brn || "DEFAULT-BRN",
        };

        // Create new profile with validation bypassed for migration
        const newProfile = new Profile({
          userId: form.userId,
          email: form.email || "default@example.com",
          profileData: profileData,
          profileSetupComplete: false, // Set to false so users will be prompted to update
          projects: [], // Start with empty projects array
        });

        await newProfile.save();
        console.log(`Migrated user ${form.userId} to new profile structure`);
      } catch (userError) {
        console.error(`Error migrating user ${form.userId}:`, userError.message);
        // Continue with next user
      }
    }

    console.log("Migration completed successfully");
  } catch (error) {
    console.error("Migration failed:", error);
    console.error(error.stack);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
};

migrateToProfileStructure();
