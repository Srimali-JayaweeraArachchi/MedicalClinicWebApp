const mongoose = require("mongoose");

const BillSchema = new mongoose.Schema({
  patientName: { type: String, required: true },
  doctorFee: { type: Number, required: true },
  reportFee: { type: Number, required: true },
  clinicFee: { type: Number, required: true },
  totalFee: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Bill", BillSchema);
