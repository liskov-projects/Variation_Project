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
      company: {
        type: String,
        enum: ["Yes", "No"],
        required: [true, "Company status is required"],
      },
      companyDetails: {
        companyName: {
          type: String,
          required: function () {
            return this.profileData.company === "Yes";
          },
        },
        acn: {
          type: String,
          required: function () {
            return this.profileData.company === "Yes";
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
      partnership: {
        type: String,
        enum: ["Yes", "No"],
        required: [true, "Partnership status is required"],
      },
      numberOfPartners: {
        type: String,
        required: function () {
          return this.profileData.partnership === "Yes";
        },
      },
      partners: [partnerSchema],

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
        required: [true, "Builder registration number is required"],
      },
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
