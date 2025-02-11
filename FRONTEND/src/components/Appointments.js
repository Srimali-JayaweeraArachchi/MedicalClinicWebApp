import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar'; // Import the Sidebar component
import '../styles/Appointments.css'; // Ensure the CSS matches your provided design

function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8070';

  useEffect(() => {
    const fetchAppointments = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/'); // Redirect to login if no token
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/api/appointments`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          if (response.status === 401) {
            setError('Session expired. Please log in again.');
            localStorage.removeItem('token');
            navigate('/');
          } else {
            throw new Error('Failed to fetch appointments');
          }
        } else {
          const data = await response.json();
          setAppointments(data);
        }
      } catch (err) {
        console.error('Error fetching appointments:', err);
        setError('Failed to load appointments. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [navigate, API_BASE_URL]);

  const handleRetry = () => {
    setError('');
    setLoading(true);
    setAppointments([]);
    fetchAppointments();
  };

  return (
    <div className="appointments-page-container">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="appointments-content">
        <h2>Today's Appointments</h2>
        <p>Total {appointments.length} appointments</p>
        {loading ? (
          <div className="loading">Loading...</div>
        ) : error ? (
          <div className="error-container">
            <p className="error-message">{error}</p>
            <button className="retry-button" onClick={handleRetry}>
              Retry
            </button>
          </div>
        ) : (
          <div className="appointments-container">
            {appointments.map((appointment) => (
              <div key={appointment.id} className="appointment-card">
                <div className="appointment-details">
                  <div className="appointment-avatar">
                    <div className="avatar-circle">
                      {appointment.name?.charAt(0).toUpperCase()}
                    </div>
                  </div>
                  <div>
                    <p className="appointment-name">{appointment.name}</p>
                    <p className="appointment-time">{appointment.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Appointments;