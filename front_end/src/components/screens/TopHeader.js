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

import {
  get_name,
  get_pic,
  resetPassword,
  createUser,
} from "../../services/userService";
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
    first_name: "",
    last_name: "",
    email: "",
    contact_no: "",
    newPassword: "",
    confirmPassword: "",
    user_type: "Admin",
    status:"Approved",
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

    if (!isPasswordValid || !matchPassword) {
      setSnackbar({
        open: true,
        message: "Please fill in all the fields with valid information.",
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
      first_name: "",
      last_name: "",
      email: "",
      contact_no: "",
      newPassword: "",
      confirmPassword: "",
      user_type: "Admin",
      status:"Approved",
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
      case "first_name":
        update.isValidFirstName = /^[a-zA-Z]+$/.test(value);
        break;
      case "last_name":
        update.isValidLastName = /^[a-zA-Z]+$/.test(value);
        break;
      case "email":
        update.isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        break;
      case "contact_no":
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

  const handleAdminFormSubmit = async () => {
    const isFirstNameValid =
      /^[a-zA-Z]+$/.test(adminData.first_name) &&
      adminData.first_name.length > 0;
    const isLastNameValid =
      /^[a-zA-Z]+$/.test(adminData.last_name) && adminData.last_name.length > 0;
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(adminData.email);
    const isContactNoValid = /^\d{10}$/.test(adminData.contact_no);
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
      user_type: "Admin",
      status:"Approved",
    });

    if (
      !isFirstNameValid ||
      !isLastNameValid ||
      !isEmailValid ||
      !isContactNoValid ||
      !isPasswordValid ||
      !matchPassword
    ) {
      setSnackbar({
        open: true,
        message: "Please fill in all the fields with valid information.",
        severity: "error",
      });
      return;
    }

    // Proceed with admin creation if all validations pass
    try {
      const result = await createUser(adminData);
      if (result.success) {
        setSnackbar({
          open: true,
          message: "Admin account created successfully!",
          severity: "success",
        });
        setShowAddAdminModal(false);
      } else {
        setSnackbar({
          open: true,
          message:
            result.message ||
            "Failed to create admin account. Please try again.",
          severity: "error",
        });
      }
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
              error={!resetData.isValidPassword}
              helperText={
                !resetData.isValidPassword
                  ? "Password must be at least 6 characters long."
                  : ""
              }
              required
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
              error={!resetData.passwordMatch}
              required
              helperText={
                !resetData.passwordMatch ? "Passwords do not match." : ""
              }
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockResetIcon />
                  </InputAdornment>
                ),
              }}
            />
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
          <div className="form-row">
            <div className="input-container modal-input">
              <TextField
                label="First Name"
                value={adminData.first_name}
                onChange={(e) =>
                  handleAdminChange("first_name", e.target.value)
                }
                fullWidth
                margin="normal"
                variant="outlined"
                error={!adminData.isValidFirstName}
                helperText={
                  !adminData.isValidFirstName
                    ? "First name is required and must contain only letters."
                    : ""
                }
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </div>

            <div className="input-container modal-input">
              <TextField
                label="Last Name"
                value={adminData.last_name}
                onChange={(e) => handleAdminChange("last_name", e.target.value)}
                fullWidth
                margin="normal"
                variant="outlined"
                error={!adminData.isValidLastName}
                helperText={
                  !adminData.isValidLastName
                    ? "Last name is required and must contain only letters."
                    : ""
                }
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="input-container modal-input">
              <TextField
                label="Email"
                value={adminData.email}
                onChange={(e) => handleAdminChange("email", e.target.value)}
                fullWidth
                margin="normal"
                variant="outlined"
                error={!adminData.isValidEmail}
                required
                helperText={
                  !adminData.isValidEmail
                    ? "A valid email address is required."
                    : ""
                }
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
            </div>

            <div className="input-container modal-input">
              <TextField
                label="Contact No."
                value={adminData.contact_no}
                onChange={(e) =>
                  handleAdminChange("contact_no", e.target.value)
                }
                fullWidth
                margin="normal"
                variant="outlined"
                error={!adminData.isValidContactNo}
                helperText={
                  !adminData.isValidContactNo
                    ? "Contact number must be 10 digits."
                    : ""
                }
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PhoneIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="input-container modal-input">
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
                error={!adminData.isValidPassword}
                helperText={
                  !adminData.isValidPassword
                    ? "Password must be at least 6 characters long."
                    : ""
                }
                required
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
            </div>
            <div className="input-container modal-input">
              <TextField
                className="modal-input"
                label="Confirm Password"
                type={adminData.showPassword ? "text" : "password"}
                value={adminData.confirmPassword}
                onChange={(e) =>
                  handleAdminChange("confirmPassword", e.target.value)
                }
                fullWidth
                margin="normal"
                variant="outlined"
                error={!adminData.passwordMatch}
                helperText={
                  !adminData.passwordMatch ? "Passwords do not match." : ""
                }
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockResetIcon />
                    </InputAdornment>
                  ),
                }}
              />
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
