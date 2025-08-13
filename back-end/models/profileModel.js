import mongoose from "mongoose";

const partnerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Partner name is required"],
  },
  address: {
    type: String,
    required: [true, "Partner address is required"],
  },
});

const profileSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: [true, "User ID is required"],
      unique: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"],
    },
    profileData: {
      fullName: {
        type: String,
        required: [true, "Builder name is required"],
      },
      address: {
        type: String,
        required: [true, "Address is required"],
      },
      phoneNumber: {
        type: String,
        required: [true, "Phone number is required"],
      },
      
      businessType: {
        type: String,
        enum: ['Individual', 'Company', 'Partnership'],
        required: [true, 'Business type is required']
      },
      
      // Company details - only required if businessType is 'Company'
      companyDetails: {
        companyName: {
          type: String,
          required: function () {
            return this.profileData.businessType === 'Company';
          }
        },
        acn: {
          type: String,
          required: function () {
            return this.profileData.businessType === 'Company';
          },
          validate: {
            validator: function (v) {
              // Only validate if provided
              return !v || v.length === 9;
            },
            message: "ACN must be exactly 9 digits",
          },
        },
      },
      
      // Partnership details - only required if businessType is 'Partnership'
      numberOfPartners: {
        type: String,
        required: function() {
          return this.profileData.businessType === 'Partnership';
        }
      },
      partners: {
        type: [partnerSchema],
        validate: {
          validator: function(partners) {
            // Only validate if businessType is Partnership
            if (this.profileData.businessType === 'Partnership') {
              return partners && partners.length > 0;
            }
            return true;
          },
          message: 'At least one partner is required for Partnerships'
        }
      },

      abn: {
        type: String,
        required: function () {
          return this.profileData.businessType === 'Individual';
        },
        validate: {
          validator: function (v) {
            // Only validate if the field is provided and businessType is Individual
            if (this.profileData.businessType !== 'Individual') {
              return true; // Skip validation for non-Individual types
            }
            return v && v.length === 11;
          },
          message: "ABN must be exactly 11 digits",
        },
      },
      brn: {
        type: String,
        required: function () {
          return this.profileData.businessType === 'Individual';
        },
      },
      
      logo: {
        type: String, // Base64 encoded image or file path/URL
        default: null
      }
    },
    profileSetupComplete: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Profile = mongoose.model("Profile", profileSchema);

export default Profile;
