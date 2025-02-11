import React, { useState } from "react";
import axios from "axios";

const Bill = ({ selectedPatient }) => {
  const [doctorFee, setDoctorFee] = useState("");
  const [reportFee, setReportFee] = useState("");
  const [clinicFee, setClinicFee] = useState("");
  const [message, setMessage] = useState("");

  const handleSaveBill = async () => {
    if (!selectedPatient) {
      setMessage("Please select a patient");
      return;
    }

    if (!doctorFee || !reportFee || !clinicFee) {
      setMessage("Please fill all the fee fields");
      return;
    }

    try {
      const totalFee =
        parseFloat(doctorFee) + parseFloat(reportFee) + parseFloat(clinicFee);

      const billData = {
        patientName: selectedPatient,
        doctorFee: parseFloat(doctorFee),
        reportFee: parseFloat(reportFee),
        clinicFee: parseFloat(clinicFee),
        totalFee: totalFee,
      };

      // Send the bill data to the backend
      const response = await axios.post(
        "http://localhost:8070/api/bills/save-bill",
        billData
      );

      if (response.status === 201) {
        setMessage("Bill saved successfully!");
        setDoctorFee("");
        setReportFee("");
        setClinicFee("");
      } else {
        setMessage("Error saving the bill. Please try again.");
      }
    } catch (error) {
      console.error("Error saving bill:", error.message);
      setMessage("Error saving the bill. Please try again.");
    }
  };

  return (
    <div className="fee-details">
      <h3>{selectedPatient || "No patient selected"}</h3>

      <div className="fee-info">
        <div>
          <label>Doctor Fee:</label>
          <input
            type="number"
            value={doctorFee}
            onChange={(e) => setDoctorFee(e.target.value)}
          />
        </div>
        <div>
          <label>Report Fee:</label>
          <input
            type="number"
            value={reportFee}
            onChange={(e) => setReportFee(e.target.value)}
          />
        </div>
        <div>
          <label>Clinic Fee:</label>
          <input
            type="number"
            value={clinicFee}
            onChange={(e) => setClinicFee(e.target.value)}
          />
        </div>
        <button onClick={handleSaveBill}>Save</button>
      </div>

      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default Bill;
