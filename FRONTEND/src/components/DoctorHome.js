import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import '../styles/DoctorHome.css';
import doctorPhoto from '../assets/doctorphoto.jpeg';


function DoctorHome() {
  const navigate = useNavigate();

  // State for dashboard data
  const [dashboardData, setDashboardData] = useState({
    totalAppointments: 0,
    totalPatients: 0,
    totalReports: 0,
  });
  const [doctorName, setDoctorName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // API base URL
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8070';

  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/'); // Redirect to login if no token
        return;
      }

      try {
        // Decode the JWT token to get the doctor's name
        const tokenPayload = JSON.parse(atob(token.split('.')[1])); // Decode the token
        setDoctorName(tokenPayload.name);

        // Fetch dashboard data
        const response = await fetch(`${API_BASE_URL}/api/doctor/dashboard`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          if (response.status === 401) {
            setError('Session expired. Please log in again.');
            localStorage.removeItem('token');
            navigate('/');
          } else {
            throw new Error('Failed to fetch dashboard data');
          }
        } else {
          const data = await response.json();
          setDashboardData(data);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError('Failed to load dashboard data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate, API_BASE_URL]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="doctor-home-container">
      {/* Sidebar Section */}
      <div className="sidebar">
        <div className="doctor-photo">
          <img src={doctorPhoto} alt="Doctor" />
        </div>
        <h2>CarePlus</h2>
        <ul>
  <li>
    <NavLink
      to="/doctor-home"
      className={({ isActive }) => (isActive ? 'active' : '')}
    >
      Dashboard
    </NavLink>
  </li>
  <li>
    <NavLink
      to="/appointments"
      className={({ isActive }) => (isActive ? 'active' : '')}
    >
      Appointments
    </NavLink>
  </li>
  <li>
    <NavLink
      to="/patients"
      className={({ isActive }) => (isActive ? 'active' : '')}
    >
      Patients
    </NavLink>
  </li>
  <li>
    <NavLink
      to="/reports"
      className={({ isActive }) => (isActive ? 'active' : '')}
    >
      Reports
    </NavLink>
  </li>
  <li>
    <NavLink
      to="/prescriptions"
      className={({ isActive }) => (isActive ? 'active' : '')}
    >
      Prescriptions
    </NavLink>
  </li>
  <li>
    <NavLink
      to="/settings"
      className={({ isActive }) => (isActive ? 'active' : '')}
    >
      Settings
    </NavLink>
  </li>
  <li onClick={handleLogout}>Logout</li>
</ul>

      </div>

      {/* Dashboard Content */}
      <div className="dashboard-content">
        <h1>Welcome, Dr. {doctorName || 'Doctor'}</h1>
        <p>Today is {today}</p>
        {loading ? (
          <div className="loading">Loading...</div>
        ) : error ? (
          <div>
            <p className="error">{error}</p>
            <button onClick={() => window.location.reload()}>Retry</button>
          </div>
        ) : (
          <div className="dashboard-stats">
            <div className="stat-box">
              <span>{dashboardData.totalAppointments}</span>
              <p>Total Appointments</p>
            </div>
            <div className="stat-box">
              <span>{dashboardData.totalPatients}</span>
              <p>Total Patients</p>
            </div>
            <div className="stat-box">
              <span>{dashboardData.totalReports}</span>
              <p>Total Reports</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default DoctorHome;
