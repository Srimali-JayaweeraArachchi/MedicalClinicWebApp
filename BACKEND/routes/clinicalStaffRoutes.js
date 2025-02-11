const express = require('express');
const router = express.Router();
const { getPatients } = require('../controllers/clinicalStaffController');
const clinicalSettingsController = require('../controllers/clinicalSettingsController');
const authenticateToken = require('../middleware/authenticateToken');

// Define the route for fetching patients
router.get('/patients', getPatients);

// Route to get clinical staff details
router.get('/details', authenticateToken, clinicalSettingsController.getClinicalStaffDetails);

// Route to update clinical staff details
router.put('/update', authenticateToken, clinicalSettingsController.updateClinicalStaffDetails);

module.exports = router;
