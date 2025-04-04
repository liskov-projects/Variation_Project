// backend/models/projectModel.js
import mongoose from 'mongoose';

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
  }
}, {
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

const Project = mongoose.model('Project', projectSchema);

export default Project;