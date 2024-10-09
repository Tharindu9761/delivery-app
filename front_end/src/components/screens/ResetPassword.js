import React, { useState, useEffect, useCallback } from "react";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "../styles/frogotPassword.css";
import { resetPasswordByEmail } from "../../services/userService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LoadingSpinner from "./LoadingSpinner";

const ResetPassword = ({ onSignOut }) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    showPassword: false,
    isValidUser: true,
    isPasswordValid: true,
    passwordMatch: true,
    check_email_Change: false,
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const navigate = useNavigate();
  const location = useLocation();

  // Wrap onSignOut in useCallback to prevent unnecessary re-renders
  const stableOnSignOut = useCallback(() => {
    if (onSignOut) {
      onSignOut();
    }
  }, [onSignOut]);

  // Use Effect to decode the token
  useEffect(() => {
    const cleanUpAsyncStorage = async () => {
      await AsyncStorage.removeItem("Token");
      await AsyncStorage.removeItem("Key");
      await AsyncStorage.removeItem("sessionTimestamp");

      stableOnSignOut();
    };

    cleanUpAsyncStorage();

    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get("token");

    if (token) {
      try {
        const decoded = jwtDecode(token);
        const { email, exp } = decoded;

        // Check if token is expired
        const currentTime = Date.now() / 1000;
        if (exp < currentTime) {
          setSnackbar({
            open: true,
            message: "The reset token has expired. Please request a new one.",
            severity: "error",
          });
          setLoading(true);
          setTimeout(() => {
            setLoading(false);
            navigate("/forgot-password");
          }, 2500);
          return;
        }

        // Set email and disable the field
        setData((prevData) => ({
          ...prevData,
          email: email,
          isValidUser: true,
          check_email_Change: true,
        }));
      } catch (error) {
        setSnackbar({
          open: true,
          message: "Invalid token. Please request a new reset link.",
          severity: "error",
        });
        setLoading(true);
        setTimeout(() => {
          setLoading(false);
          navigate("/forgot-password");
        }, 2500);
      }
    }
  }, [location.search, navigate, stableOnSignOut]);

  // Handle New Password Input Change
  const handleNewPasswordChange = (val) => {
    const isPasswordValid = val.length >= 6;
    setData({
      ...data,
      password: val,
      isPasswordValid: isPasswordValid,
      passwordMatch: val === data.confirmPassword,
    });
  };

  // Handle Confirm Password Input Change
  const handleConfirmPasswordChange = (val) => {
    setData({
      ...data,
      confirmPassword: val,
      passwordMatch: val === data.password,
    });
  };

  // Toggle Password Visibility
  const togglePasswordVisibility = () => {
    setData({
      ...data,
      showPassword: !data.showPassword,
    });
  };

  // Handle Password Reset
  const handlePasswordReset = async () => {
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email);
    const isPasswordValid = data.password.length >= 6;
    const matchPassword = data.password === data.confirmPassword;

    // Update validation state
    setData({
      ...data,
      isPasswordValid: isPasswordValid,
      passwordMatch: matchPassword,
      isValidUser: isEmailValid,
    });

    if (!isEmailValid || !isPasswordValid || !matchPassword) {
      setSnackbar({
        open: true,
        message: "Please fill in all the required fields correctly.",
        severity: "error",
      });
      return;
    }

    setLoading(true);
    // Proceed to reset password if all validations are passed
    try {
      const response = await resetPasswordByEmail(data.email, data.password);

      setSnackbar({
        open: true,
        message: response.message,
        severity: response.success ? "success" : "error",
      });

      if (response.success) {
        // Reset form fields after a successful reset
        setData({
          email: "",
          password: "",
          confirmPassword: "",
          showPassword: false,
          isValidUser: true,
          isPasswordValid: true,
          passwordMatch: true,
        });

        // Redirect to sign-in after successful password reset
        setTimeout(() => {
          setLoading(false);
          navigate("/signin");
        }, 2500);
      }
    } catch (error) {
      setLoading(false);
      setSnackbar({
        open: true,
        message: "An unexpected error occurred. Please try again.",
        severity: "error",
      });
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
        <h2>Reset Password</h2>

        {/* Email Input */}
        <div className="input-container">
          <TextField
            label="Email"
            type="email"
            fullWidth
            value={data.email}
            disabled
            margin="normal"
            variant="outlined"
            className="custom-textfield"
            error={!data.isValidUser}
            helperText={!data.isValidUser ? "Invalid email address." : ""}
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

        {/* New Password Input */}
        <div className="input-container">
          <TextField
            label="New Password"
            type={data.showPassword ? "text" : "password"}
            fullWidth
            value={data.password}
            onChange={(e) => handleNewPasswordChange(e.target.value)}
            margin="normal"
            variant="outlined"
            className="custom-textfield"
            error={!data.isPasswordValid}
            required
            helperText={
              !data.isPasswordValid
                ? "Password must be at least 6 characters long."
                : ""
            }
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FaLock />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={togglePasswordVisibility}>
                    {data.showPassword ? <FaEye /> : <FaEyeSlash />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </div>

        {/* Confirm Password Input */}
        <div className="input-container">
          <TextField
            label="Confirm Password"
            type={data.showPassword ? "text" : "password"}
            fullWidth
            value={data.confirmPassword}
            onChange={(e) => handleConfirmPasswordChange(e.target.value)}
            margin="normal"
            variant="outlined"
            className="custom-textfield"
            error={!data.passwordMatch}
            helperText={!data.passwordMatch ? "Passwords do not match." : ""}
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FaLock />
                </InputAdornment>
              ),
            }}
          />
        </div>

        <div className="button-group">
          {/* Reset Button */}
          <button
            className="forgot-password-button"
            onClick={handlePasswordReset}
          >
            Reset
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

export default ResetPassword;
