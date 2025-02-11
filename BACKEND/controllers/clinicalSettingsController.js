const User = require('../models/user'); // Assuming your User model is used for clinical staff

// Fetch clinical staff details
exports.getClinicalStaffDetails = async (req, res) => {
  try {
    const clinicalStaffId = req.user.id; // Extract user ID from token
    const clinicalStaff = await User.findById(clinicalStaffId);

    if (!clinicalStaff) {
      return res.status(404).json({ message: 'Clinical staff not found' });
    }

    res.json({
      fullName: clinicalStaff.fullName,
      email: clinicalStaff.email,
      phoneNumber: clinicalStaff.phoneNumber,
      profilePicture: clinicalStaff.profilePicture, // Include image if you have it
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Update clinical staff details
exports.updateClinicalStaffDetails = async (req, res) => {
  try {
    const clinicalStaffId = req.user.id;
    const { fullName, email, phoneNumber, profilePicture } = req.body;

    const updatedStaff = await User.findByIdAndUpdate(
      clinicalStaffId,
      { fullName, email, phoneNumber, profilePicture },
      { new: true } // Return the updated document
    );

    if (!updatedStaff) {
      return res.status(404).json({ message: 'Clinical staff not found' });
    }

    res.json({ message: 'Profile updated successfully', updatedStaff });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
