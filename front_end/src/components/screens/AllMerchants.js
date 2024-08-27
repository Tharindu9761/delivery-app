import React from 'react';
import '../styles/allMerchants.css';

const AllMerchants = () => {
  return (
    <div className="all-merchants">
      <h1>All Merchants</h1>
      <div className="card-container">
        <div className="card">
          <h3>Merchant 1</h3>
          <p>Business: ABC Corp</p>
        </div>
        <div className="card">
          <h3>Merchant 2</h3>
          <p>Business: XYZ LLC</p>
        </div>
        <div className="card">
          <h3>Merchant 3</h3>
          <p>Business: 123 Industries</p>
        </div>
        {/* Add more merchant cards as needed */}
      </div>
    </div>
  );
};

export default AllMerchants;
