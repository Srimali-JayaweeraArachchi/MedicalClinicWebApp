const express = require("express");
const router = express.Router();
const Patient = require("../models/Patient"); // Import the Patient model
const authenticateToken = require("../middleware/authenticateToken"); // Import middleware for token authentication

// Get all patients with their bill details
router.get("/patients", authenticateToken, async (req, res) => {
  try {
    const patients = await Patient.find(); // Fetch all patients from the database
    const patientsWithFees = patients.map((patient) => ({
      _id: patient._id,
      name: patient.name,
      doctorFee: patient.doctorFee || 0, // Assuming doctorFee is a field in the Patient schema
      reportFee: patient.reportFee || 0,
      clinicFee: patient.clinicFee || 0,
      totalFee: (patient.doctorFee || 0) + (patient.reportFee || 0) + (patient.clinicFee || 0), // Calculate total fee
    }));
    res.json(patientsWithFees);
  } catch (error) {
    console.error("Error fetching patients:", error);
    res.status(500).json({ error: "Failed to fetch patients." });
  }
});

module.exports = router;
