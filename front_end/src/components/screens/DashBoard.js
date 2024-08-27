import React from 'react';
import '../styles/dashboard.css';

const Dashboard = () => {
  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <div className="card-container">
        <div className="card">
          <h3>Total Orders</h3>
          <p>1500</p>
        </div>
        <div className="card">
          <h3>Active Drivers</h3>
          <p>75</p>
        </div>
        <div className="card">
          <h3>Pending Deliveries</h3>
          <p>120</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
