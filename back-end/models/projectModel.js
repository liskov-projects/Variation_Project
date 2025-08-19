import mongoose from "mongoose";

const signatureSchema = new mongoose.Schema({});

const architectProjectManagerSchema = new mongoose.Schema({
  hasArchitect: {
    type: Boolean,
    // required: [true, 'Architect status is required'],
    default: false,
  },
  details: {
    companyName: {
      type: String,
      // required: function() {
      //   return this.hasArchitect;
      // }
    },
    contactName: {
      type: String,
      // required: function() {
      //   return this.hasArchitect;
      // }
    },
    address: {
      type: String,
      // required: function() {
      //   return this.hasArchitect;
      // }
    },
    phone: {
      type: String,
      // required: function() {
      //   return this.hasArchitect;
      // }
    },
    email: {
      type: String,
      // required: function() {
      //   return this.hasArchitect;
      // },
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"],
    },
  },
});

const surveyorSchema = new mongoose.Schema({
  hasSurveyor: {
    type: Boolean,
    // required: [true, 'Surveyor status is required'],
    default: true,
  },
  details: {
    companyName: {
      type: String,
      required: function () {
        return this.hasSurveyor;
      },
    },
    contactName: {
      type: String,
      required: function () {
        return this.hasSurveyor;
      },
    },
    address: {
      type: String,
      required: function () {
        return this.hasSurveyor;
      },
    },
    phone: {
      type: String,
      required: function () {
        return this.hasSurveyor;
      },
    },
    email: {
      type: String,
      required: function () {
        return this.hasSurveyor;
      },
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"],
    },
  },
});

const variationFormSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: [true, "Variation description is required"],
    },
    reason: {
      type: String,
      required: [true, "Variation reason is required"],
    },
    effect: {
      type: String,
      required: [true, "Variation effect is required"],
    },
    permitVariation: {
      type: String,
      required: [true, "Permit Variation is required"],
    },
    delay: {
      type: String,
      required: [true, "Delay is required"],
    },

    variationType: {
      type: String,
      enum: ["debit", "credit"], // debit = cost to owner, credit = money back to owner
      required: [true, "Variation type is required"],
      default: "debit",
    },

    cost: {
      type: Number,
      required: [true, "Cost is required"],
    },

    dateCreated: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["draft", "submitted", "approved", "rejected"],
      default: "draft",
    },
    signatureToken: {
      type: String,
      // Using 'unique' would require an index on nested documents,
      // which has limitations in MongoDB, so we handle uniqueness in application logic
    },
    signatureTokenExpiresAt: {
      type: Date,
    },
    signatureData: {
      type: String, // Base64 encoded signature image
    },
    signedAt: {
      type: Date,
    },
    signedBy: {
      name: String,
      email: String,
      ipAddress: String,
      userAgent: String,
      // All fields in signedBy Creates a more complete audit trail for verification
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save middleware to calculate total cost from breakdown
variationFormSchema.pre("save", function (next) {
  if (this.costBreakdown) {
    // Calculate total from subtotal + GST
    this.costBreakdown.total = this.costBreakdown.subtotal + this.costBreakdown.gstAmount;

    // For credit variations, make the cost negative
    if (this.variationType === "credit") {
      this.cost = -Math.abs(this.costBreakdown.total);
    } else {
      this.cost = this.costBreakdown.total;
    }
  }
  next();
});

// Main Project schema
const projectSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: [true, "User ID is required"],
    },
    propertyAddress: {
      type: String,
      required: [true, "Property address is required"],
    },
    clientName: {
      type: String,
      required: [true, "Client name is required"],
    },
    clientEmail: {
      type: String,
      required: [true, "Client email is required"],
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"],
    },
    clientPhone: {
      type: String,
      required: [true, "Client phone is required"],
    },
    projectName: {
      type: String,
      required: [true, "Project name is required"],
    },
    startDate: {
      type: Date,
      required: [true, "Start date is required"],
    },

    originalEndDate: {
      type: Date,
      required: [true, "Original end date is required"],
    },
    currentEndDate: {
      type: Date, // This will be calculated based on extensions
    },
    totalDaysExtended: {
      type: Number,
      default: 0,
    },

    // Keep expectedEndDate for backward compatibility
    expectedEndDate: {
      type: Date,
    },

    status: {
      type: String,
      enum: ["active", "on-hold", "completed", "cancelled"],
      default: "active",
    },
    description: {
      type: String,
      default: "",
    },
    contractPrice: {
      type: Number,
      required: [true, "Contract price is required"],
      min: [0, "Contract price must be a positive number"],
    },
    currentContractPrice: {
      type: Number,
      default: function () {
        return this.contractPrice;
      },
    },

    architect: architectProjectManagerSchema,

    surveyor: surveyorSchema,

    variations: [variationFormSchema],
  },
  {
    timestamps: true,
  }
);

// BUSINESS LOGIC METHODS FOR VARIATION ROUTING

// Method to determine who should receive variation notifications
projectSchema.methods.getVariationRecipient = function () {
  // If architect is engaged, variations go to architect, else to owner
  if (this.architect && this.architect.hasArchitect && this.architect.details.email) {
    return {
      type: "architect",
      email: this.architect.details.email,
      name: this.architect.details.contactName,
      company: this.architect.details.companyName,
    };
  }

  // Fall back to client/owner
  return {
    type: "owner",
    email: this.clientEmail,
    name: this.clientName,
  };
};

// Method to check if variation requires surveyor sign-off
projectSchema.methods.requiresSurveyorSignoff = function (variation) {
  // If it's a permit variation, it needs surveyor sign-off
  if (
    variation &&
    variation.permitVariation &&
    variation.permitVariation.toLowerCase().includes("yes")
  ) {
    return this.surveyor && this.surveyor.hasSurveyor;
  }
  return false;
};

// Method to get surveyor details for sign-off
projectSchema.methods.getSurveyorForSignoff = function () {
  if (this.surveyor && this.surveyor.hasSurveyor && this.surveyor.details.email) {
    return {
      email: this.surveyor.details.email,
      name: this.surveyor.details.contactName,
      company: this.surveyor.details.companyName,
    };
  }
  return null;
};

// Helper method to find a variation by its signature token
projectSchema.statics.findVariationByToken = async function (token) {
  if (!token) return null;
  const project = await this.findOne({
    "variations.signatureToken": token,
    "variations.signatureTokenExpiresAt": { $gt: new Date() },
  });

  if (!project) return null;
  const variation = project.variations.find((v) => v.signatureToken === token);
  return { project, variation };
};

// Method to calculate current contract price (updated for credit variations)
projectSchema.methods.calculateCurrentContractPrice = function () {
  const totalVariationCost = this.variations.reduce((total, variation) => {
    // Only include approved variations in the calculation
    if (variation.status === "approved") {
      // Cost can be negative for credit variations
      return total + (variation.cost || 0);
    }
    return total;
  }, 0);

  this.currentContractPrice = this.contractPrice + totalVariationCost;
  return this.currentContractPrice;
};

// TASK 6: Method to calculate current end date based on extensions
projectSchema.methods.calculateCurrentEndDate = function () {
  if (this.originalEndDate && this.totalDaysExtended !== undefined) {
    const currentDate = new Date(this.originalEndDate);
    currentDate.setDate(currentDate.getDate() + this.totalDaysExtended);
    this.currentEndDate = currentDate;

    // Update expectedEndDate for backward compatibility
    this.expectedEndDate = currentDate;
  }
  return this.currentEndDate;
};

// Pre-save middleware to automatically update current contract price
projectSchema.pre("save", function (next) {
  if (this.isModified("variations") || this.isModified("contractPrice")) {
    this.calculateCurrentContractPrice();
  }

  if (this.isModified("originalEndDate") || this.isModified("totalDaysExtended")) {
    this.calculateCurrentEndDate();
  }

  next();
});

const Project = mongoose.model("Project", projectSchema);

export default Project;
