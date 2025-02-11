import "../styles/ClinicalHome.css";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ClinicalSidebar from "./ClinicalSidebar.js"; // Import the ClinicalSidebar component
import axios from "axios";
import Bill from "./Bill";

function ClinicalHome() {
  const navigate = useNavigate();

  // State for patient data
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]); // For search functionality
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [clinicalStaffName, setClinicalStaffName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [dashboardData, setDashboardData] = useState([]); // Add dashboardData state

  const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8070";

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/"); // Redirect to login if no token
          return;
        }
        const response = await fetch(`${API_BASE_URL}/api/clinicalstaff/patients`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error("Failed to fetch patients");
        const data = await response.json();
        setDashboardData(data);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchPatients = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/"); // Redirect to login if no token
        return;
      }

      try {
        // Decode the JWT token to get the clinical staff's name
        const tokenPayload = JSON.parse(atob(token.split(".")[1]));
        setClinicalStaffName(tokenPayload.name);

        // Fetch patients data
        const response = await fetch(`${API_BASE_URL}/api/clinicalstaff/patients`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          if (response.status === 401) {
            setError("Session expired. Please log in again.");
            localStorage.removeItem("token");
            navigate("/");
          } else {
            throw new Error("Failed to fetch patient data");
          }
        } else {
          const data = await response.json();
          setPatients(data);
          setFilteredPatients(data); // Initialize filtered patients
        }
      } catch (error) {
        console.error("Error fetching patient data:", error);
        setError("Failed to load patient data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
    fetchPatients(); // Call the function to fetch patients
  }, [navigate, API_BASE_URL]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const handlePatientClick = (patient) => {
    setSelectedPatient(patient);
  };

  const handleSearch = (e) => {
    const searchQuery = e.target.value.toLowerCase();

    // Filter patients by fullname or username
    const filtered = patients.filter((patient) =>
      (patient.fullname || patient.username)?.toLowerCase().includes(searchQuery)
    );
    setFilteredPatients(filtered);
  };

  return (
    <div className="clinical-home-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo">CarePlus</div>
        <ClinicalSidebar />
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="header">
          <div>Prescriptions</div>
          <div className="profile">{clinicalStaffName || "Clinical Staff"}</div>
        </header>

        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : (
          <div className="content">
            {/* Patient List */}
            <div className="patient-list">
              <h3>Total Patients: {patients.length}</h3>
              <input
                type="text"
                placeholder="Search patients..."
                onChange={handleSearch}
                className="search-bar"
                style={{ width: "600px" }}
              />
              <ul>
                {filteredPatients.map((patient) => (
                  <li
                    key={patient._id}
                    onClick={() => handlePatientClick(patient)}
                    style={{
                      backgroundColor:
                        selectedPatient?._id === patient._id ? "#cceeff" : "#fff",
                      cursor: "pointer",
                    }}
                  >
                    {/* Show fullname if available, otherwise show username */}
                    {patient.fullname || patient.username || "Unknown Patient"}
                  </li>
                ))}
              </ul>

              {/* See All Button */}
              <button
                className="see-all"
                onClick={() => setFilteredPatients(patients)} // Reset filteredPatients to show all
              >
                See All
              </button>
            </div>

            {/* Fee Details */}
            <div className="fee-details">
              {selectedPatient ? (
                <Bill selectedPatient={selectedPatient.fullname || selectedPatient.username} />
              ) : (
                <p>Select a patient to view and save fee details.</p>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default ClinicalHome;
