const User = require('../models/user');
const bcrypt = require('bcrypt');
const Prescription = require('../models/Prescription');

// Get Doctor Profile
const getDoctorProfile = async (req, res) => {
    try {
        if (!req.user || req.user.role !== 'Doctor') {
            return res.status(403).json({ message: 'Access denied. Only doctors can view this profile.' });
        }

        const doctor = await User.findOne({ _id: req.user.id, role: 'Doctor' });
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }

        res.status(200).json({
            fullName: doctor.fullName,
            email: doctor.email,
            phoneNumber: doctor.phoneNumber,
            medicalLicenseNumber: doctor.medicalLicenseNumber,
            specialization: doctor.specialization,
            yearsOfExperience: doctor.yearsOfExperience,
            availableDays: doctor.availableDays,
            availableTimes: doctor.availableTimes,
        });
    } catch (error) {
        console.error('Error fetching doctor profile:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Update Doctor Profile
const updateDoctorProfile = async (req, res) => {
    const { fullName, email, phoneNumber, specialization, yearsOfExperience, availableDays, availableTimes } = req.body;

    try {
        const doctor = await User.findOne({ _id: req.user.id, role: 'Doctor' });
        if (!doctor) return res.status(404).json({ message: 'Doctor not found' });

        // Update profile fields
        doctor.fullName = fullName || doctor.fullName;
        doctor.email = email || doctor.email;
        doctor.phoneNumber = phoneNumber || doctor.phoneNumber;
        doctor.specialization = specialization || doctor.specialization;
        doctor.yearsOfExperience = yearsOfExperience || doctor.yearsOfExperience;
        doctor.availableDays = availableDays || doctor.availableDays;
        doctor.availableTimes = availableTimes || doctor.availableTimes;

        const updatedDoctor = await doctor.save();

        res.status(200).json({
            message: 'Profile updated successfully',
            doctor: {
                fullName: updatedDoctor.fullName,
                email: updatedDoctor.email,
                phoneNumber: updatedDoctor.phoneNumber,
                specialization: updatedDoctor.specialization,
                yearsOfExperience: updatedDoctor.yearsOfExperience,
                availableDays: updatedDoctor.availableDays,
                availableTimes: updatedDoctor.availableTimes,
            },
        });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ message: 'Failed to update profile' });
    }
};

// Change Password
const changePassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Incorrect old password' });

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        res.json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error('Error updating password:', error);
        res.status(500).json({ message: 'Error updating password' });
    }
};

// Save Prescription
const savePrescription = async (req, res) => {
    const { patientName, doctorName, content } = req.body;

    try {
        const prescription = new Prescription({ patientName, doctorName, content });
        await prescription.save();

        res.status(201).json({ message: 'Prescription saved successfully', prescription });
    } catch (error) {
        console.error('Error saving prescription:', error);
        res.status(500).json({ message: 'Failed to save prescription' });
    }
};

// Fetch Prescriptions for Doctor
const getPrescriptionsForDoctor = async (req, res) => {
    try {
        const prescriptions = await Prescription.find({ doctorName: req.user.fullName });
        res.status(200).json(prescriptions);
    } catch (error) {
        console.error('Error fetching prescriptions:', error);
        res.status(500).json({ message: 'Failed to fetch prescriptions' });
    }
};

module.exports = {
    getDoctorProfile,
    updateDoctorProfile,
    changePassword,
    savePrescription,
    getPrescriptionsForDoctor,
};