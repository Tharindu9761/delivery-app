import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";

import { web_login } from "../../services/userService";
import "../styles/signIn.css";

const SignIn = ({ onSignIn }) => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    email: "",
    password: "",
    check_textInputChange: false,
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
    let reg = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (reg.test(val)) {
      setData({
        ...data,
        email: val,
        check_textInputChange: true,
        isValidUser: true,
      });
    } else {
      setData({
        ...data,
        email: val,
        check_textInputChange: false,
        isValidUser: false,
      });
    }
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

  const handleSignIn = async (event) => {
    event.preventDefault();

    if (!data.isValidUser) {
      setSnackbar({
        open: true,
        message: "Please enter a valid email address.",
        severity: "error",
      });
      return;
    }

    if (!data.isValidPassword) {
      setSnackbar({
        open: true,
        message: "Password must be at least 6 characters long.",
        severity: "error",
      });
      return;
    }

    try {
      const loginResponse = await web_login(data.email, data.password);

      if (loginResponse.success) {
        // Store the token and key in AsyncStorage if needed
        await AsyncStorage.setItem("Token", loginResponse.token);
        await AsyncStorage.setItem("Key", loginResponse.key);

        setSnackbar({
          open: true,
          message: "Login successful! Welcome back.",
          severity: "success",
        });

        // Call onSignIn to update the parent state
        setTimeout(() => {
          onSignIn();
          navigate("/");
        }, 2500);
      } else {
        setSnackbar({
          open: true,
          message: loginResponse.message || "Login Failed",
          severity: "error",
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: "An error occurred during login. Please try again.",
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
        <form onSubmit={handleSignIn}>
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
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FaEnvelope />
                  </InputAdornment>
                ),
                endAdornment: data.check_textInputChange ? (
                  <InputAdornment position="end">
                    <span style={{ color: "green" }}>✔</span>
                  </InputAdornment>
                ) : null,
              }}
            />

            {!data.isValidUser && (
              <div style={{ color: "red", fontSize: "12px" }}>
                Invalid email address.
              </div>
            )}
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
            {!data.isValidPassword && (
              <div style={{ color: "red", fontSize: "12px" }}>
                Password must be at least 6 characters long.
              </div>
            )}
          </div>

          <button type="submit" className="signin-button">
            Sign In
          </button>
          <p className="signup-link">
            Don't have an account? <a href="#signup">Sign Up</a>
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

export default SignIn;
