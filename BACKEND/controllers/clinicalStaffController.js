const Patient = require('../models/Patient');

const getPatients = async (req, res) => {
  try {
    const patients = await Patient.find(); // Fetch all patients
    res.status(200).json(patients); // Send response
  } catch (error) {
    console.error('Error fetching patients:', error);
    res.status(500).json({ error: 'Failed to fetch patients' });
  }
};

module.exports = { getPatients };
