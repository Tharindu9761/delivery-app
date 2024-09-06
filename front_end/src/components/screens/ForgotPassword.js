import React, { useState } from "react";
import { FaEnvelope } from "react-icons/fa";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import { Link, useNavigate } from "react-router-dom";
import "../styles/frogotPassword.css";
import { sendResetLink } from "../../services/userService";

const ForgotPassword = () => {
  const [data, setData] = useState({
    email: "",
    isValidUser: true,
    check_email_Change: false,
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const navigate = useNavigate();

  // Handle Email Input Change
  const handleEmailChange = (val) => {
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
    setData({
      ...data,
      email: val,
      isValidUser: isValidEmail,
      check_email_Change: isValidEmail,
    });
  };

  // Handle Password Reset (Only sending email for reset link)
  const handlePasswordReset = async () => {
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email);

    // Update validation state
    setData({
      ...data,
      isValidUser: isEmailValid,
    });

    if (!isEmailValid) {
      setSnackbar({
        open: true,
        message: "Please enter a valid email address",
        severity: "error",
      });
      return;
    }

    // Proceed to send reset link if email validation is passed
    try {
      const response = await sendResetLink(data.email);

      setSnackbar({
        open: true,
        message: response.message,
        severity: response.success ? "success" : "error",
      });

      if (response.success) {
        // Reset form fields after a successful reset
        setData({
          email: "",
          isValidUser: true,
        });

        // Redirect to sign-in after successful reset link send
        setTimeout(() => {
          navigate("/signin");
        }, 2500);
      }
    } catch (error) {
      // Handle any errors during the process
      setSnackbar({
        open: true,
        message: "An unexpected error occurred. Please try again.",
        severity: "error",
      });
      console.error("Password reset error:", error);
    }
  };

  // Handle Snackbar Close
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-box">
        <h2>Forgot Password</h2>

        <div className="input-container">
          <TextField
            label="Email"
            type="email"
            fullWidth
            value={data.email}
            onChange={(e) => handleEmailChange(e.target.value)}
            margin="normal"
            variant="outlined"
            className="custom-textfield"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FaEnvelope />
                </InputAdornment>
              ),
              endAdornment: data.check_email_Change ? (
                <InputAdornment position="end">
                  <span style={{ color: "green" }}>✔</span>
                </InputAdornment>
              ) : null,
            }}
          />
          {!data.isValidUser && (
            <div className="helpertext" style={{ color: "red",fontSize: "12px" }}>
              Invalid email address.
            </div>
          )}
        </div>

        {/* Reset Button */}
        <button
          className="forgot-password-button"
          onClick={handlePasswordReset}
        >
          Send Reset Link
        </button>

        {/* Sign In Link */}
        <p className="signin-link">
          Remembered your password? <Link to="/signin">Sign In</Link>
        </p>
      </div>

      {/* Snackbar */}
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
    </div>
  );
};

export default ForgotPassword;
