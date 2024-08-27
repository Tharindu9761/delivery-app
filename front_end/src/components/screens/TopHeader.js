import React, { useState } from "react";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import "../styles/topHeader.css";

const TopHeader = () => {
  // Set the initial state of showDropdown to true
  const [showDropdown, setShowDropdown] = useState(true);

  const handleProfileClick = () => {
    setShowDropdown(!showDropdown);
  };

  const handleNotificationClick = () => {
    alert("Notifications clicked!");
  };

  const handleLogout = () => {
    alert("Logged out!");
    // Add logout logic here
  };

  const handleProfile = () => {
    alert("Navigate to Profile!");
    // Add navigation logic here
  };

  return (
    <header className="header">
      <div className="header-left">
        <img src="/assets/logo.png" alt="Logo" className="logo" />
        <h1 className="header-title">Quick Drop</h1>
      </div>
      <div className="header-right">
        <div className="header-notification" onClick={handleNotificationClick}>
          <NotificationsIcon className="notification-icon" />
        </div>
        <div className="header-profile" onClick={handleProfileClick}>
          <span className="header-name">John Doe</span>
          <AccountCircleIcon className="profile-icon" />
          {showDropdown && (
            <div className="dropdown-menu">
              <div className="dropdown-item" onClick={handleProfile}>
                Profile
              </div>
              <div className="dropdown-item" onClick={handleLogout}>
                Logout
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default TopHeader;
