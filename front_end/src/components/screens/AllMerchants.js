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
import "../styles/allMerchants.css";


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

const AllMerchants = () => {
  // State for Tabs
  const [tabIndex, setTabIndex] = useState(0);

  // State for Merchants Pagination
  const [pagePending, setPagePending] = useState(0);
  const [rowsPerPagePending, setRowsPerPagePending] = useState(5);
  const [pageAccepted, setPageAccepted] = useState(0);
  const [rowsPerPageAccepted, setRowsPerPageAccepted] = useState(5);
  const [pageRejected, setPageRejected] = useState(0);
  const [rowsPerPageRejected, setRowsPerPageRejected] = useState(5);

  // State for Merchants Data
  const [pendingMerchants, setPendingMerchants] = useState([]);
  const [acceptedMerchants, setAcceptedMerchants] = useState([]);
  const [rejectedMerchants, setRejectedMerchants] = useState([]);

  // Sample data for demonstration
  const sampleMerchants = [
    { name: "Merchant 1", businessName: "ABC Corp", location: "New York", status: "Pending" },
    { name: "Merchant 2", businessName: "XYZ LLC", location: "Los Angeles", status: "Accepted" },
    { name: "Merchant 3", businessName: "123 Industries", location: "Chicago", status: "Pending" },
    { name: "Merchant 4", businessName: "456 Enterprises", location: "San Francisco", status: "Rejected" },
   
  ];

  useEffect(() => {
    // Filtering merchants based on their status
    setPendingMerchants(sampleMerchants.filter((merchant) => merchant.status === "Pending"));
    setAcceptedMerchants(sampleMerchants.filter((merchant) => merchant.status === "Accepted"));
    setRejectedMerchants(sampleMerchants.filter((merchant) => merchant.status === "Rejected"));
  }, []);

  // Handle Tab Change
  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  // Handle Pagination Changes for Pending Merchants
  const handleChangePagePending = (event, newPage) => {
    setPagePending(newPage);
  };

  const handleChangeRowsPerPagePending = (event) => {
    setRowsPerPagePending(parseInt(event.target.value, 10));
    setPagePending(0);
  };

  // Handle Pagination Changes for Accepted Merchants
  const handleChangePageAccepted = (event, newPage) => {
    setPageAccepted(newPage);
  };

  const handleChangeRowsPerPageAccepted = (event) => {
    setRowsPerPageAccepted(parseInt(event.target.value, 10));
    setPageAccepted(0);
  };

  // Handle Pagination Changes for Rejected Merchants
  const handleChangePageRejected = (event, newPage) => {
    setPageRejected(newPage);
  };

  const handleChangeRowsPerPageRejected = (event) => {
    setRowsPerPageRejected(parseInt(event.target.value, 10));
    setPageRejected(0);
  };

  return (
    <div className="all-merchants">
      <h1>All Merchants</h1>
      <Tabs
        value={tabIndex}
        onChange={handleTabChange}
        aria-label="merchant tabs"
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
                  <TableCell><strong>Merchant Name</strong></TableCell>
                  <TableCell><strong>Business Name</strong></TableCell>
                  <TableCell><strong>Location</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pendingMerchants.length > 0 ? (
                  pendingMerchants.map((merchant, index) => (
                    <TableRow key={index}>
                      <TableCell>{merchant.name}</TableCell>
                      <TableCell>{merchant.businessName}</TableCell>
                      <TableCell>{merchant.location}</TableCell>
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
            count={pendingMerchants.length}
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
                  <TableCell><strong>Merchant Name</strong></TableCell>
                  <TableCell><strong>Business Name</strong></TableCell>
                  <TableCell><strong>Location</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {acceptedMerchants.length > 0 ? (
                  acceptedMerchants.map((merchant, index) => (
                    <TableRow key={index}>
                      <TableCell>{merchant.name}</TableCell>
                      <TableCell>{merchant.businessName}</TableCell>
                      <TableCell>{merchant.location}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} align="center">
                      No accepted merchants.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={acceptedMerchants.length}
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
                  <TableCell><strong>Merchant Name</strong></TableCell>
                  <TableCell><strong>Business Name</strong></TableCell>
                  <TableCell><strong>Location</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rejectedMerchants.length > 0 ? (
                  rejectedMerchants.map((merchant, index) => (
                    <TableRow key={index}>
                      <TableCell>{merchant.name}</TableCell>
                      <TableCell>{merchant.businessName}</TableCell>
                      <TableCell>{merchant.location}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} align="center">
                      No rejected merchants.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={rejectedMerchants.length}
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

export default AllMerchants;
