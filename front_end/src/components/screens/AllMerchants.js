import React from 'react';
import '../styles/allMerchants.css';

const AllMerchants = () => {
  return (
    <div className="all-merchants">
      <h1>All Merchants</h1>
      <div className="table-container">
        <table className="modern-table">
          <thead>
            <tr>
              <th>Merchant Name</th>
              <th>Business Name</th>
              <th>Location</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Merchant 1</td>
              <td>ABC Corp</td>
              <td>New York</td>
            </tr>
            <tr>
              <td>Merchant 2</td>
              <td>XYZ LLC</td>
              <td>Los Angeles</td>
            </tr>
            <tr>
              <td>Merchant 3</td>
              <td>123 Industries</td>
              <td>Chicago</td>
            </tr>
            <tr>
              <td>Merchant 4</td>
              <td>456 Enterprises</td>
              <td>San Francisco</td>
            </tr>
            {/* Add more rows as needed */}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllMerchants;
