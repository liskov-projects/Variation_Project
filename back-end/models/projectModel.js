import mongoose from 'mongoose';

const signatureSchema = new mongoose.Schema({

});

// Variation Form schema
const variationFormSchema = new mongoose.Schema({
  description: {
    type: String,
    required: [true, 'Variation description is required']
  },
  reason: {
    type: String,
    required: [true, 'Variation reason is required']
  },
  effect: {
    type: String,
    required: [true, 'Variation effect is required']
  },
  permitVariation: {
    type: String,
    required: [true, 'Permit Variation is required']
  },
  delay: {
    type: String,
    required: [true, 'Delay is required']
  },
  cost: {
    type: Number,
    required: [true, 'Cost is required']
  },
  newContractPrice: {
    type: Number,
    required: [true, 'New Contract price is required']
  },
  dateCreated: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['draft', 'submitted', 'approved', 'rejected'],
    default: 'draft'
  },
  signatureToken:{
    type:String,
    // Using 'unique' would require an index on nested documents,
    // which has limitations in MongoDB, so we handle uniqueness in application logic
  },
  signatureTokenExpiresAt:{
    type:Date
  },
  signatureData: {
    type: String // Base64 encoded signature image
  },
  signedAt: {
    type: Date
  },
  signedBy: {
    name: String,
    email: String,
    ipAddress: String,
    userAgent: String
    // All fields in signedBy Creates a more complete audit trail for verification
  }
},
{
  timestamps: true
});

// Main Project schema
const projectSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: [true, 'User ID is required']
  },
  propertyAddress: {
    type: String,
    required: [true, 'Property address is required']
  },
  clientName: {
    type: String,
    required: [true, 'Client name is required']
  },
  clientEmail: {
    type: String,
    required: [true, 'Client email is required'],
    match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address']
  },
  clientPhone: {
    type: String,
    required: [true, 'Client phone is required']
  },
  projectName: {
    type: String,
    required: [true, 'Project name is required']
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  expectedEndDate: {
    type: Date
  },
  status: {
    type: String,
    enum: ['active', 'on-hold', 'completed', 'cancelled'],
    default: 'active'
  },
  description: {
    type: String,
    default: ''
  },
  variations: [variationFormSchema]
}, {
  timestamps: true
});

// Helper method to find a variation by its signature token
projectSchema.statics.findVariationByToken=async function(token){
  if (!token) return null;
  const project=await this.findOne({
    'variations.signatureToken':token,
    'variations.signatureTokenExpiresAt':{$gt:new Date()}
  });

  if (!project) return null;
  const variation=project.variations.find(v=>v.signatureToken===token)
  return {project,variation}
}

const Project = mongoose.model('Project', projectSchema);

export default Project;