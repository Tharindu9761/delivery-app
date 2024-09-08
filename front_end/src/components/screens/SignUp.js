import React, { useState } from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import TextField from "@mui/material/TextField";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import InputAdornment from "@mui/material/InputAdornment";
import "../styles/signUp.css";
import * as AppConst from "../../const/const";
import { createUser } from "../../services/userService";

const SignUp = () => {
  const navigate = useNavigate();

  const [merchantData, setMerchantData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    contact_no: "",
    newPassword: "",
    confirmPassword: "",
    no: "",
    street_name: "",
    suburb: "",
    postal_code: "",
    state: "",
    showPassword: false,
    isValidFirstName: true,
    isValidEmail: true,
    isValidContactNo: true,
    isValidNo: true,
    isValidStreetName: true,
    isValidSuburb: true,
    isValidPostalCode: true,
    isValidState: true,
    isValidPassword: true,
    passwordMatch: true,
    user_type: "Merchant",
    status: "Pending",
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: "success",
    message: "",
  });

  const states = AppConst.STATES;

  const handleEmailChange = (val) => {
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
    setMerchantData({
      ...merchantData,
      email: val,
      isValidEmail,
    });
  };

  const handleFirstNameChange = (val) => {
    const isValidFirstName = /^[A-Za-z]+(?:\s[A-Za-z]+)*$/.test(val);
    setMerchantData({
      ...merchantData,
      first_name: val,
      isValidFirstName,
    });
  };

  const handleContactNoChange = (val) => {
    const isValidContactNo = /^\d{10}$/.test(val);
    setMerchantData({
      ...merchantData,
      contact_no: val,
      isValidContactNo,
    });
  };

  const handleNoChange = (val) => {
    const isValidNo = val.trim() !== "";
    setMerchantData({
      ...merchantData,
      no: val,
      isValidNo,
    });
  };

  const handleStreetNameChange = (val) => {
    const isValidStreetName = val.trim() !== "";
    setMerchantData({
      ...merchantData,
      street_name: val,
      isValidStreetName,
    });
  };

  const handleSuburbChange = (val) => {
    const isValidSuburb = val.trim() !== "";
    setMerchantData({
      ...merchantData,
      suburb: val,
      isValidSuburb,
    });
  };

  const handlePostalCodeChange = (val) => {
    const isValidPostalCode = /^\d{4}$/.test(val);
    setMerchantData({
      ...merchantData,
      postal_code: val,
      isValidPostalCode,
    });
  };

  const handleStateChange = (val) => {
    const isValidState = val !== "";
    setMerchantData({
      ...merchantData,
      state: val,
      isValidState,
    });
  };

  const handlePasswordChange = (val) => {
    const isValidPassword = val.length >= 6;
    const passwordMatch = val === merchantData.confirmPassword;
    setMerchantData({
      ...merchantData,
      newPassword: val,
      isValidPassword,
      passwordMatch,
    });
  };

  const handleConfirmPasswordChange = (val) => {
    const passwordMatch = val === merchantData.newPassword;
    setMerchantData({
      ...merchantData,
      confirmPassword: val,
      passwordMatch,
    });
  };

  // Toggle Password Visibility
  const togglePasswordVisibility = () => {
    setMerchantData({
      ...merchantData,
      showPassword: !merchantData.showPassword,
    });
  };

  const handleClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleMerchantFormSubmit = async () => {
    // Perform validation for all fields
    const isValidFirstName = /^[A-Za-z]+(?:\s[A-Za-z]+)*$/.test(
      merchantData.first_name
    );
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(merchantData.email);
    const isValidContactNo = /^\d{10}$/.test(merchantData.contact_no);
    const isValidNo = merchantData.no.trim() !== "";
    const isValidStreetName = merchantData.street_name.trim() !== "";
    const isValidSuburb = merchantData.suburb.trim() !== "";
    const isValidPostalCode = /^\d{4}$/.test(merchantData.postal_code);
    const isValidState = merchantData.state !== "";
    const isValidPassword = merchantData.newPassword.length >= 6;
    const passwordMatch =
      merchantData.newPassword === merchantData.confirmPassword;

    // Set the state with validation results
    setMerchantData({
      ...merchantData,
      isValidFirstName,
      isValidEmail,
      isValidContactNo,
      isValidNo,
      isValidStreetName,
      isValidSuburb,
      isValidPostalCode,
      isValidState,
      isValidPassword,
      passwordMatch,
      user_type: "Merchant",
      status: "Pending",
    });

    // If any validation fails, display a Snackbar message
    if (
      !isValidFirstName ||
      !isValidEmail ||
      !isValidContactNo ||
      !isValidNo ||
      !isValidStreetName ||
      !isValidSuburb ||
      !isValidPostalCode ||
      !isValidState ||
      !isValidPassword ||
      !passwordMatch
    ) {
      setSnackbar({
        open: true,
        message: "Please fill in all the required fields correctly.",
        severity: "error",
      });
      return;
    }

    // Proceed with merchant creation if all validations pass
    try {
      const result = await createUser(merchantData);
      if (result.success) {
        setSnackbar({
          open: true,
          message: "Account created successfully!",
          severity: "success",
        });
        setTimeout(() => {
          navigate("/signin");
        }, 2500);
      } else {
        setSnackbar({
          open: true,
          message:
            result.message || "Failed to create account. Please try again.",
          severity: "error",
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message:
          "An error occurred while creating the account. Please try again.",
        severity: "error",
      });
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <h2>Merchant Sign Up</h2>

        {/* Name */}
        <div className="form-row">
          <div className="input-container">
            <TextField
              label="Name"
              placeholder="Enter business name"
              value={merchantData.first_name}
              onChange={(e) => handleFirstNameChange(e.target.value)}
              fullWidth
              margin="normal"
              variant="outlined"
              required
              error={!merchantData.isValidFirstName}
              helperText={
                !merchantData.isValidFirstName
                  ? "Name must contain only letters."
                  : "eg: Shop Epping"
              }
            />
          </div>
        </div>

        {/* Email and Contact No. */}
        <div className="form-row">
          <div className="input-container">
            <TextField
              label="Email"
              placeholder="Enter business email"
              value={merchantData.email}
              onChange={(e) => handleEmailChange(e.target.value)}
              fullWidth
              margin="normal"
              variant="outlined"
              required
              error={!merchantData.isValidEmail}
              helperText={
                !merchantData.isValidEmail
                  ? "Invalid email format."
                  : "example@abcd.com"
              }
            />
          </div>

          <div className="input-container">
            <TextField
              label="Contact No."
              placeholder="Enter contact number"
              value={merchantData.contact_no}
              onChange={(e) => handleContactNoChange(e.target.value)}
              fullWidth
              margin="normal"
              variant="outlined"
              required
              error={!merchantData.isValidContactNo}
              helperText={
                !merchantData.isValidContactNo
                  ? "Contact number must be 10 digits."
                  : "0123456789"
              }
            />
          </div>
        </div>

        {/* Address Inputs */}
        <div className="form-row">
          <div className="input-container">
            <TextField
              label="No"
              placeholder="Enter Unit/House/Apartment Number"
              value={merchantData.no}
              onChange={(e) => handleNoChange(e.target.value)}
              fullWidth
              margin="normal"
              variant="outlined"
              required
              error={!merchantData.isValidNo}
              helperText={
                !merchantData.isValidNo ? "Address is required" : "Unit 4/93"
              }
            />
          </div>

          <div className="input-container">
            <TextField
              label="Street Name"
              placeholder="Enter street name"
              value={merchantData.street_name}
              onChange={(e) => handleStreetNameChange(e.target.value)}
              fullWidth
              margin="normal"
              variant="outlined"
              required
              error={!merchantData.isValidStreetName}
              helperText={
                !merchantData.isValidStreetName
                  ? "Street name is required"
                  : "Melbourne Ave"
              }
            />
          </div>
        </div>

        <div className="form-row">
          <div className="input-container">
            <TextField
              label="Suburb"
              placeholder="Enter suburb"
              value={merchantData.suburb}
              onChange={(e) => handleSuburbChange(e.target.value)}
              fullWidth
              margin="normal"
              variant="outlined"
              required
              error={!merchantData.isValidSuburb}
              helperText={
                !merchantData.isValidSuburb
                  ? "Suburb is required."
                  : "eg: Glenroy"
              }
            />
          </div>

          <div className="input-container">
            <TextField
              label="Postal Code"
              placeholder="Enter postal code"
              value={merchantData.postal_code}
              onChange={(e) => handlePostalCodeChange(e.target.value)}
              fullWidth
              margin="normal"
              variant="outlined"
              required
              error={!merchantData.isValidPostalCode}
              helperText={
                !merchantData.isValidPostalCode
                  ? "Postal code must be 4 digits."
                  : "eg: 3046"
              }
            />
          </div>

          <div className="input-container">
            <TextField
              label="State"
              placeholder="Select state"
              select
              value={merchantData.state}
              onChange={(e) => handleStateChange(e.target.value)}
              fullWidth
              margin="normal"
              variant="outlined"
              required
              error={!merchantData.isValidState}
              helperText={
                !merchantData.isValidState
                  ? "State is required."
                  : "eg: Victoria"
              }
            >
              {states.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </div>
        </div>

        {/* Password and Confirm Password */}
        <div className="form-row">
          <div className="input-container">
            <TextField
              label="New Password"
              placeholder="Enter your password"
              type={merchantData.showPassword ? "text" : "password"}
              value={merchantData.newPassword}
              onChange={(e) => handlePasswordChange(e.target.value)}
              fullWidth
              margin="normal"
              variant="outlined"
              required
              error={!merchantData.isValidPassword}
              helperText={
                !merchantData.isValidPassword
                  ? "Password must be at least 6 characters long."
                  : ""
              }
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={togglePasswordVisibility}>
                      {merchantData.showPassword ? <FaEye /> : <FaEyeSlash />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </div>

          <div className="input-container">
            <TextField
              label="Confirm Password"
              placeholder="Confirm your password"
              type={merchantData.showPassword ? "text" : "password"}
              value={merchantData.confirmPassword}
              onChange={(e) => handleConfirmPasswordChange(e.target.value)}
              fullWidth
              margin="normal"
              variant="outlined"
              required
              error={!merchantData.passwordMatch}
              helperText={
                !merchantData.passwordMatch ? "Passwords do not match." : ""
              }
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="button-group">
          <button onClick={handleMerchantFormSubmit} className="submit-button">
            Create Merchant Account
          </button>
        </div>

        <p className="signin-link">
          Already have an account? <Link to="/signin">Sign In</Link>
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

export default SignUp;

/* <div className="form-row">
          <div
            className="input-container"
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "flex-start",
            }}
          >
            <FormControlLabel
              control={
                <Checkbox
                  checked={useManualAddress}
                  onChange={(e) => setUseManualAddress(e.target.checked)}
                />
              }
              label="Enter address manually"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="input-container">
            <Autocomplete
              disabled={useManualAddress}
              freeSolo
              options={addressSuggestions}
              getOptionLabel={(option) => option.label} // Show the address in the dropdown
              onChange={(event, value) => {
                if (value && value.address) {
                  handleMerchantChange("no", value.address.road || "");
                  handleMerchantChange("suburb", value.address.suburb || "");
                  handleMerchantChange("state", value.address.state || "");
                  handleMerchantChange(
                    "postal_code",
                    value.address.postcode || ""
                  );
                  setUseManualAddress(false); // Automatically disable manual input if an address is selected
                }
              }}
              onInputChange={(event, value) => {
                fetchAddressSuggestions(value);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Address"
                  placeholder="Search your address"
                  margin="normal"
                  variant="outlined"
              required
                  fullWidth
                />
              )}
            />
          </div>
        </div> */
