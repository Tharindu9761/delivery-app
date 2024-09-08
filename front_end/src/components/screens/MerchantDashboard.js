import React from "react";
import "../styles/dashboard.css";
import {
  Chart,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Doughnut, Bar } from "react-chartjs-2";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CategoryIcon from "@mui/icons-material/Category";
import CountUp from "react-countup";
import moment from "moment";
import { blue, pink, teal } from "@mui/material/colors";

// Registering the components with Chart.js
Chart.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const MerchantDashboard = () => {
  // Data for Doughnut Chart - Order Distribution
  const pieData = {
    labels: ["Active Orders", "Completed Orders", "Cancelled Orders"],
    datasets: [
      {
        label: "Orders",
        data: [120, 400, 50],
        backgroundColor: [blue[500], teal[300], pink[300]],
        hoverBackgroundColor: [blue[700], teal[500], pink[500]],
      },
    ],
  };

  // Data for Bar Chart - Performance Over Time
  const barData = {
    labels: [
      moment().subtract(5, "months").format("MMMM"),
      moment().subtract(4, "months").format("MMMM"),
      moment().subtract(3, "months").format("MMMM"),
      moment().subtract(2, "months").format("MMMM"),
      moment().subtract(1, "months").format("MMMM"),
      moment().format("MMMM"),
    ],
    datasets: [
      {
        label: "Monthly Orders",
        backgroundColor: blue[500],
        borderColor: blue[700],
        borderWidth: 1,
        hoverBackgroundColor: blue[700],
        hoverBorderColor: blue[700],
        data: [90, 110, 130, 150, 170, 200],
      },
    ],
  };

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>

      <div className="card-container">
        {/* Total Orders Card */}
        <div className="card">
          <div className="card-icon-container">
            <ShoppingCartIcon className="card-icon" />
          </div>
          <h3>Total Orders</h3>
          <strong>
            <CountUp end={1200} duration={2.5} />
          </strong>
        </div>

        {/* Active Products Card */}
        <div className="card">
          <div className="card-icon-container">
            <CategoryIcon className="card-icon" />
          </div>
          <h3>Active Products</h3>
          <strong>
            <CountUp end={150} duration={2.5} />
          </strong>
        </div>
      </div>

      <div className="charts-container">
        {/* Doughnut Chart - Order Distribution */}
        <div className="chart">
          <h3>Order Distribution</h3>
          <Doughnut data={pieData} height={300} />
        </div>

        {/* Bar Chart - Performance Over Time */}
        <div className="chart">
          <h3>Orders Over Time</h3>
          <Bar data={barData} height={300} />
        </div>
      </div>
    </div>
  );
};

export default MerchantDashboard;
