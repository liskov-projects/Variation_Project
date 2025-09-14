import Profile from "../models/profileModel.js";

// @desc    Get user profile by userId
// @route   GET /api/profile/:userId
export const getProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    // Check if the request user ID matches the parameter
    if (req.auth.userId !== userId) {
      return res.status(403).json({
        message: "Unauthorized: You can only access your own profile",
      });
    }

    const profile = await Profile.findOne({ userId });

    console.log("Profile:", profile);

    if (!profile) {
      return res.status(404).json({
        message: "Profile not found",
      });
    }

    res.status(200).json(profile);
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// @desc    Create new profile
// @route   POST /api/profile
export const createProfile = async (req, res) => {
  try {
    const { userId, email, profileData, profileSetupComplete } = req.body;

    // Check if the request user ID matches the body
    if (req.auth.userId !== userId) {
      return res.status(403).json({
        message: "Unauthorized: You can only create your own profile",
      });
    }

    // Check if profile already exists
    const existingProfile = await Profile.findOne({ userId });
    if (existingProfile) {
      return res.status(400).json({
        message: "Profile already exists for this user",
      });
    }

    // TASK 1: Validate business type and related fields
    if (
      !profileData.businessType ||
      !["Individual", "Company", "Partnership"].includes(profileData.businessType)
    ) {
      return res.status(400).json({
        message: "Business type must be Individual, Company, or Partnership",
      });
    }

    // Validate company details if business type is company
    if (profileData.businessType === "Company") {
      if (!profileData.companyDetails?.companyName) {
        return res.status(400).json({
          message: "Company name is required when business type is Company",
        });
      }
      if (
        profileData.CompanyDetails?.acn &&
        profileData.CompanyDetails?.acn.toString().length !== 9
      ) {
        return res.status(400).json({
          message: "ACN must be exactly 9 digits",
        });
      }
    }

    // Validate partnership details if business type is partnership
    if (profileData.businessType === "Partnership") {
      if (!profileData.numberOfPartners) {
        return res.status(400).json({
          message: "Number of partners is required when business type is Partnership",
        });
      }
      if (!profileData.partners || profileData.partners.length === 0) {
        return res.status(400).json({
          message: "At least one partner is required when business type is Partnership",
        });
      }
    }

    // Validate ABN for all business types
    if (profileData.abn && profileData.abn.toString().length !== 11) {
      return res.status(400).json({
        message: "ABN must be exactly 11 digits",
      });
    }

    // Create new profile
    const newProfile = new Profile({
      userId,
      email,
      profileData,
      profileSetupComplete: profileSetupComplete || false,
    });

    const savedProfile = await newProfile.save();

    res.status(201).json({
      message: "Profile created successfully",
      profile: savedProfile,
    });
  } catch (error) {
    console.error("Error creating profile:", error);

    // Handle validation errors
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        message: "Validation Error",
        errors: messages,
      });
    }

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// @desc    Update profile
// @route   PUT /api/profile/:userId
export const updateProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const { profileData, profileSetupComplete } = req.body;

    // Check if the request user ID matches the parameter
    if (req.auth.userId !== userId) {
      return res.status(403).json({
        message: "Unauthorized: You can only update your own profile",
      });
    }

    // Find profile
    const profile = await Profile.findOne({ userId });
    if (!profile) {
      return res.status(404).json({
        message: "Profile not found",
      });
    }

    // TASK 1: Validate business type and related fields
    if (
      profileData.businessType &&
      !["Individual", "Company", "Partnership"].includes(profileData.businessType)
    ) {
      return res.status(400).json({
        message: "Business type must be Individual, Company, or Partnership",
      });
    }

    // Validate company details if business type is company
    if (profileData.businessType === "Company") {
      if (!profileData.companyDetails?.companyName) {
        return res.status(400).json({
          message: "Company name is required when business type is Company",
        });
      }
      if (
        profileData.CompanyDetails?.acn &&
        profileData.CompanyDetails?.acn.toString().length !== 9
      ) {
        return res.status(400).json({
          message: "ACN must be exactly 9 digits",
        });
      }
    }

    // Validate partnership details if business type is partnership
    if (profileData.businessType === "Partnership") {
      if (!profileData.numberOfPartners) {
        return res.status(400).json({
          message: "Number of partners is required when business type is Partnership",
        });
      }
      if (!profileData.partners || profileData.partners.length === 0) {
        return res.status(400).json({
          message: "At least one partner is required when business type is Partnership",
        });
      }
    }

    // Validate ABN
    if (profileData.abn && profileData.abn.toString().length !== 11) {
      return res.status(400).json({
        message: "ABN must be exactly 11 digits",
      });
    }

    // Update profile
    profile.profileData = { ...profile.profileData.toObject(), ...profileData };
    if (profileSetupComplete !== undefined) {
      profile.profileSetupComplete = profileSetupComplete;
    }

    const updatedProfile = await profile.save();

    res.status(200).json({
      message: "Profile updated successfully",
      profile: updatedProfile,
    });
  } catch (error) {
    console.error("Error updating profile:", error);

    // Handle validation errors
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        message: "Validation Error",
        errors: messages,
      });
    }

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// TASK 5: Upload logo
// @desc    Upload profile logo
// @route   POST /api/profile/:userId/logo
export const uploadLogo = [
  // upload.single('logo'),
  async (req, res) => {
    try {
      const { userId } = req.params;

      // Check if the request user ID matches the parameter
      if (req.auth.userId !== userId) {
        return res.status(403).json({
          message: "Unauthorized: You can only upload logo to your own profile",
        });
      }

      if (!req.file) {
        return res.status(400).json({
          message: "No logo file provided",
        });
      }

      // Find profile, profile may not exist yet

      // const profile = await Profile.findOne({ userId });
      // if (!profile) {
      //   return res.status(404).json({
      //     message: 'Profile not found'
      //   });
      // }

      const profile = await Profile.findOne({ userId });
      const logoPath = `uploads/${req.file.filename}`;
      if (!profile) {
        //  Profile doesn't exist, return 200 with message instead of 404
        return res.status(200).json({
          message: "Profile not found. Logo uploaded.",
          logo: logoPath,
          profile: null,
        });
      }

      // Convert to base64
      const logoBase64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;

      // Update profile with logo
      profile.profileData.logo = logoBase64;
      const updatedProfile = await profile.save();

      res.status(200).json({
        message: "Logo uploaded successfully",
        profile: updatedProfile,
      });
    } catch (error) {
      console.error("Error uploading logo:", error);
      res.status(500).json({
        message: "Server error",
        error: error.message,
      });
    }
  },
];

// @desc    Delete profile logo
// @route   DELETE /api/profile/:userId/logo
export const deleteLogo = async (req, res) => {
  try {
    const { userId } = req.params;

    // Check if the request user ID matches the parameter
    if (req.auth.userId !== userId) {
      return res.status(403).json({
        message: "Unauthorized: You can only delete logo from your own profile",
      });
    }

    // Find profile
    const profile = await Profile.findOne({ userId });
    if (!profile) {
      return res.status(404).json({
        message: "Profile not found",
      });
    }

    // Remove logo
    profile.profileData.logo = null;
    const updatedProfile = await profile.save();

    res.status(200).json({
      message: "Logo deleted successfully",
      profile: updatedProfile,
    });
  } catch (error) {
    console.error("Error deleting logo:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};
