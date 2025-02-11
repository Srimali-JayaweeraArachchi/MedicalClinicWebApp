import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import DoctorHome from "./components/DoctorHome";
import ClinicalHome from "./components/ClinicalHome";
import AdminHome from "./components/AdminHome";
import Appointments from "./components/Appointments";
import Settings from "./components/Settings";
import Prescriptions from "./components/Prescriptions";
import Dashboard from "./components/Dashboard";
import ClinicalSetting from './components/ClinicalSetting'; // Import the ClinicalSetting component

const decodeToken = (token) => {
  try {
    const base64Payload = token.split(".")[1];
    const decodedPayload = atob(base64Payload);
    return JSON.parse(decodedPayload);
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  if (!token) return false;

  const decodedToken = decodeToken(token);
  if (!decodedToken) return false;

  const currentTime = Math.floor(Date.now() / 1000);
  return decodedToken.exp && decodedToken.exp > currentTime;
};

const ProtectedRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/" />;
};

function App() {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Doctor Routes */}
        <Route
          path="/doctor-home"
          element={
            <ProtectedRoute>
              <DoctorHome />
            </ProtectedRoute>
          }
        />
        <Route
          path="/appointments"
          element={
            <ProtectedRoute>
              <Appointments />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/prescriptions"
          element={
            <ProtectedRoute>
              <Prescriptions />
            </ProtectedRoute>
          }
        />
  

        {/* Clinical Staff Routes */}
        <Route
          path="/clinical-home"
          element={
            <ProtectedRoute>
              <ClinicalHome />
            </ProtectedRoute>
          }
        />
        <Route
          path="/clinical-settings"
          element={
            <ProtectedRoute>
              <ClinicalSetting />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin-home"
          element={
            <ProtectedRoute>
              <AdminHome />
            </ProtectedRoute>
          }
        />

        {/* Catch-All Route for 404 */}
        <Route
          path="*"
          element={
            <div style={{ textAlign: "center", marginTop: "50px" }}>
              <h1>404: Page Not Found</h1>
              <p>The page you are looking for does not exist.</p>
              <button
                onClick={() => (window.location.href = "/")}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#007BFF",
                  color: "#fff",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                Go to Home
              </button>
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;














