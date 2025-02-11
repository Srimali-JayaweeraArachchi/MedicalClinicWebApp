import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import "../styles/Prescriptions.css";

const Prescriptions = () => {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [prescription, setPrescription] = useState('');

  // Fetch patients
  useEffect(() => {
    const fetchPatients = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await fetch('http://localhost:8070/api/doctor/patients', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        setPatients(data);
      } catch (error) {
        console.error('Error fetching patients:', error);
      }
    };

    fetchPatients();
  }, []);

  // Handle prescription submission
  const handleSubmit = async () => {
    const token = localStorage.getItem('token');
    const doctorName = localStorage.getItem('doctorName'); // Assume stored in token/session
    try {
      const response = await fetch('http://localhost:8070/api/doctor/prescriptions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          patientName: selectedPatient.fullName,
          doctorName,
          content: prescription,
        }),
      });

      if (response.ok) {
        alert('Prescription saved successfully');
        setPrescription('');
      } else {
        alert('Failed to save prescription');
      }
    } catch (error) {
      console.error('Error saving prescription:', error);
    }
  };

  return (
    <div className="prescriptions-page">
      <Sidebar />
      <div className="prescriptions-content">
        <h2>Prescriptions</h2>
        <h3>Total Patients: {patients.length}</h3>
        <div className="patients-list">
          {patients.map((patient) => (
            <div
              key={patient._id}
              className={`patient-item ${selectedPatient?._id === patient._id ? 'active' : ''}`}
              onClick={() => setSelectedPatient(patient)}
            >
              <img src={patient.photo || 'default-avatar.png'} alt="Avatar" />
              <p>{patient.fullName}</p>
            </div>
          ))}
        </div>
        {selectedPatient && (
          <div className="prescription-form">
            <h3>Write Prescription for {selectedPatient.fullName}</h3>
            <textarea
              placeholder="Enter prescription details..."
              value={prescription}
              onChange={(e) => setPrescription(e.target.value)}
            ></textarea>
            <button onClick={handleSubmit}>Submit Prescription</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Prescriptions;
