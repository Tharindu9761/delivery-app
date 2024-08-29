import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/sideNavBar.css";
import HomeIcon from "@mui/icons-material/Home";
import DashboardIcon from "@mui/icons-material/Dashboard";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import StoreIcon from "@mui/icons-material/Store";
import MenuIcon from "@mui/icons-material/Menu";
import MailIcon from "@mui/icons-material/Mail";

const SideNavBar = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = (index) => {
    setActiveIndex(index);
    setIsOpen(false); // Close the side nav when an item is clicked on smaller screens
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

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
            className={activeIndex === 0 ? "active" : ""}
            onClick={() => handleClick(0)}
          >
            <Link to="/">
              <HomeIcon className="icon" />
              <span>Home</span>
            </Link>
          </li>
          <li
            className={activeIndex === 1 ? "active" : ""}
            onClick={() => handleClick(1)}
          >
            <Link to="/dashboard">
              <DashboardIcon className="icon" />
              <span>Dashboard</span>
            </Link>
          </li>
          <li
            className={activeIndex === 2 ? "active" : ""}
            onClick={() => handleClick(2)}
          >
            <Link to="/drivers">
              <DirectionsCarIcon className="icon" />
              <span>All Drivers</span>
            </Link>
          </li>
          <li
            className={activeIndex === 3 ? "active" : ""}
            onClick={() => handleClick(3)}
          >
            <Link to="/merchants">
              <StoreIcon className="icon" />
              <span>All Merchants</span>
            </Link>
          </li>
          <li
            className={activeIndex === 4 ? "active" : ""}
            onClick={() => handleClick(4)}
          >
            <Link to="/messages">
              <MailIcon className="icon" />
              <span>All Messages</span>
            </Link>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default SideNavBar;
