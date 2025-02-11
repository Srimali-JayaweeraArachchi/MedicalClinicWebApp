const Bill = require("../models/Bill");

// Save bill details
const saveBillDetails = async (req, res) => {
  try{
  const { patientName, doctorFee, reportFee, clinicFee } = req.body;

  // Validate input data
  if (!patientName || doctorFee == null || reportFee == null || clinicFee == null) {
    return res.status(400).json({ message: "All fields are required" });
  }

    // Calculate total fee
    const totalFee = parseFloat(doctorFee) + parseFloat(reportFee) + parseFloat(clinicFee);

    // Create a new bill record
    const newBill = new Bill({
      patientName,
      doctorFee,
      reportFee,
      clinicFee,
      totalFee,
    });

    // Save the bill to the database
    await newBill.save();
    res.status(201).json({ message: "Bill saved successfully", bill: newBill });
  } catch (error) {
    console.error("Error saving bill:", error.message);
    res.status(500).json({ message: "Error saving bill", error: error.message });
  }
};

module.exports = { saveBillDetails };
