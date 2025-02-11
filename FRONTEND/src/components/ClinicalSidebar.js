import React from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import "../styles/ClinicalSidebar.css";
import OIP from "../assets/OIP.jpg";

const ClinicalSidebar = () => {
  const navigate = useNavigate();
  const sidebarLinks = [
    { path: "/clinical-home", label: "Bill" }, // Corrected the path for the "Bill" button
    { path: "/report", label: "Report" },
    { path: "/clinical-settings", label: "Settings" }, // Clinical staff's settings
  ];

  const location = useLocation(); // To determine the active route
  

  const handleLogout = () => {
    //localStorage.removeItem("token"); // Remove token to log out
    navigate("/"); // Redirect to login page
  };

  return (
    <div className="clinical-sidebar">
            {/* Sidebar Top Section */}
            <div className="sidebar-header">
        <img src={OIP} alt="Logo" className="sidebar-logo" />
        <div className="sidebar-title">CarePlus</div>
      </div>

      {/* Sidebar Links */}
      <div className="sidebar-content">
      <ul className="clinical-sidebar-links">
        {sidebarLinks.map((link) => (
          <li key={link.path} className="clinical-sidebar-item">
            <NavLink
              to={link.path}
              className={`clinical-sidebar-link ${
                location.pathname === link.path ? "active" : ""
              }`}
            >
              {link.label}
            </NavLink>
          </li>
        ))}
        </ul>
          <button className="logout-button" onClick={handleLogout}>
            Log Out
          </button>
        </div>
      </div>
  );
};

export default ClinicalSidebar;
