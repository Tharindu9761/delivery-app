import React from 'react';
import '../styles/allDrivers.css';

const AllDrivers = () => {
  return (
    <div className="all-drivers">
      <h1>All Drivers</h1>
      <div className="table-container">
        <table className="modern-table">
          <thead>
            <tr>
              <th>Driver Name</th>
              <th>Location</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>John Doe</td>
              <td>New York</td>
              <td>Available</td>
            </tr>
            <tr>
              <td>Jane Smith</td>
              <td>Los Angeles</td>
              <td>On Delivery</td>
            </tr>
            <tr>
              <td>Michael Johnson</td>
              <td>Chicago</td>
              <td>Available</td>
            </tr>
            <tr>
              <td>Emily Davis</td>
              <td>San Francisco</td>
              <td>Unavailable</td>
            </tr>
            {/* Add more rows as needed */}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllDrivers;
