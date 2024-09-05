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
import PersonIcon from "@mui/icons-material/Person";
import StoreIcon from "@mui/icons-material/Store";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import CountUp from "react-countup";
import moment from "moment";
import { blue, cyan, pink, teal, deepOrange } from "@mui/material/colors";

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

const Dashboard = () => {
  // Data for Doughnut Chart
  const pieData = {
    labels: ["Active Orders", "Completed Orders", "Cancelled Orders"],
    datasets: [
      {
        label: "Orders",
        data: [300, 1200, 200],
        backgroundColor: [blue[500], teal[300], pink[300]],
        hoverBackgroundColor: [blue[700], teal[500], pink[500]],
      },
    ],
  };

  // Data for Bar Chart
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
        label: "Active Drivers",
        backgroundColor: blue[500],
        borderColor: blue[700],
        borderWidth: 1,
        hoverBackgroundColor: blue[700],
        hoverBorderColor: blue[700],
        data: [30, 25, 20, 25, 30, 35],
      },
      {
        label: "Active Merchants",
        backgroundColor: deepOrange[400],
        borderColor: deepOrange[600],
        borderWidth: 1,
        hoverBackgroundColor: deepOrange[600],
        hoverBorderColor: deepOrange[600],
        data: [45, 50, 55, 50, 45, 50],
      },
      {
        label: "Active Customers",
        backgroundColor: cyan[400],
        borderColor: cyan[600],
        borderWidth: 1,
        hoverBackgroundColor: cyan[600],
        hoverBorderColor: cyan[600],
        data: [60, 65, 70, 75, 80, 85],
      },
    ],
  };

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <div className="card-container">
        <div className="card">
          <div className="card-icon-container">
            <ShoppingCartIcon className="card-icon" />
          </div>
          <h3>Total Orders</h3>
          <p>
            <CountUp end={1500} duration={2.5} />
          </p>
        </div>
        <div className="card">
          <div className="card-icon-container">
            <DirectionsCarIcon className="card-icon" />
          </div>
          <h3>Active Drivers</h3>
          <p>
            <CountUp end={75} duration={2.5} />
          </p>
        </div>
        <div className="card">
          <div className="card-icon-container">
            <StoreIcon className="card-icon" />
          </div>
          <h3>Active Merchants</h3>
          <p>
            <CountUp end={120} duration={2.5} />
          </p>
        </div>
        <div className="card">
          <div className="card-icon-container">
            <PersonIcon className="card-icon" />
          </div>
          <h3>Active Customers</h3>
          <p>
            <CountUp end={300} duration={2.5} />
          </p>
        </div>
      </div>

      <div className="charts-container">
        <div className="chart">
          <h3>Order Distribution</h3>
          <Doughnut data={pieData} height={300} />
        </div>
        <div className="chart">
          <h3>Drivers, Merchants & Customers Over Time</h3>
          <Bar data={barData} height={300} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
