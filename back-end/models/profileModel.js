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
        enum: ['individual', 'company', 'partnership'],
        required: [true, 'Business type is required']
      },
      
      // Company details - only required if businessType is 'company'
      companyDetails: {
        companyName: {
          type: String,
          required: function () {
            return this.profileData.businessType === 'company';
          }
        },
        acn: {
          type: String,
          required: function () {
            return this.profileData.businessType === 'company';
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
      
      // Partnership details - only required if businessType is 'partnership'
      numberOfPartners: {
        type: String,
        required: function() {
          return this.profileData.businessType === 'partnership';
        }
      },
      partners: {
        type: [partnerSchema],
        validate: {
          validator: function(partners) {
            // Only validate if businessType is partnership
            if (this.profileData.businessType === 'partnership') {
              return partners && partners.length > 0;
            }
            return true;
          },
          message: 'At least one partner is required for partnerships'
        }
      },

      abn: {
        type: String,
        required: [true, "ABN is required"],
        validate: {
          validator: function (v) {
            return v.length === 11;
          },
          message: "ABN must be exactly 11 digits",
        },
      },
      brn: {
        type: String,
        required: [true, 'Builder registration number is required']
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
