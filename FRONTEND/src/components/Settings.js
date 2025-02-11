import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import '../styles/Settings.css';

function Settings() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    specialization: '',
    yearsOfExperience: '',
    availableDays: '',
    availableTimes: '',
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
  });

  const [message, setMessage] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [error, setError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/');
        return;
      }

      try {
        const response = await fetch('http://localhost:8070/doctors/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          const data = await response.json();
          setFormData({
            fullName: data.fullName || '',
            email: data.email || '',
            phoneNumber: data.phoneNumber || '',
            specialization: data.specialization || '',
            yearsOfExperience: data.yearsOfExperience || '',
            availableDays: data.availableDays || '',
            availableTimes: data.availableTimes || '',
          });
        } else {
          throw new Error('Failed to fetch profile');
        }
      } catch (error) {
        setError('Failed to load profile');
        console.error(error);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
      return;
    }

    try {
      const response = await fetch('http://localhost:8070/doctors/update-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        setMessage(data.message);
        setShowModal(true);
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (error) {
      setError('Profile update failed');
      console.error(error);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
      return;
    }

    try {
      const response = await fetch('http://localhost:8070/doctors/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(passwordData),
      });

      if (response.ok) {
        const data = await response.json();
        setPasswordMessage(data.message);
        setPasswordData({ oldPassword: '', newPassword: '' });
      } else {
        const errorData = await response.json();
        setPasswordError(errorData.message || 'Failed to change password');
      }
    } catch (error) {
      setPasswordError('An error occurred while changing the password');
      console.error(error);
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div className="settings-page-container">
      <Sidebar />
      <div className="settings-content">
        <h2>Settings</h2>
        <p>Update your profile information below</p>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Specialization</label>
            <input
              type="text"
              name="specialization"
              value={formData.specialization}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Years of Experience</label>
            <input
              type="number"
              name="yearsOfExperience"
              value={formData.yearsOfExperience}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Available Days</label>
            <input
              type="text"
              name="availableDays"
              value={formData.availableDays}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Available Times</label>
            <input
              type="text"
              name="availableTimes"
              value={formData.availableTimes}
              onChange={handleChange}
            />
          </div>
          <button type="submit" className="save-button">
            Save Changes
          </button>
        </form>

        <hr />

        <h3>Change Password</h3>
        {passwordError && <p className="error-message">{passwordError}</p>}
        {passwordMessage && <p className="success-message">{passwordMessage}</p>}
        <form onSubmit={handlePasswordSubmit}>
          <div className="form-group">
            <label>Old Password</label>
            <input
              type="password"
              name="oldPassword"
              value={passwordData.oldPassword}
              onChange={handlePasswordChange}
              required
            />
          </div>
          <div className="form-group">
            <label>New Password</label>
            <input
              type="password"
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              required
            />
          </div>
          <button type="submit" className="save-button">
            Change Password
          </button>
        </form>

        {showModal && (
          <div className="modal-overlay">
            <div className="modal">
              <h3>Profile updated successfully!</h3>
              <p>{message}</p>
              <button onClick={closeModal} className="close-modal-button">
                OK
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Settings;
