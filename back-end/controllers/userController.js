// back-end/controllers/userController.js
import forms from "../model/dbSchema.js";

// Get user profile by userId
export const getUserProfile = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await forms.findOne({ userId });

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    return res.status(200).json({
      userId: user.userId,
      email: user.email,
      formData: user.formData
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

// Update user profile
export const updateUserProfile = async (req, res) => {
  const { userId } = req.params;
  const { formData, email } = req.body;

  try {
    // Check if user exists
    const user = await forms.findOne({ userId });

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    // Validate ACN and ABN
    if (formData.acn && formData.acn.toString().length !== 9) {
      return res.status(400).json({
        message: "ACN must be exactly 9 digits"
      });
    }

    if (formData.abn && formData.abn.toString().length !== 11) {
      return res.status(400).json({
        message: "ABN must be exactly 11 digits"
      });
    }

    // Update the formData array with the new data
    const updatedUser = await forms.findOneAndUpdate(
      { userId },
      {
        $set: { 
          email,
          // Replace the last entry in the formData array with the updated version
          [`formData.${user.formData.length - 1}`]: formData 
        }
      },
      { 
        new: true,
        runValidators: true
      }
    );

    return res.status(200).json({
      message: "User profile updated successfully",
      data: updatedUser
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};