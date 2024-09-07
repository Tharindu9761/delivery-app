import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import AsyncStorage from "@react-native-async-storage/async-storage";
import TopHeader from "./components/screens/TopHeader";
import SideNavBar from "./components/screens/SideNavBar";
import Footer from "./components/screens/Footer";
import Home from "./components/screens/Home";
import Dashboard from "./components/screens/Dashboard";
import AllDrivers from "./components/screens/AllDrivers";
import AllMerchants from "./components/screens/AllMerchants";
import SignIn from "./components/screens/SignIn";
import ForgotPassword from "./components/screens/ForgotPassword";
import ResetPassword from "./components/screens/ResetPassword";
import AllMessages from "./components/screens/AllMessages";
import SignUp from "./components/screens/SignUp";

import "./App.css";

const App = () => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkTokenExpiration = async () => {
      const token = await AsyncStorage.getItem("Token");
      const timestamp = await AsyncStorage.getItem("sessionTimestamp");
      const currentTime = new Date().getTime();

      if (token && timestamp) {
        const timeElapsed = currentTime - parseInt(timestamp, 10);
        const hoursElapsed = timeElapsed / (1000 * 60 * 60);

        if (hoursElapsed >= 24) {
          await AsyncStorage.removeItem("Token");
          await AsyncStorage.removeItem("Key");
          await AsyncStorage.removeItem("sessionTimestamp");
          setIsSignedIn(false);
        } else {
          setIsSignedIn(true);
        }
      }
      setIsLoading(false); 
    };

    checkTokenExpiration();

    const intervalId = setInterval(checkTokenExpiration, 60000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === "logout") {
        window.location.reload(); 
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => window.removeEventListener("storage", handleStorageChange); 
  }, []);

  const handleSignIn = async () => {
    setIsSignedIn(true);
  };

  const handleSignOut = async () => {
    setIsSignedIn(false);
    localStorage.setItem("logout", Date.now());
  };

  // If still loading, show nothing or a loading spinner
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      {isSignedIn && <SideNavBar />}
      {isSignedIn && <TopHeader onSignOut={handleSignOut} />}
      <div className={isSignedIn ? "mainBody signedIn" : "mainBody"}>
        <Routes>
          <Route path="/signin" element={<SignIn onSignIn={handleSignIn} />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/signup" element={<SignUp />} />
          <Route
            path="/reset-password"
            element={<ResetPassword onSignOut={handleSignOut} />}
          />
          {isSignedIn ? (
            <>
              <Route path="/" element={<Navigate to="/home" />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/home" element={<Home />} />
              <Route path="/drivers" element={<AllDrivers />} />
              <Route path="/merchants" element={<AllMerchants />} />
              <Route path="/messages" element={<AllMessages />} />
            </>
          ) : (
            <>
              <Route path="*" element={<Navigate to="/signin" />} />
              <Route path="/" element={<Navigate to="/signin" />} />
            </>
          )}
        </Routes>
      </div>
      {isSignedIn && <Footer />}
    </Router>
  );
};

export default App;
