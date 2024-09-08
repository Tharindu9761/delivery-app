import React, { useEffect, useState } from "react";
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
import {
  getUserCountForTiles,
  getUserCountForChart,
} from "../../services/userService";

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

const AdminDashboard = () => {
  const [month_cunt] = useState(6);
  const [userCountTiles, setUserCountTiles] = useState({
    merchants: 0,
    customers: 0,
    drivers: 0,
  });

  const [chartData, setChartData] = useState({
    activeDrivers: [],
    activeMerchants: [],
    activeCustomers: [],
  });

  useEffect(() => {
    // Fetch data for tiles
    const fetchUserCounts = async () => {
      const tileData = await getUserCountForTiles();
      if (tileData) {
        setUserCountTiles({
          merchants:
            tileData.find((user) => user.user_type === "Merchant")?.count || 0,
          customers:
            tileData.find((user) => user.user_type === "Customer")?.count || 0,
          drivers:
            tileData.find((user) => user.user_type === "Driver")?.count || 0,
        });
      }
    };

    // Fetch data for chart
    const fetchChartData = async () => {
      const chartData = await getUserCountForChart({ month: month_cunt });
      if (chartData) {
        const activeDrivers = [];
        const activeMerchants = [];
        const activeCustomers = [];

        // Loop through each month in the response and extract the data
        chartData.forEach((monthData) => {
          const driverCount =
            monthData.users.find((user) => user.user_type === "Driver")
              ?.count || 0;
          const merchantCount =
            monthData.users.find((user) => user.user_type === "Merchant")
              ?.count || 0;
          const customerCount =
            monthData.users.find((user) => user.user_type === "Customer")
              ?.count || 0;

          activeDrivers.push(parseInt(driverCount, 10));
          activeMerchants.push(parseInt(merchantCount, 10));
          activeCustomers.push(parseInt(customerCount, 10));
        });

        setChartData({
          activeDrivers,
          activeMerchants,
          activeCustomers,
        });
      }
    };

    fetchUserCounts();
    fetchChartData();
  }, [month_cunt]);

  // Helper function to dynamically generate the last `month_cunt` months
  const generateLastMonths = (count) => {
    const months = [];
    for (let i = count - 1; i >= 0; i--) {
      months.push(moment().subtract(i, "months").format("MMMM"));
    }
    return months;
  };

  // Data for Doughnut Chart
  const pieData = {
    labels: ["Active Orders", "Completed Orders", "Cancelled Orders"],
    datasets: [
      {
        label: "Orders",
        data: [300, 1200, 200], // Dummy data for now
        backgroundColor: [blue[500], teal[300], pink[300]],
        hoverBackgroundColor: [blue[700], teal[500], pink[500]],
      },
    ],
  };

  // Data for Bar Chart
  const barData = {
    labels: generateLastMonths(month_cunt),
    datasets: [
      {
        label: "Active Drivers",
        backgroundColor: blue[500],
        borderColor: blue[700],
        borderWidth: 1,
        hoverBackgroundColor: blue[700],
        hoverBorderColor: blue[700],
        data: chartData.activeDrivers,
      },
      {
        label: "Active Merchants",
        backgroundColor: deepOrange[400],
        borderColor: deepOrange[600],
        borderWidth: 1,
        hoverBackgroundColor: deepOrange[600],
        hoverBorderColor: deepOrange[600],
        data: chartData.activeMerchants,
      },
      {
        label: "Active Customers",
        backgroundColor: cyan[400],
        borderColor: cyan[600],
        borderWidth: 1,
        hoverBackgroundColor: cyan[600],
        hoverBorderColor: cyan[600],
        data: chartData.activeCustomers,
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
          <strong>
            <CountUp end={50} duration={2.5} /> 
          </strong>
        </div>
        <div className="card">
          <div className="card-icon-container">
            <DirectionsCarIcon className="card-icon" />
          </div>
          <h3>Active Drivers</h3>
          <strong>
            <CountUp end={userCountTiles.drivers} duration={2.5} />
          </strong>
        </div>
        <div className="card">
          <div className="card-icon-container">
            <StoreIcon className="card-icon" />
          </div>
          <h3>Active Merchants</h3>
          <strong>
            <CountUp end={userCountTiles.merchants} duration={2.5} />
          </strong>
        </div>
        <div className="card">
          <div className="card-icon-container">
            <PersonIcon className="card-icon" />
          </div>
          <h3>Active Customers </h3>
          <strong>
            <CountUp end={userCountTiles.customers} duration={2.5} />
          </strong>
        </div>
      </div>

      <div className="charts-container">
        <div className="chart">
          <h3>Order Distribution for the Past {month_cunt} Month</h3>
          <Doughnut data={pieData} height={300} />
        </div>
        <div className="chart">
          <h3>
            Drivers, Merchants & Customers for the Past {month_cunt} Month
          </h3>
          <Bar data={barData} height={300} />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
