// backend/migrations/check-database-state.js
import mongoose from 'mongoose';
import { config } from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Project from '../models/projectModel.js';

// Get the directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from the correct path
config({ path: path.join(__dirname, '../.env') });

const checkDatabaseState = async () => {
  try {
    console.log('Checking database state...');
    
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is not defined in environment variables');
    }

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Get all projects with variations
    const projects = await Project.find({
      'variations': { $exists: true, $ne: [] }
    });
    
    console.log(`Found ${projects.length} projects with variations`);
    
    // Check each variation
    for (const project of projects) {
      console.log(`\nProject ID: ${project._id}`);
      console.log(`Project Name: ${project.projectName}`);
      console.log(`Variations: ${project.variations.length}`);
      
      for (let i = 0; i < project.variations.length; i++) {
        const variation = project.variations[i];
        console.log(`  Variation ${i + 1} (ID: ${variation._id}):`);
        console.log(`    - signatureToken: ${variation.signatureToken === undefined ? 'UNDEFINED' : variation.signatureToken}`);
        console.log(`    - signatureTokenExpiresAt: ${variation.signatureTokenExpiresAt === undefined ? 'UNDEFINED' : variation.signatureTokenExpiresAt}`);
        console.log(`    - signatureData: ${variation.signatureData === undefined ? 'UNDEFINED' : variation.signatureData}`);
        console.log(`    - signedAt: ${variation.signedAt === undefined ? 'UNDEFINED' : variation.signedAt}`);
        console.log(`    - signedBy: ${variation.signedBy === undefined ? 'UNDEFINED' : variation.signedBy}`);
        console.log(`    - status: ${variation.status}`);
      }
    }

    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('\nDatabase check completed');

  } catch (error) {
    console.error('Database check failed:', error);
    process.exit(1);
  }
};

// Run the check
checkDatabaseState();