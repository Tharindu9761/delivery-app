import React, { useState, useEffect } from "react";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Avatar from "@mui/material/Avatar";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LockResetIcon from "@mui/icons-material/LockReset";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import Modal from "@mui/material/Modal";
import { TextField, Button, IconButton, InputAdornment } from "@mui/material";
import { FaEye, FaEyeSlash } from "react-icons/fa";

import { get_name, get_pic, resetPassword } from "../../services/userService";
import "../styles/topHeader.css";

const TopHeader = ({ onSignOut }) => {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [userName, setUserName] = useState("");
  const [userAvatar, setUserAvatar] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isValidPassword, setIsValidPassword] = useState(true);
  const [passwordMatch, setPasswordMatch] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      const name = await get_name();
      const avatarUrl = await get_pic("thumb");

      setUserName(name || "User");
      setUserAvatar(avatarUrl || "");
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
        onSignOut();
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

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  const handleProfileClick = () => {
    setShowDropdown(!showDropdown);
  };

  const handleNotificationClick = () => {
    alert("Notifications clicked!");
  };

  const handleProfile = () => {
    alert("Navigate to Profile!");
  };

  const handlePassword = () => {
    setShowPassword(false);
    setIsValidPassword(true);
    setPasswordMatch(true);
    setNewPassword("");
    setConfirmPassword("");
    setShowPasswordModal(true);
  };

  const handlePasswordChange = (event) => {
    const password = event.target.value;
    setNewPassword(password);
    setIsValidPassword(password.length >= 6);
    setPasswordMatch(password === confirmPassword);
  };

  const handleConfirmPasswordChange = (event) => {
    const confirmPassword = event.target.value;
    setConfirmPassword(confirmPassword);
    setPasswordMatch(confirmPassword === newPassword);
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handlePasswordReset = async () => {
    if (!passwordMatch) {
      setSnackbar({
        open: true,
        message: "Passwords do not match!",
        severity: "error",
      });
    } else if (!isValidPassword) {
      setSnackbar({
        open: true,
        message: "Password must be at least 6 characters long.",
        severity: "error",
      });
    } else {
      try {
        const result = await resetPassword(newPassword);
        if (result.success) {
          setSnackbar({
            open: true,
            message: "Password successfully reset!",
            severity: "success",
          });
          setShowPasswordModal(false);
          setTimeout(() => {
            handleLogout();
          }, 2500);
        } else {
          setSnackbar({
            open: true,
            message: result.message || "Failed to reset password.",
            severity: "error",
          });
        }
      } catch (error) {
        setSnackbar({
          open: true,
          message: "An error occurred during password reset.",
          severity: "error",
        });
      }
    }
  };

  return (
    <>
      <header className="header">
        <div className="header-right">
          <div
            className="header-notification"
            onClick={handleNotificationClick}
          >
            <NotificationsIcon className="notification-icon" />
          </div>
          <div className="header-profile" onClick={handleProfileClick}>
            <span className="header-name">Hi {userName}!</span>
            <Avatar src={userAvatar} className="profile-avatar" />
            {showDropdown && (
              <div className="dropdown-menu">
                <div className="dropdown-item" onClick={handleProfile}>
                  <AccountCircleIcon className="dropdown-icon" />
                  <span>Profile</span>
                </div>
                <div className="dropdown-item" onClick={handlePassword}>
                  <LockResetIcon className="dropdown-icon" />
                  <span>Reset password</span>
                </div>
                <div className="dropdown-item" onClick={handleLogout}>
                  <ExitToAppIcon className="dropdown-icon" />
                  <span>Logout</span>
                </div>
              </div>
            )}
          </div>
        </div>
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          open={snackbar.open}
          autoHideDuration={2500}
          onClose={handleCloseSnackbar}
        >
          <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </header>

      {/* Password Reset Modal */}
      <Modal
        open={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
      >
        <div className="reset-password-modal">
          <h2 className="modal-title">Reset Password</h2>
          <div className="input-container">
            <TextField
              label="New Password"
              type={showPassword ? "text" : "password"}
              value={newPassword}
              onChange={handlePasswordChange}
              fullWidth
              margin="normal"
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockResetIcon />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={toggleShowPassword}>
                      {showPassword ? <FaEye /> : <FaEyeSlash />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            {!isValidPassword && (
              <div style={{ color: "red", fontSize: "12px" }}>
                Password must be at least 6 characters long.
              </div>
            )}
          </div>
          <div className="input-container">
            <TextField
              label="Confirm Password"
              type={showPassword ? "text" : "password"}
              fullWidth
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              margin="normal"
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockResetIcon />
                  </InputAdornment>
                ),
                endAdornment:
                  passwordMatch && confirmPassword ? (
                    <InputAdornment position="end">
                      <span style={{ color: "green" }}>✔</span>
                    </InputAdornment>
                  ) : null,
              }}
            />
            {!passwordMatch && confirmPassword && (
              <div style={{ color: "red", fontSize: "12px" }}>
                Passwords do not match.
              </div>
            )}
          </div>
          <div className="button-group">
            <Button
              variant="contained"
              color="primary"
              onClick={handlePasswordReset}
              className="modal-button"
            >
              Confirm
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={() => setShowPasswordModal(false)}
              className="modal-button"
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default TopHeader;
