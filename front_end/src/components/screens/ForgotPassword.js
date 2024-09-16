import React, { useState } from "react";
import { FaEnvelope } from "react-icons/fa";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import { Link, useNavigate } from "react-router-dom";
import "../styles/frogotPassword.css";
import { sendResetLink } from "../../services/userService";
import LoadingSpinner from "./LoadingSpinner";

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
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

    setLoading(true);
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
          setLoading(false);
          navigate("/signin");
        }, 2500);
      } else {
        setLoading(false);
      }
    } catch (error) {
      // Handle any errors during the process
      setLoading(false);
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
            error={!data.isValidUser}
            helperText={!data.isValidUser ? "Invalid email address.." : ""}
            required
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
        </div>

        {/* Reset Button */}
        <div className="button-group">
          <button
            className="forgot-password-button"
            onClick={handlePasswordReset}
          >
            Send Reset Link
          </button>
        </div>

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
      <LoadingSpinner open={loading} />
    </div>
  );
};

export default ForgotPassword;
