import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/ClinicalSetting.css'; // Ensure this CSS file matches the style of the first image
import ClinicalSidebar from './ClinicalSidebar.js';
import axios from 'axios';


function ClinicalSetting() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
  });

  const [message, setMessage] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [error, setError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showModal, setShowModal] = useState(false); // State for modal visibility
  const navigate = useNavigate();

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8070';

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token"); // Retrieve the token from localStorage
      const response = await axios.get("http://localhost:8070/api/clinicalstaff/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Profile data:", response.data);
    } catch (error) {
      console.error("Failed to fetch profile data:", error);
    }
  };
  
  useEffect(() => {

    fetchProfile();
  }, [navigate, API_BASE_URL]);

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
      const response = await axios.put(
        `${API_BASE_URL}/api/clinicalstaff/update-profile`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(response.data.msg || 'Profile updated successfully');
      setShowModal(true); // Show modal
    } catch (err) {
      setError(err.response?.data?.message || 'Profile update failed');
      console.error(err);
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
      const response = await axios.put(
        `${API_BASE_URL}/api/clinicalstaff/change-password`,
        passwordData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPasswordMessage(response.data.message || 'Password changed successfully');
      setPasswordData({ oldPassword: '', newPassword: '' });
    } catch (err) {
      setPasswordError(err.response?.data?.message || 'Failed to change password');
      console.error(err);
    }
  };


  const closeModal = () => setShowModal(false); // Close the modal
  

  return (
    <div className="settings-page-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo">CarePlus</div>
        <ClinicalSidebar />
      </aside>
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

{/* Modal for Success Message */}
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





export default ClinicalSetting;
