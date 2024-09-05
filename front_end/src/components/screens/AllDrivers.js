import React, { useState, useEffect } from "react";
import {
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Typography,
  Box,
} from "@mui/material";

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
};

const AllDrivers = () => {
  // State for Tabs
  const [tabIndex, setTabIndex] = useState(0);

  // State for Drivers Pagination
  const [pagePending, setPagePending] = useState(0);
  const [rowsPerPagePending, setRowsPerPagePending] = useState(5);
  const [pageAccepted, setPageAccepted] = useState(0);
  const [rowsPerPageAccepted, setRowsPerPageAccepted] = useState(5);
  const [pageRejected, setPageRejected] = useState(0);
  const [rowsPerPageRejected, setRowsPerPageRejected] = useState(5);

  // State for Drivers Data
  const [pendingDrivers, setPendingDrivers] = useState([]);
  const [acceptedDrivers, setAcceptedDrivers] = useState([]);
  const [rejectedDrivers, setRejectedDrivers] = useState([]);

  // Sample data for demonstration
  const sampleDrivers = [
    { name: "John Doe", location: "New York", status: "Pending" },
    { name: "Jane Smith", location: "Los Angeles", status: "Accepted" },
    { name: "Michael Johnson", location: "Chicago", status: "Pending" },
    { name: "Emily Davis", location: "San Francisco", status: "Rejected" },
  ];

  useEffect(() => {
    // Filtering drivers based on their status
    setPendingDrivers(
      sampleDrivers.filter((driver) => driver.status === "Pending")
    );
    setAcceptedDrivers(
      sampleDrivers.filter((driver) => driver.status === "Accepted")
    );
    setRejectedDrivers(
      sampleDrivers.filter((driver) => driver.status === "Rejected")
    );
  }, []);

  // Handle Tab Change
  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  // Handle Pagination Changes for Pending Drivers
  const handleChangePagePending = (event, newPage) => {
    setPagePending(newPage);
  };

  const handleChangeRowsPerPagePending = (event) => {
    setRowsPerPagePending(parseInt(event.target.value, 10));
    setPagePending(0);
  };

  // Handle Pagination Changes for Accepted Drivers
  const handleChangePageAccepted = (event, newPage) => {
    setPageAccepted(newPage);
  };

  const handleChangeRowsPerPageAccepted = (event) => {
    setRowsPerPageAccepted(parseInt(event.target.value, 10));
    setPageAccepted(0);
  };

  // Handle Pagination Changes for Rejected Drivers
  const handleChangePageRejected = (event, newPage) => {
    setPageRejected(newPage);
  };

  const handleChangeRowsPerPageRejected = (event) => {
    setRowsPerPageRejected(parseInt(event.target.value, 10));
    setPageRejected(0);
  };

  return (
    <div className="all-drivers">
      <h1>All Drivers</h1>
      <Tabs
        value={tabIndex}
        onChange={handleTabChange}
        aria-label="driver tabs"
        indicatorColor="primary"
        textColor="primary"
        variant="fullWidth"
      >
        <Tab label="Pending Approvals" />
        <Tab label="Accepted" />
        <Tab label="Rejected" />
      </Tabs>

      {/* Pending Approvals Tab */}
      <TabPanel value={tabIndex} index={0}>
        <Paper>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <strong>Driver Name</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Location</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Status</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pendingDrivers.length > 0 ? (
                  pendingDrivers.map((driver, index) => (
                    <TableRow key={index}>
                      <TableCell>{driver.name}</TableCell>
                      <TableCell>{driver.location}</TableCell>
                      <TableCell>{driver.status}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} align="center">
                      No pending approvals.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={pendingDrivers.length}
            rowsPerPage={rowsPerPagePending}
            page={pagePending}
            onPageChange={handleChangePagePending}
            onRowsPerPageChange={handleChangeRowsPerPagePending}
          />
        </Paper>
      </TabPanel>

      {/* Accepted Tab */}
      <TabPanel value={tabIndex} index={1}>
        <Paper>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <strong>Driver Name</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Location</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Status</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {acceptedDrivers.length > 0 ? (
                  acceptedDrivers.map((driver, index) => (
                    <TableRow key={index}>
                      <TableCell>{driver.name}</TableCell>
                      <TableCell>{driver.location}</TableCell>
                      <TableCell>{driver.status}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} align="center">
                      No accepted drivers.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={acceptedDrivers.length}
            rowsPerPage={rowsPerPageAccepted}
            page={pageAccepted}
            onPageChange={handleChangePageAccepted}
            onRowsPerPageChange={handleChangeRowsPerPageAccepted}
          />
        </Paper>
      </TabPanel>

      {/* Rejected Tab */}
      <TabPanel value={tabIndex} index={2}>
        <Paper>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <strong>Driver Name</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Location</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Status</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rejectedDrivers.length > 0 ? (
                  rejectedDrivers.map((driver, index) => (
                    <TableRow key={index}>
                      <TableCell>{driver.name}</TableCell>
                      <TableCell>{driver.location}</TableCell>
                      <TableCell>{driver.status}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} align="center">
                      No rejected drivers.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={rejectedDrivers.length}
            rowsPerPage={rowsPerPageRejected}
            page={pageRejected}
            onPageChange={handleChangePageRejected}
            onRowsPerPageChange={handleChangeRowsPerPageRejected}
          />
        </Paper>
      </TabPanel>
    </div>
  );
};

export default AllDrivers;
