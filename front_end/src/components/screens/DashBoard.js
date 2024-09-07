import React, { useState, useEffect } from "react";
import { get_user_role } from "../../services/userService";
import MerchantDashboard from "./MerchantDashboard";
import AdminDashboard from "./AdminDashboard";

const Dashboard = () => {
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // UseEffect to fetch the user's role when the component mounts
  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const role = await get_user_role();
        if (role) {
          setUserRole(role);
        } else {
          setError("Unable to determine user role.");
        }
      } catch (error) {
        setError("Error fetching user role.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, []);

  // Show loading spinner while fetching the role
  if (loading) {
    return <div>Loading...</div>;
  }

  // Handle error state
  if (error) {
    return <div>{error}</div>;
  }

  // Conditionally render the dashboard based on the user role
  if (userRole === "Admin") {
    return <AdminDashboard />;
  }

  if (userRole === "Merchant") {
    return <MerchantDashboard />;
  }

  // Fallback if the user role is unrecognized or null
  return <div>Error: Unrecognized user role</div>;
};

export default Dashboard;
