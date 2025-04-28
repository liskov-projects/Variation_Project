// backend/migrations/fix-specific-project.js
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

const fixSpecificProject = async () => {
  try {
    console.log('Starting targeted migration...');
    
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is not defined in environment variables');
    }

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Find the specific project with undefined fields
    const project = await Project.findById('680c3b353b4f10bea9b062ea');
    
    if (!project) {
      console.log('Project not found');
      return;
    }

    console.log(`Found project: ${project.projectName}`);
    console.log(`Variations to fix: ${project.variations.length}`);

    // Update each variation that has undefined fields
    for (let i = 0; i < project.variations.length; i++) {
      const variation = project.variations[i];
      
      // Check if fields are undefined
      if (variation.signatureToken === undefined || 
          variation.signatureTokenExpiresAt === undefined ||
          variation.signatureData === undefined ||
          variation.signedAt === undefined ||
          variation.signedBy === undefined) {
        
        console.log(`Fixing variation ${i + 1} (ID: ${variation._id})`);
        
        // Set the fields to null explicitly
        project.variations[i].signatureToken = null;
        project.variations[i].signatureTokenExpiresAt = null;
        project.variations[i].signatureData = null;
        project.variations[i].signedAt = null;
        project.variations[i].signedBy = null;
      }
    }

    // Mark the variations array as modified
    project.markModified('variations');
    
    // Save the updated project
    await project.save();
    console.log('Project updated successfully');

    // Verify the fix
    const updatedProject = await Project.findById('680c3b353b4f10bea9b062ea');
    console.log('\nVerification:');
    for (let i = 0; i < updatedProject.variations.length; i++) {
      const variation = updatedProject.variations[i];
      console.log(`Variation ${i + 1}:`);
      console.log(`  - signatureToken: ${variation.signatureToken === undefined ? 'UNDEFINED' : variation.signatureToken}`);
      console.log(`  - signatureTokenExpiresAt: ${variation.signatureTokenExpiresAt === undefined ? 'UNDEFINED' : variation.signatureTokenExpiresAt}`);
      console.log(`  - signatureData: ${variation.signatureData === undefined ? 'UNDEFINED' : variation.signatureData}`);
      console.log(`  - signedAt: ${variation.signedAt === undefined ? 'UNDEFINED' : variation.signedAt}`);
      console.log(`  - signedBy: ${variation.signedBy === undefined ? 'UNDEFINED' : variation.signedBy}`);
    }

    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('\nTargeted migration completed');

  } catch (error) {
    console.error('Targeted migration failed:', error);
    process.exit(1);
  }
};

// Run the migration
fixSpecificProject();