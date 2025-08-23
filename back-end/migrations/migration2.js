// migrations/migration2.js
import mongoose from 'mongoose';
import Profile from '../models/profileModel.js';
import Project from '../models/projectModel.js';
import { config } from 'dotenv';

config();

// DIRECT DATABASE FIX: Force update using MongoDB operations
export const migrateCostBreakdown = async () => {
  console.log('Starting cost breakdown migration with direct database operations...');
  
  try {
    // Get projects directly from MongoDB to see actual database state
    const projects = await Project.collection.find({
      'variations.0': { $exists: true }
    }).toArray();

    console.log(`Found ${projects.length} projects with variations in the database`);

    for (const project of projects) {
      let needsUpdate = false;
      const updatedVariations = [...project.variations];

      console.log(`\n--- Processing project ${project._id} (${project.variations.length} variations) ---`);

      updatedVariations.forEach((variation, index) => {
        let variationUpdated = false;
        
        console.log(`Variation ${index}:`);
        console.log(`  - Cost: ${variation.cost}`);
        console.log(`  - Has costBreakdown in DB: ${!!variation.costBreakdown}`);
        console.log(`  - Has variationType in DB: ${!!variation.variationType}`);

        // Add variationType if missing
        if (!variation.variationType) {
          variation.variationType = 'debit';
          variationUpdated = true;
          console.log(`  ✓ Adding variationType: debit`);
        }

        // Add costBreakdown if missing and has cost
        if (!variation.costBreakdown && variation.cost != null && variation.cost !== 0) {
          const cost = Math.abs(variation.cost);
          const gstRate = 10;
          const subtotal = cost / (1 + gstRate/100);
          const gstAmount = cost - subtotal;

          variation.costBreakdown = {
            subtotal: Number(subtotal.toFixed(2)),
            gstAmount: Number(gstAmount.toFixed(2)),
            gstRate: gstRate,
            total: Number(cost.toFixed(2))
          };
          variationUpdated = true;
          console.log(`  ✓ Adding costBreakdown:`, variation.costBreakdown);
        } else if (variation.cost == null || variation.cost === 0) {
          console.log(`  - Skipping: no cost value (${variation.cost})`);
        } else {
          console.log(`  - Already has costBreakdown`);
        }

        if (variationUpdated) {
          needsUpdate = true;
        }
      });

      if (needsUpdate) {
        // Use direct MongoDB collection update
        const result = await Project.collection.updateOne(
          { _id: project._id },
          { $set: { variations: updatedVariations } }
        );
        
        console.log(`✅ Direct DB update: matched=${result.matchedCount}, modified=${result.modifiedCount}`);
        
        // Verify the update worked
        const verifyProject = await Project.collection.findOne({ _id: project._id });
        const variationsWithoutBreakdown = verifyProject.variations.filter(v => 
          !v.costBreakdown && v.cost != null && v.cost !== 0
        );
        const variationsWithoutType = verifyProject.variations.filter(v => !v.variationType);
        
        console.log(`  Verification: ${variationsWithoutBreakdown.length} still missing costBreakdown, ${variationsWithoutType.length} still missing variationType`);
      } else {
        console.log(`- No updates needed for project ${project._id}`);
      }
    }

    console.log('\nCost breakdown migration completed successfully');
  } catch (error) {
    console.error('Error during cost breakdown migration:', error);
    throw error;
  }
};

// DIRECT DATABASE CLEANUP
export const cleanOldFields = async () => {
  console.log('Starting cleanup of old fields with direct database operations...');
  
  try {
    // Use direct MongoDB updateMany
    const profileResult = await Profile.collection.updateMany(
      {
        $or: [
          { 'profileData.company': { $exists: true } },
          { 'profileData.partnership': { $exists: true } }
        ]
      },
      {
        $unset: {
          'profileData.company': '',
          'profileData.partnership': ''
        }
      }
    );

    console.log(`Matched ${profileResult.matchedCount} profiles`);
    console.log(`Modified ${profileResult.modifiedCount} profiles`);
    
    // Verify cleanup
    const remainingCount = await Profile.collection.countDocuments({
      $or: [
        { 'profileData.company': { $exists: true } },
        { 'profileData.partnership': { $exists: true } }
      ]
    });
    
    console.log(`Profiles still with old fields: ${remainingCount}`);
    console.log('Cleanup completed successfully');
  } catch (error) {
    console.error('Error during cleanup:', error);
    throw error;
  }
};

// DIRECT DATABASE VALIDATION
export const validateMigrationResults = async () => {
  console.log('Validating migration results with direct database queries...');
  
  try {
    // Check profiles directly in MongoDB
    const profilesWithOldFields = await Profile.collection.countDocuments({
      $or: [
        { 'profileData.company': { $exists: true } },
        { 'profileData.partnership': { $exists: true } }
      ]
    });

    // Check projects directly in MongoDB
    const projectsWithProblematicVariations = await Project.collection.find({
      $or: [
        {
          'variations': {
            $elemMatch: {
              'costBreakdown': { $exists: false },
              'cost': { $exists: true, $ne: null, $ne: 0 }
            }
          }
        },
        {
          'variations': {
            $elemMatch: {
              'variationType': { $exists: false }
            }
          }
        }
      ]
    }).toArray();

    console.log('Migration Validation Results:');
    console.log('============================');
    console.log(`Profiles with old company/partnership fields: ${profilesWithOldFields}`);
    console.log(`Projects with problematic variations: ${projectsWithProblematicVariations.length}`);

    if (projectsWithProblematicVariations.length > 0) {
      console.log('\n--- Detailed Analysis of Problematic Projects ---');
      
      for (const project of projectsWithProblematicVariations) {
        console.log(`\nProject ${project._id}:`);
        
        project.variations.forEach((variation, index) => {
          const missingBreakdown = !variation.costBreakdown && variation.cost != null && variation.cost !== 0;
          const missingType = !variation.variationType;
          
          if (missingBreakdown || missingType) {
            console.log(`  Variation ${index}:`);
            console.log(`    - Cost: ${variation.cost}`);
            console.log(`    - Missing costBreakdown: ${missingBreakdown}`);
            console.log(`    - Missing variationType: ${missingType}`);
            
            if (variation.costBreakdown) {
              console.log(`    - Current costBreakdown:`, variation.costBreakdown);
            }
            if (variation.variationType) {
              console.log(`    - Current variationType: ${variation.variationType}`);
            }
          }
        });
      }
    }

    const allGood = profilesWithOldFields === 0 && projectsWithProblematicVariations.length === 0;

    if (allGood) {
      console.log('\n✅ All migrations completed successfully!');
      return true;
    } else {
      console.log('\n⚠️  Some migrations may not have completed fully. Check the details above.');
      return false;
    }

  } catch (error) {
    console.error('Error validating migration results:', error);
    throw error;
  }
};

// FORCE FIX - Run this if the above doesn't work
export const forceFixAllVariations = async () => {
  console.log('FORCE FIX: Updating ALL variations regardless of current state...');
  
  try {
    const projects = await Project.collection.find({
      'variations.0': { $exists: true }
    }).toArray();

    console.log(`Force fixing ${projects.length} projects...`);

    for (const project of projects) {
      const updatedVariations = project.variations.map((variation, index) => {
        console.log(`Force updating variation ${index} in project ${project._id}`);
        
        // Force add variationType
        if (!variation.variationType) {
          variation.variationType = 'debit';
          console.log(`  ✓ Force added variationType: debit`);
        }

        // Force add costBreakdown if has cost
        if (variation.cost != null && variation.cost !== 0) {
          const cost = Math.abs(variation.cost);
          const gstRate = 10;
          const subtotal = cost / (1 + gstRate/100);
          const gstAmount = cost - subtotal;

          variation.costBreakdown = {
            subtotal: Number(subtotal.toFixed(2)),
            gstAmount: Number(gstAmount.toFixed(2)),
            gstRate: gstRate,
            total: Number(cost.toFixed(2))
          };
          console.log(`  ✓ Force added costBreakdown`);
        }

        return variation;
      });

      // Force update in database
      const result = await Project.collection.replaceOne(
        { _id: project._id },
        { ...project, variations: updatedVariations }
      );
      
      console.log(`Force updated project ${project._id}: matched=${result.matchedCount}, modified=${result.modifiedCount}`);
    }

    console.log('Force fix completed');
  } catch (error) {
    console.error('Error during force fix:', error);
    throw error;
  }
};

// Keep existing functions...
export const migrateBusinessType = async () => {
  console.log('Starting business type migration...');
  
  try {
    const profiles = await Profile.find({
      $or: [
        { 'profileData.company': { $exists: true } },
        { 'profileData.partnership': { $exists: true } },
        { 'profileData.businessType': { $exists: false } }
      ]
    });

    console.log(`Found ${profiles.length} profiles to migrate`);

    for (const profile of profiles) {
      let businessType = 'Individual';

      if (profile.profileData.company === 'Yes') {
        businessType = 'Company';
      } else if (profile.profileData.partnership === 'Yes') {
        businessType = 'Partnership';
      }

      profile.profileData.businessType = businessType;
      await profile.save();

      console.log(`Updated profile ${profile._id} to businessType: ${businessType}`);
    }

    console.log('Business type migration completed successfully');
  } catch (error) {
    console.error('Error during business type migration:', error);
    throw error;
  }
};

export const migrateDateFields = async () => {
  console.log('Starting date fields migration...');
  
  try {
    const projects = await Project.find({
      $or: [
        { originalEndDate: { $exists: false } },
        { currentEndDate: { $exists: false } },
        { totalDaysExtended: { $exists: false } }
      ]
    });

    console.log(`Found ${projects.length} projects to migrate`);

    for (const project of projects) {
      const updateData = {};

      if (!project.originalEndDate && project.expectedEndDate) {
        updateData.originalEndDate = project.expectedEndDate;
      } else if (!project.originalEndDate && project.startDate) {
        const defaultEndDate = new Date(project.startDate);
        defaultEndDate.setMonth(defaultEndDate.getMonth() + 6);
        updateData.originalEndDate = defaultEndDate;
      }

      if (project.totalDaysExtended === undefined) {
        updateData.totalDaysExtended = 0;
      }

      if (!project.currentEndDate && updateData.originalEndDate) {
        updateData.currentEndDate = updateData.originalEndDate;
      }

      if (Object.keys(updateData).length > 0) {
        await Project.updateOne(
          { _id: project._id },
          { $set: updateData }
        );
        console.log(`Updated project ${project._id} date fields`);
      }
    }

    console.log('Date fields migration completed successfully');
  } catch (error) {
    console.error('Error during date fields migration:', error);
    throw error;
  }
};

export const migrateArchitectSurveyor = async () => {
  console.log('Starting architect/surveyor migration...');
  
  try {
    const projects = await Project.find({
      $or: [
        { architect: { $exists: false } },
        { surveyor: { $exists: false } }
      ]
    });

    console.log(`Found ${projects.length} projects to migrate`);

    for (const project of projects) {
      const updateData = {};

      if (!project.architect) {
        updateData.architect = {
          hasArchitect: false,
          details: {}
        };
      }

      if (!project.surveyor) {
        updateData.surveyor = {
          hasSurveyor: false,
          details: {}
        };
      }

      if (Object.keys(updateData).length > 0) {
        await Project.updateOne(
          { _id: project._id },
          { $set: updateData }
        );
        console.log(`Added architect/surveyor fields to project ${project._id}`);
      }
    }

    console.log('Architect/surveyor migration completed successfully');
  } catch (error) {
    console.error('Error during architect/surveyor migration:', error);
    throw error;
  }
};

export const runAllMigrations = async () => {
  console.log('Starting all migrations...');
  
  try {
    await migrateBusinessType();
    await migrateDateFields();
    await migrateCostBreakdown();
    await migrateArchitectSurveyor();
    await cleanOldFields();
    
    console.log('All migrations completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  }
};

export const rollbackBusinessType = async () => {
  console.log('Rolling back business type migration...');
  
  try {
    const profiles = await Profile.find({
      'profileData.businessType': { $exists: true }
    });

    console.log(`Found ${profiles.length} profiles to rollback`);

    for (const profile of profiles) {
      const businessType = profile.profileData.businessType;

      if (businessType === 'company') {
        profile.profileData.company = 'Yes';
        profile.profileData.partnership = 'No';
      } else if (businessType === 'partnership') {
        profile.profileData.company = 'No';
        profile.profileData.partnership = 'Yes';
      } else {
        profile.profileData.company = 'No';
        profile.profileData.partnership = 'No';
      }

      profile.profileData.businessType = undefined;
      await profile.save();

      console.log(`Rolled back profile ${profile._id} from businessType: ${businessType}`);
    }

    console.log('Business type rollback completed');
  } catch (error) {
    console.error('Error during rollback:', error);
    throw error;
  }
};

// CLI Runner
const runMigration = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const command = process.argv[2];

    switch (command) {
      case 'up':
        await runAllMigrations();
        break;
      case 'business-type':
        await migrateBusinessType();
        break;
      case 'dates':
        await migrateDateFields();
        break;
      case 'cost-breakdown':
        await migrateCostBreakdown();
        break;
      case 'architect-surveyor':
        await migrateArchitectSurveyor();
        break;
      case 'clean-old-fields':
        await cleanOldFields();
        break;
      case 'force-fix':
        await forceFixAllVariations();
        break;
      case 'rollback-business-type':
        await rollbackBusinessType();
        break;
      case 'validate':
        await validateMigrationResults();
        break;
      default:
        console.log('Available commands:');
        console.log('  up                 - Run all migrations');
        console.log('  business-type      - Migrate business type fields');
        console.log('  dates              - Migrate date fields');
        console.log('  cost-breakdown     - Migrate cost breakdown fields');
        console.log('  architect-surveyor - Migrate architect/surveyor fields');
        console.log('  clean-old-fields   - Clean old company/partnership fields');
        console.log('  force-fix          - Force fix all variations');
        console.log('  rollback-business-type - Rollback business type migration');
        console.log('  validate           - Validate migration results');
        break;
    }

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('Migration error:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
};

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runMigration();
}