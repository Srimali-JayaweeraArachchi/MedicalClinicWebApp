const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Assuming User model stores doctor details
    required: true,
  },
  patientName: {
    type: String,
    required: true,
  },
  time: {
    type: String, // e.g., "04:00 PM"
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model("Appointment", appointmentSchema);
