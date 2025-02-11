const e = require('express');
const mongoose = require('mongoose');
const User = require('../models/user');


const patientSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  address: { type: String, required: true },
  medicalHistory: { type: String },
  doctorFee: { type: Number, default: 0 },
  reportFee: { type: Number, default: 0 },
  clinicFee: { type: Number, default: 0 },
});


module.exports = mongoose.model("Patient", patientSchema);
