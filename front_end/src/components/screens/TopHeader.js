import React, { useState, useEffect } from "react";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Avatar from "@mui/material/Avatar";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LockResetIcon from "@mui/icons-material/LockReset";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import Modal from "@mui/material/Modal";
import { TextField, Button, IconButton, InputAdornment } from "@mui/material";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";

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
  const [showAddAdminModal, setShowAddAdminModal] = useState(false);

  const [resetData, setResetData] = useState({
    newPassword: "",
    confirmPassword: "",
    showPassword: false,
    isValidPassword: true,
    passwordMatch: true,
  });

  const [adminData, setAdminData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    contactNo: "",
    newPassword: "",
    confirmPassword: "",
    showPassword: false,
    isValidFirstName: true,
    isValidLastName: true,
    isValidEmail: true,
    isValidContactNo: true,
    isValidPassword: true,
    passwordMatch: true,
  });

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
      await AsyncStorage.removeItem("sessionTimestamp");

      setSnackbar({
        open: true,
        message: "You have successfully logged out.",
        severity: "success",
      });

      setTimeout(() => {
        onSignOut();
      }, 2500);
    } catch (error) {
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

  // Reset Password Modal Logic
  const handlePasswordModalOpen = () => {
    setResetData({
      newPassword: "",
      confirmPassword: "",
      showPassword: false,
      isValidPassword: true,
      passwordMatch: true,
    });
    setShowPasswordModal(true);
  };

  const handlePasswordChange = (event) => {
    const newPassword = event.target.value;
    setResetData({
      ...resetData,
      newPassword,
      isValidPassword: newPassword.length >= 6,
      passwordMatch: newPassword === resetData.confirmPassword,
    });
  };

  const handleConfirmPasswordChange = (event) => {
    const confirmPassword = event.target.value;
    setResetData({
      ...resetData,
      confirmPassword,
      passwordMatch: confirmPassword === resetData.newPassword,
    });
  };

  const toggleShowPassword = () => {
    setResetData({ ...resetData, showPassword: !resetData.showPassword });
  };

  const handlePasswordReset = async () => {
    const isPasswordValid = resetData.newPassword.length >= 6;
    const matchPassword = resetData.newPassword === resetData.confirmPassword;

    // Update the state with the latest validation results
    setResetData({
      ...resetData,
      isValidPassword: isPasswordValid,
      passwordMatch: matchPassword,
    });

    if (!isPasswordValid) {
      setSnackbar({
        open: true,
        message: "Password must be at least 6 characters long.",
        severity: "error",
      });
      return;
    }

    if (!matchPassword) {
      setSnackbar({
        open: true,
        message:
          "Passwords do not match. Please ensure both passwords are identical.",
        severity: "error",
      });
      return;
    }

    // Proceed with password reset if validation passes
    if (isPasswordValid && matchPassword) {
      try {
        const result = await resetPassword(resetData.newPassword);
        if (result.success) {
          setSnackbar({
            open: true,
            message: "Password successfully reset!",
            severity: "success",
          });
          setShowPasswordModal(false);

          // Log out the user after password reset
          setTimeout(() => {
            handleLogout();
          }, 2500);
        } else {
          setSnackbar({
            open: true,
            message:
              result.message || "Failed to reset password. Please try again.",
            severity: "error",
          });
        }
      } catch (error) {
        // Handle any errors during the password reset process
        setSnackbar({
          open: true,
          message:
            "An error occurred during password reset. Please try again later.",
          severity: "error",
        });
        console.error("Password reset error:", error);
      }
    }
  };

  // Add Admin Modal Logic
  const handleAddAdminModalOpen = () => {
    setAdminData({
      firstName: "",
      lastName: "",
      email: "",
      contactNo: "",
      newPassword: "",
      confirmPassword: "",
      showPassword: false,
      isValidFirstName: true,
      isValidLastName: true,
      isValidEmail: true,
      isValidContactNo: true,
      isValidPassword: true,
      passwordMatch: true,
    });
    setShowAddAdminModal(true);
  };

  const handleAdminChange = (field, value) => {
    let update = { [field]: value };

    switch (field) {
      case "firstName":
        update.isValidFirstName = /^[a-zA-Z]+$/.test(value);
        break;
      case "lastName":
        update.isValidLastName = /^[a-zA-Z]+$/.test(value);
        break;
      case "email":
        update.isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        break;
      case "contactNo":
        update.isValidContactNo = /^\d{10}$/.test(value);
        break;
      case "newPassword":
        update.isValidPassword = value.length >= 6;
        update.passwordMatch = value === adminData.confirmPassword;
        break;
      case "confirmPassword":
        update.passwordMatch = value === adminData.newPassword;
        break;
      default:
        break;
    }

    setAdminData({ ...adminData, ...update });
  };

  const handleAdminFormSubmit = () => {
    const isFirstNameValid =
      /^[a-zA-Z]+$/.test(adminData.firstName) && adminData.firstName.length > 0;
    const isLastNameValid =
      /^[a-zA-Z]+$/.test(adminData.lastName) && adminData.lastName.length > 0;
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(adminData.email);
    const isContactNoValid = /^\d{10}$/.test(adminData.contactNo);
    const isPasswordValid = adminData.newPassword.length >= 6;
    const matchPassword = adminData.newPassword === adminData.confirmPassword;

    // Update the state with validation results
    setAdminData({
      ...adminData,
      isValidFirstName: isFirstNameValid,
      isValidLastName: isLastNameValid,
      isValidEmail: isEmailValid,
      isValidContactNo: isContactNoValid,
      isValidPassword: isPasswordValid,
      passwordMatch: matchPassword,
    });

    if (
      !isFirstNameValid &&
      !isLastNameValid &&
      !isEmailValid &&
      !isContactNoValid &&
      !isPasswordValid
    ) {
      setSnackbar({
        open: true,
        message: "Please fill in all the fields with valid information.",
        severity: "error",
      });
      return;
    }

    // Detailed validation error messages
    if (!isFirstNameValid) {
      setSnackbar({
        open: true,
        message: "First name must contain only letters and cannot be empty.",
        severity: "error",
      });
      return;
    }

    if (!isLastNameValid) {
      setSnackbar({
        open: true,
        message: "Last name must contain only letters and cannot be empty.",
        severity: "error",
      });
      return;
    }

    if (!isEmailValid) {
      setSnackbar({
        open: true,
        message: "Please enter a valid email address.",
        severity: "error",
      });
      return;
    }

    if (!isContactNoValid) {
      setSnackbar({
        open: true,
        message: "Contact number must be 10 digits long.",
        severity: "error",
      });
      return;
    }

    if (!isPasswordValid) {
      setSnackbar({
        open: true,
        message: "Password must be at least 6 characters long.",
        severity: "error",
      });
      return;
    }

    if (!matchPassword) {
      setSnackbar({
        open: true,
        message:
          "Passwords do not match. Please ensure both passwords are identical.",
        severity: "error",
      });
      return;
    }

    // Proceed with admin creation if all validations pass
    try {
      // Simulating API call or further logic
      setSnackbar({
        open: true,
        message: "Admin added successfully!",
        severity: "success",
      });
      setShowAddAdminModal(false);
    } catch (error) {
      setSnackbar({
        open: true,
        message: "An error occurred while adding the admin. Please try again.",
        severity: "error",
      });
    }
  };

  return (
    <>
      <header className="header">
        <div className="header-right">
          <div className="header-notification" onClick={handleProfileClick}>
            <NotificationsIcon className="notification-icon" />
          </div>
          <div className="header-profile" onClick={handleProfileClick}>
            <span className="header-name">Hi {userName}!</span>
            <Avatar src={userAvatar} className="profile-avatar" />
            {showDropdown && (
              <div className="dropdown-menu">
                <div
                  className="dropdown-item"
                  onClick={() => alert("Profile clicked")}
                >
                  <AccountCircleIcon className="dropdown-icon" />
                  <span>Profile</span>
                </div>
                <div
                  className="dropdown-item"
                  onClick={handlePasswordModalOpen}
                >
                  <LockResetIcon className="dropdown-icon" />
                  <span>Reset password</span>
                </div>
                <div
                  className="dropdown-item"
                  onClick={handleAddAdminModalOpen}
                >
                  <PersonAddIcon className="dropdown-icon" />
                  <span>Add Admin</span>
                </div>
                <div className="dropdown-item" onClick={handleLogout}>
                  <ExitToAppIcon className="dropdown-icon" />
                  <span>Logout</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Password Reset Modal */}
      <Modal open={showPasswordModal}>
        <div className="reset-password-modal">
          <h2 className="modal-title">Reset Password</h2>
          <div className="input-container">
            <TextField
              label="New Password"
              type={resetData.showPassword ? "text" : "password"}
              value={resetData.newPassword}
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
                      {resetData.showPassword ? <FaEye /> : <FaEyeSlash />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            {!resetData.isValidPassword && (
              <div className="helpertext" style={{ color: "red",fontSize: "12px" }}>
                Password must be at least 6 characters long.
              </div>
            )}
          </div>

          <div className="input-container">
            <TextField
              label="Confirm Password"
              type={resetData.showPassword ? "text" : "password"}
              value={resetData.confirmPassword}
              onChange={handleConfirmPasswordChange}
              fullWidth
              margin="normal"
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockResetIcon />
                  </InputAdornment>
                ),
              }}
            />
            {!resetData.passwordMatch && (
              <div className="helpertext" style={{ color: "red",fontSize: "12px" }}>
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
              className="modal-button"
              color="error"
              onClick={() => setShowPasswordModal(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>

      {/* Add Admin Modal */}
      <Modal open={showAddAdminModal}>
        <div className="add-admin-modal">
          <h2 className="modal-title">Add New Admin</h2>
          <div className="input_raw_cloumn">
            <div className="input-container">
              <TextField
                label="First Name"
                value={adminData.firstName}
                onChange={(e) => handleAdminChange("firstName", e.target.value)}
                fullWidth
                margin="normal"
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon />
                    </InputAdornment>
                  ),
                }}
              />
              {!adminData.isValidFirstName && (
                <div className="helpertext" style={{ color: "red",fontSize: "12px" }}>
                  First name must contain only letters.
                </div>
              )}
            </div>

            <div className="input-container">
              <TextField
                label="Last Name"
                value={adminData.lastName}
                onChange={(e) => handleAdminChange("lastName", e.target.value)}
                fullWidth
                margin="normal"
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon />
                    </InputAdornment>
                  ),
                }}
              />
              {!adminData.isValidLastName && (
                <div className="helpertext" style={{ color: "red",fontSize: "12px" }}>
                  Last name must contain only letters.
                </div>
              )}
            </div>
          </div>

          <div className="input_raw_cloumn">
            <div className="input-container">
              <TextField
                label="Email"
                value={adminData.email}
                onChange={(e) => handleAdminChange("email", e.target.value)}
                fullWidth
                margin="normal"
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon />
                    </InputAdornment>
                  ),
                  // endAdornment: adminData.isValidEmail ? (
                  //   <InputAdornment position="end">
                  //     <span style={{ color: "green" }}>✔</span>
                  //   </InputAdornment>
                  // ) : null,
                }}
              />
              {!adminData.isValidEmail && (
                <div className="helpertext" style={{ color: "red",fontSize: "12px" }}>
                  Invalid email format.
                </div>
              )}
            </div>

            <div className="input-container">
              <TextField
                label="Contact No."
                value={adminData.contactNo}
                onChange={(e) => handleAdminChange("contactNo", e.target.value)}
                fullWidth
                margin="normal"
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PhoneIcon />
                    </InputAdornment>
                  ),
                }}
              />
              {!adminData.isValidContactNo && (
                <div className="helpertext" style={{ color: "red",fontSize: "12px" }}>
                  Contact number must be 10 digits.
                </div>
              )}
            </div>
          </div>

          <div className="input_raw_cloumn">
            <div className="input-container">
              <TextField
                label="New Password"
                type={adminData.showPassword ? "text" : "password"}
                value={adminData.newPassword}
                onChange={(e) =>
                  handleAdminChange("newPassword", e.target.value)
                }
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
                      <IconButton
                        onClick={() =>
                          handleAdminChange(
                            "showPassword",
                            !adminData.showPassword
                          )
                        }
                      >
                        {adminData.showPassword ? <FaEye /> : <FaEyeSlash />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              {!adminData.isValidPassword && (
                <div className="helpertext" style={{ color: "red",fontSize: "12px" }}>
                  Password must be at least 6 characters long.
                </div>
              )}
            </div>

            <div className="input-container">
              <TextField
                label="Confirm Password"
                type={adminData.showPassword ? "text" : "password"}
                value={adminData.confirmPassword}
                onChange={(e) =>
                  handleAdminChange("confirmPassword", e.target.value)
                }
                fullWidth
                margin="normal"
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockResetIcon />
                    </InputAdornment>
                  ),
                }}
              />
              {!adminData.passwordMatch && (
                <div className="helpertext" style={{ color: "red",fontSize: "12px" }}>
                  Passwords do not match.
                </div>
              )}
            </div>
          </div>
          <div className="button-group">
            <Button
              variant="contained"
              color="primary"
              onClick={handleAdminFormSubmit}
              className="modal-button"
            >
              Add Admin
            </Button>
            <Button
              className="modal-button"
              variant="outlined"
              color="error"
              onClick={() => setShowAddAdminModal(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>

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
    </>
  );
};

export default TopHeader;
