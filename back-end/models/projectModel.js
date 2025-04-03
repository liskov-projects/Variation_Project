import mongoose from 'mongoose';

// Owner schema for project owners
const ownerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Owner name is required']
  },
  phone: String,
  email: String,
  address: String,
  isDifferentAddress: {
    type: Boolean,
    default: false
  }
});

// Architect/Contract Administrator schema
const architectSchema = new mongoose.Schema({
  isInvolved: {
    type: Boolean,
    default: false
  },
  name: String,
  address: String,
  phone: String,
  email: String
});

// Contract Information schema
const contractSchema = new mongoose.Schema({
  price: {
    type: Number,
    required: [true, 'Contract price is required']
  },
  depositAmount: {
    type: Number,
    required: [true, 'Deposit amount is required']
  },
  isDomesticBuildingOnly: {
    type: Boolean,
    default: true
  },
  contractStatementProvided: {
    type: Boolean,
    default: false
  },
  foundationsDataObtained: {
    type: Boolean,
    default: false
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  numberOfDays: {
    type: Number,
    required: [true, 'Number of days is required']
  },
  contractDate: {
    type: Date,
    required: [true, 'Contract date is required']
  },
  endDate: {
    type: Date
  },
  insuranceDetails: String,
  signedByAllParties: {
    type: Boolean,
    default: false
  }
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
  variations: [variationFormSchema],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Pre-save hook to calculate end date
projectSchema.pre('save', function(next) {
  if (this.contractInfo.startDate && this.contractInfo.numberOfDays) {
    const startDate = new Date(this.contractInfo.startDate);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + this.contractInfo.numberOfDays);
    this.contractInfo.endDate = endDate;
  }
  this.updatedAt = Date.now();
  next();
});

const Project = mongoose.model('Project', projectSchema);

export default Project;