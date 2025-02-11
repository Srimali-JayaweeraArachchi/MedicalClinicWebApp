import React from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/Sidebar.css';

const Sidebar = () => {
  const sidebarLinks = [
    { path: '/doctor-home', label: 'Dashboard' },
    { path: '/appointments', label: 'Appointments' },
    { path: '/patients', label: 'Patients' },
    { path: '/reports', label: 'Reports' },
    { path: '/prescriptions', label: 'Prescriptions' },
    { path: '/settings', label: 'Settings' },
  ];

  return (
    <div className="sidebar">
      <ul>
        {sidebarLinks.map((link) => (
          <li key={link.path}>
            <NavLink
              to={link.path}
              end
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              {link.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;