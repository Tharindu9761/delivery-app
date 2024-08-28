import React, { useState } from "react";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import { Link, useNavigate } from "react-router-dom";
import "../styles/frogotPassword.css";
import { resetPasswordByEmail } from "../../services/userService";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isValidUser, setIsValidUser] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [isPasswordValid, setIsPasswordValid] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const navigate = useNavigate();

  const handleEmailChange = (val) => {
    const reg = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    setEmail(val);
    setIsValidUser(reg.test(val));
  };

  const handleNewPasswordChange = (val) => {
    setNewPassword(val);
    setIsPasswordValid(val.length >= 6);
    setPasswordMatch(val === confirmPassword);
  };

  const handleConfirmPasswordChange = (val) => {
    setConfirmPassword(val);
    setPasswordMatch(val === newPassword);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handlePasswordReset = async (event) => {
    event.preventDefault();

    if (!isValidUser) {
      setSnackbar({
        open: true,
        message: "Please enter a valid email address.",
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

    if (!passwordMatch) {
      setSnackbar({
        open: true,
        message: "Passwords do not match.",
        severity: "error",
      });
      return;
    }

    const response = await resetPasswordByEmail(newPassword);

    setSnackbar({
      open: true,
      message: response.message,
      severity: response.success ? "success" : "error",
    });

    if (response.success) {
      // Reset the form fields
      setEmail("");
      setNewPassword("");
      setConfirmPassword("");
      setIsValidUser(false);
      setPasswordMatch(true);
      setIsPasswordValid(true);
      setShowPassword(false);

      setTimeout(() => {
        navigate("/signin");
      }, 2500);
    }
  };

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
        <form onSubmit={handlePasswordReset}>
          <div className="input-container">
            <TextField
              label="Email"
              type="email"
              fullWidth
              value={email}
              onChange={(e) => handleEmailChange(e.target.value)}
              required
              margin="normal"
              variant="outlined"
              className="custom-textfield"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FaEnvelope />
                  </InputAdornment>
                ),
                endAdornment: isValidUser ? (
                  <InputAdornment position="end">
                    <span style={{ color: "green" }}>✔</span>
                  </InputAdornment>
                ) : null,
              }}
            />
            {!isValidUser && email && (
              <div style={{ color: "red", fontSize: "12px" }}>
                Invalid email address.
              </div>
            )}
          </div>

          <div className="input-container">
            <TextField
              label="New Password"
              type={showPassword ? "text" : "password"}
              fullWidth
              value={newPassword}
              onChange={(e) => handleNewPasswordChange(e.target.value)}
              required
              margin="normal"
              variant="outlined"
              className="custom-textfield"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FaLock />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={togglePasswordVisibility}>
                      {showPassword ? <FaEye /> : <FaEyeSlash />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            {!isPasswordValid && (
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
              onChange={(e) => handleConfirmPasswordChange(e.target.value)}
              required
              margin="normal"
              variant="outlined"
              className="custom-textfield"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FaLock />
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

          <button type="submit" className="forgot-password-button">
            Reset
          </button>
          <p className="signin-link">
            Remembered your password? <Link to="/signin">Sign In</Link>
          </p>
        </form>
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
    </div>
  );
};

export default ForgotPassword;
