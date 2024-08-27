import React from 'react';
import '../styles/allDrivers.css';

const AllDrivers = () => {
  return (
    <div className="all-drivers">
      <h1>All Drivers</h1>
      <div className="card-container">
        <div className="card">
          <h3>Driver 1</h3>
          <p>Location: New York</p>
        </div>
        <div className="card">
          <h3>Driver 2</h3>
          <p>Location: Los Angeles</p>
        </div>
        <div className="card">
          <h3>Driver 3</h3>
          <p>Location: Chicago</p>
        </div>
        {/* Add more driver cards as needed */}
      </div>
    </div>
  );
};

export default AllDrivers;
