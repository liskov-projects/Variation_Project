// backend/migrations/fix-profile-company-details.js
import mongoose from 'mongoose';
import { config } from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Profile from "../models/profileModel.js";

// Get __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
config({ path: path.join(__dirname, '../.env') });

const migrateCompanyDetails = async () => {
  try {
    console.log('Starting Profile companyDetails migration...');

    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is not defined in environment variables');
    }

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Find profiles that need migration
    const profiles = await Profile.find({
      'profileData.company': 'Yes',
      $or: [
        { 'profileData.companyName': { $exists: true } },
        { 'profileData.acn': { $exists: true } }
      ]
    });

    console.log(`Found ${profiles.length} profiles to migrate`);

    for (const profile of profiles) {
      const { profileData } = profile;

      // Only migrate if companyDetails does not exist yet
      if (!profileData.companyDetails) {
        profile.profileData.companyDetails = {
          companyName: profileData.companyName || null,
          acn: profileData.acn || null
        };

        // Clean up old fields
        profile.profileData.companyName = undefined;
        profile.profileData.acn = undefined;

        console.log(`Migrating profile ${profile.userId}`);
        profile.markModified('profileData');

        await profile.save();
      }
    }

    console.log('Migration completed');

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');

  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

// Run the migration
migrateCompanyDetails();
