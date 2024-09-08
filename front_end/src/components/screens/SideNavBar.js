import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/sideNavBar.css";
import HomeIcon from "@mui/icons-material/Home";
import DashboardIcon from "@mui/icons-material/Dashboard";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import PeopleIcon from '@mui/icons-material/People';
import StoreIcon from "@mui/icons-material/Store";
import MenuIcon from "@mui/icons-material/Menu";
import MailIcon from "@mui/icons-material/Mail";
import { get_user_role } from "../../services/userService";

const SideNavBar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [userRole, setUserRole] = useState();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const userRole = await get_user_role();
      setUserRole(userRole || null);
    };

    fetchUserData();
  }, []);

  return (
    <>
      <div className="menu-toggle" onClick={toggleMenu}>
        <MenuIcon />
      </div>
      <nav className={`side-nav ${isOpen ? "open" : ""}`}>
        <div className="side-nav-header">
          <img src="/assets/logo.png" alt="Logo" className="side-nav-logo" />
          <h1 className="side-nav-title">Quick Drop</h1>
        </div>
        <ul>
          <li
            className={location.pathname === "/home" ? "active" : ""}
            onClick={() => setIsOpen(false)}
          >
            <Link to="/">
              <HomeIcon className="icon" />
              <span>Home</span>
            </Link>
          </li>
          <li
            className={location.pathname === "/dashboard" ? "active" : ""}
            onClick={() => setIsOpen(false)}
          >
            <Link to="/dashboard">
              <DashboardIcon className="icon" />
              <span>Dashboard</span>
            </Link>
          </li>
          {userRole === "Admin" && (
            <>
             <li
                className={location.pathname === "/customers" ? "active" : ""}
                onClick={() => setIsOpen(false)}
              >
                <Link to="/customers">
                  <PeopleIcon className="icon" />
                  <span>All Customers</span>
                </Link>
              </li>
              <li
                className={location.pathname === "/drivers" ? "active" : ""}
                onClick={() => setIsOpen(false)}
              >
                <Link to="/drivers">
                  <DirectionsCarIcon className="icon" />
                  <span>All Drivers</span>
                </Link>
              </li>
              <li
                className={location.pathname === "/merchants" ? "active" : ""}
                onClick={() => setIsOpen(false)}
              >
                <Link to="/merchants">
                  <StoreIcon className="icon" />
                  <span>All Merchants</span>
                </Link>
              </li>
              <li
                className={location.pathname === "/messages" ? "active" : ""}
                onClick={() => setIsOpen(false)}
              >
                <Link to="/messages">
                  <MailIcon className="icon" />
                  <span>All Messages</span>
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </>
  );
};

export default SideNavBar;
