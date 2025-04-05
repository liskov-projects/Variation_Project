// backend/controllers/profileController.js
import Profile from '../models/profileModel.js';

// @desc    Get user profile by userId
// @route   GET /api/profile/:userId
export const getProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    // Check if the request user ID matches the parameter
    if (req.auth.userId !== userId) {
      return res.status(403).json({
        message: 'Unauthorized: You can only access your own profile'
      });
    }

    const profile = await Profile.findOne({ userId });

    if (!profile) {
      return res.status(404).json({
        message: 'Profile not found'
      });
    }

    res.status(200).json(profile);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Create new profile
// @route   POST /api/profile
export const createProfile = async (req, res) => {
  try {
    const { userId, email,profileData, profileSetupComplete } = req.body;

    // Check if the request user ID matches the body
    if (req.auth.userId !== userId) {
      return res.status(403).json({
        message: 'Unauthorized: You can only create your own profile'
      });
    }

    // Check if profile already exists
    const existingProfile = await Profile.findOne({ userId });
    if (existingProfile) {
      return res.status(400).json({
        message: 'Profile already exists for this user'
      });
    }

    // Validate profile data
    if (profileData.acn && profileData.acn.toString().length !== 9) {
      return res.status(400).json({
        message: 'ACN must be exactly 9 digits'
      });
    }

    if (profileData.abn && profileData.abn.toString().length !== 11) {
      return res.status(400).json({
        message: 'ABN must be exactly 11 digits'
      });
    }

    // Create new profile
    const newProfile = new Profile({
      userId,
      email,
      profileData,
      profileSetupComplete: profileSetupComplete || false
    });

    const savedProfile = await newProfile.save();

    res.status(201).json({
      message: 'Profile created successfully',
      profile: savedProfile
    });
  } catch (error) {
    console.error('Error creating profile:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        message: 'Validation Error',
        errors: messages
      });
    }
    
    res.status(500).json({
      message: 'Server error',
      error: error.message
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
        message: 'Unauthorized: You can only update your own profile'
      });
    }

    // Find profile
    const profile = await Profile.findOne({ userId });
    if (!profile) {
      return res.status(404).json({
        message: 'Profile not found'
      });
    }

    // Validate profile data
    if (profileData.acn && profileData.acn.toString().length !== 9) {
      return res.status(400).json({
        message: 'ACN must be exactly 9 digits'
      });
    }

    if (profileData.abn && profileData.abn.toString().length !== 11) {
      return res.status(400).json({
        message: 'ABN must be exactly 11 digits'
      });
    }

    // Update profile
    profile.profileData = profileData;
    if (profileSetupComplete !== undefined) {
      profile.profileSetupComplete = profileSetupComplete;
    }

    const updatedProfile = await profile.save();

    res.status(200).json({
      message: 'Profile updated successfully',
      profile: updatedProfile
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        message: 'Validation Error',
        errors: messages
      });
    }
    
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
};