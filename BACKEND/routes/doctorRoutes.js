const express = require('express');
const authMiddleware = require('../middleware/authMiddleware.js');
const checkDoctorRole = require('../middleware/checkDoctorRole.js');
const {
    getDoctorProfile,
    updateDoctorProfile,
    changePassword,
    savePrescription,
    getPrescriptionsForDoctor,
} = require('../controllers/doctorController.js');

const router = express.Router();

// Doctor Profile Routes
router.get('/doctors/profile', authMiddleware(['Doctor']), checkDoctorRole, getDoctorProfile);
router.put('/doctors/update-profile', authMiddleware(['Doctor']), checkDoctorRole, updateDoctorProfile);
router.put('/doctors/change-password', authMiddleware(['Doctor']), checkDoctorRole, changePassword);

// Prescription Routes
router.post('/doctors/prescriptions', authMiddleware(['Doctor']), checkDoctorRole, savePrescription);
router.get('/doctors/prescriptions', authMiddleware(['Doctor']), checkDoctorRole, getPrescriptionsForDoctor);

module.exports = router;