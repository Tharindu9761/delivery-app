import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import TopHeader from "./components/screens/TopHeader";
import SideNavBar from "./components/screens/SideNavBar";
import Footer from "./components/screens/Footer";
import Home from "./components/screens/Home";
import Dashboard from "./components/screens/DashBoard";
import AllDrivers from "./components/screens/AllDrivers";
import AllMerchants from "./components/screens/AllMerchants";
import "./App.css";

const App = () => {
  return (
    <Router>
      <SideNavBar />

      <TopHeader />
      <div className="mainBody">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/drivers" element={<AllDrivers />} />
          <Route path="/merchants" element={<AllMerchants />} />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
};

export default App;
