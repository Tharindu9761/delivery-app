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
import AllCustomers from "./components/screens/AllCustomers";
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

  // Protect routes that only signed-in users can access
  const ProtectedRoute = ({ element }) => {
    return isSignedIn ? element : <Navigate to="/signin" />;
  };

  // Protect routes that only non-signed-in users should access
  const GuestRoute = ({ element }) => {
    return isSignedIn ? <Navigate to="/home" /> : element;
  };

  return (
    <Router>
      {isSignedIn && <SideNavBar />}
      {isSignedIn && <TopHeader onSignOut={handleSignOut} />}
      <div className={isSignedIn ? "mainBody signedIn" : "mainBody"}>
        <Routes>
          {/* Guest routes (redirect to home if already signed in) */}
          <Route
            path="/signin"
            element={
              <GuestRoute element={<SignIn onSignIn={handleSignIn} />} />
            }
          />
          <Route path="/signup" element={<GuestRoute element={<SignUp />} />} />
          <Route
            path="/forgot-password"
            element={<GuestRoute element={<ForgotPassword />} />}
          />
          <Route
            path="/reset-password"
            element={
              <GuestRoute
                element={<ResetPassword onSignOut={handleSignOut} />}
              />
            }
          />

          {/* Protected routes (redirect to sign-in if not signed in) */}
          <Route path="/" element={<ProtectedRoute element={<Home />} />} />
          <Route
            path="/dashboard"
            element={<ProtectedRoute element={<Dashboard />} />}
          />
          <Route path="/home" element={<ProtectedRoute element={<Home />} />} />
          <Route
            path="/customers"
            element={<ProtectedRoute element={<AllCustomers />} />}
          />
          <Route
            path="/drivers"
            element={<ProtectedRoute element={<AllDrivers />} />}
          />
          <Route
            path="/merchants"
            element={<ProtectedRoute element={<AllMerchants />} />}
          />
          <Route
            path="/messages"
            element={<ProtectedRoute element={<AllMessages />} />}
          />

          {/* Catch-all route to redirect unknown paths */}
          <Route
            path="*"
            element={<Navigate to={isSignedIn ? "/home" : "/signin"} />}
          />
        </Routes>
      </div>
      {isSignedIn && <Footer />}
    </Router>
  );
};

export default App;
