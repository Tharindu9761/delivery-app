import React, { useState, useEffect } from "react";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Avatar from "@mui/material/Avatar";

import { get_name, get_pic } from "../../services/userService";

import "../styles/topHeader.css";

const TopHeader = ({ onSignOut }) => {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [userName, setUserName] = useState("");
  const [userAvatar, setUserAvatar] = useState(""); // State to hold the avatar URL

  useEffect(() => {
    const fetchUserData = async () => {
      const name = await get_name();
      const avatarUrl = await get_pic('thumb'); // Fetch the thumbnail picture

      if (name) {
        setUserName(name);
      }

      if (avatarUrl) {
        setUserAvatar(avatarUrl);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("Token");
      await AsyncStorage.removeItem("Key");

      setSnackbar({
        open: true,
        message: "You have successfully logged out.",
        severity: "success",
      });

      setTimeout(() => {
        onSignOut(); // Call the sign-out function passed as a prop
      }, 2500);
    } catch (error) {
      console.error("Error during logout:", error);
      setSnackbar({
        open: true,
        message: "An error occurred during logout. Please try again.",
        severity: "error",
      });
    }
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  const [showDropdown, setShowDropdown] = useState(true);

  const handleProfileClick = () => {
    setShowDropdown(!showDropdown);
  };

  const handleNotificationClick = () => {
    alert("Notifications clicked!");
  };

  const handleProfile = () => {
    alert("Navigate to Profile!");
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
          <span className="header-name">Hi {userName} !</span>
          <Avatar src={userAvatar} className="profile-avatar" />
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
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={snackbar.open}
        autoHideDuration={2500}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </header>
  );
};

export default TopHeader;