import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";

import { web_login } from "../../services/userService";
import "../styles/signIn.css";
import LoadingSpinner from "./LoadingSpinner";

const SignIn = ({ onSignIn }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [data, setData] = useState({
    email: "",
    password: "",
    check_email_Change: false,
    secureTextEntry: true,
    isValidUser: true,
    isValidPassword: true,
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleEmailChange = (val) => {
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
    setData({
      ...data,
      email: val,
      check_email_Change: isValidEmail,
      isValidUser: isValidEmail,
    });
  };

  const handlePasswordChange = (val) => {
    if (val.trim().length >= 6) {
      setData({
        ...data,
        password: val,
        isValidPassword: true,
      });
    } else {
      setData({
        ...data,
        password: val,
        isValidPassword: false,
      });
    }
  };

  const togglePasswordVisibility = () => {
    setData({
      ...data,
      secureTextEntry: !data.secureTextEntry,
    });
  };

  const handleSignIn = async () => {
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email);
    const isPasswordValid = data.password.length >= 6;

    // Update validation state
    setData({
      ...data,
      isValidUser: isEmailValid,
      isValidPassword: isPasswordValid,
    });

    if (!isEmailValid || !isPasswordValid) {
      setSnackbar({
        open: true,
        message: "Please enter a valid email address and password",
        severity: "error",
      });
      return;
    }

    setLoading(true);
    // Proceed to login if both email and password are valid
    try {
      const loginResponse = await web_login(data.email, data.password);

      if (loginResponse.success) {
        const currentTime = new Date().getTime();

        // Store the token and key in AsyncStorage
        await AsyncStorage.setItem("Token", loginResponse.token);
        await AsyncStorage.setItem("Key", loginResponse.key);
        await AsyncStorage.setItem("sessionTimestamp", currentTime.toString());

        setSnackbar({
          open: true,
          message: "Login successful! Welcome back.",
          severity: "success",
        });

        // Call onSignIn to update the parent state and navigate to home
        setTimeout(() => {
          setLoading(false);
          onSignIn();
          navigate("/");
        }, 2500);
      } else {
        // Handle unsuccessful login attempt
        setLoading(false);
        setSnackbar({
          open: true,
          message:
            loginResponse.message ||
            "Incorrect email or password. Please try again.",
          severity: "error",
        });
      }
    } catch (error) {
      // Handle any errors during the login process
      setLoading(false);
      setSnackbar({
        open: true,
        message:
          "An unexpected error occurred during login. Please try again later.",
        severity: "error",
      });
      console.error("Login error:", error);
    }
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <div className="signin-container">
      <div className="signin-box">
        <h2>Sign In</h2>
        <div className="input-container">
          <TextField
            label="Email"
            type="email"
            fullWidth
            value={data.email}
            onChange={(e) => handleEmailChange(e.target.value)}
            required
            margin="normal"
            variant="outlined"
            className="custom-textfield"
            error={!data.isValidUser}
            helperText={!data.isValidUser ? "Invalid email address." : ""}
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

        <div className="input-container">
          <TextField
            label="Password"
            type={data.secureTextEntry ? "password" : "text"}
            fullWidth
            value={data.password}
            onChange={(e) => handlePasswordChange(e.target.value)}
            required
            margin="normal"
            variant="outlined"
            className="custom-textfield"
            error={!data.isValidPassword}
            helperText={!data.isValidPassword ? "Invalid password." : ""}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FaLock />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={togglePasswordVisibility}>
                    {data.secureTextEntry ? <FaEyeSlash /> : <FaEye />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </div>

        <div className="button-group">
          <button onClick={handleSignIn} className="signin-button">
            Sign In
          </button>
        </div>
        <p className="forgot-password-link">
          Forgot your password? <Link to="/forgot-password">Reset it</Link>
        </p>
        <p className="signup-link">
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>
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
      <LoadingSpinner open={loading} />
    </div>
  );
};

export default SignIn;
