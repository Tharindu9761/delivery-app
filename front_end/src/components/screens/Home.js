import React, { useEffect, useState } from "react";
import { Paper, Button } from "@mui/material";
import { get_user_role } from "../../services/userService";
import "../styles/home.css";

const Home = () => {
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      const role = await get_user_role();
      setUserRole(role);
    };

    fetchUserRole();
  }, []);

  return (
    <div className="home-container">
      <div className="home-banner">
        <div className="content-container">
          <div className="logo-container">
            <img
              src="/assets/logo.png"
              alt="Quick Drop Logo"
              className="quick-drop-logo"
            />
          </div>
          <div className="text-container">
            <h1>Welcome to Quick Drop</h1>

            <h2>
              {userRole === "Admin"
                ? "Admin Dashboard Overview"
                : "Merchant Dashboard Overview"}
            </h2>

            <p>
              {userRole === "Admin"
                ? "As an Admin, you can manage drivers, merchants, and monitor all delivery operations within your local area."
                : "As a Merchant, you can view your store's delivery performance, manage your orders, and streamline the logistics for a better customer experience."}
            </p>

            {/* Button to navigate to the dashboard based on the role */}
            <Button
              variant="contained"
              color="primary"
              size="large"
              className="cta-button"
              onClick={() => {
                window.location.href = "/dashboard";
              }}
            >
              {userRole === "Admin"
                ? "Go to Admin Dashboard"
                : "Go to Merchant Dashboard"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
