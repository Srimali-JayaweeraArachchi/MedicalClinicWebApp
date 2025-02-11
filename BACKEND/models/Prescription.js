const mongoose = require('mongoose');

const PrescriptionSchema = new mongoose.Schema({
  doctorName: { type: String, required: true },
  patientName: { type: String, required: true },
  content: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

const Prescription = mongoose.model('Prescription', PrescriptionSchema);
module.exports = Prescription;
