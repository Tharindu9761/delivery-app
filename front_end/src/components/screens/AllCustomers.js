import React, { useState, useEffect, useCallback } from "react";
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
  Box,
} from "@mui/material";
import { getUsers } from "../../services/userService"; // Import the user service
import CustomSnackbar from "./CustomSnackbar";

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
          <div>{children}</div>
        </Box>
      )}
    </div>
  );
};

const AllCustomers = () => {
  // State for Tabs
  const [tabIndex, setTabIndex] = useState(0);

  // Pagination state for Approved customers
  const [pageApproved, setPageApproved] = useState(0);
  const [rowsPerPageApproved, setRowsPerPageApproved] = useState(5);

  // Customers data state
  const [approvedCustomers, setApprovedCustomers] = useState([]);
  const [totalApprovedCustomers, setTotalApprovedCustomers] = useState(0);

  // Snackbar notification state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Fetch Customers from backend
  const fetchCustomers = async (page, limit) => {
    try {
      const response = await getUsers({
        page: page,
        limit: limit,
        status: "Approved",
        user_type: "Customer",
      });
      return response;
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Error fetching customers",
        severity: "error",
      });
      console.error("Error fetching customers:", error);
    }
  };

  // Fetch Approved Customers (wrapped in useCallback to prevent unnecessary re-renders)
  const fetchApprovedCustomers = useCallback(async () => {
    const response = await fetchCustomers(
      pageApproved + 1,
      rowsPerPageApproved
    );
    setApprovedCustomers(response.data || []);
    setTotalApprovedCustomers(response.total || 0);
  }, [pageApproved, rowsPerPageApproved]);

  // useEffect to fetch approved customers on page/limit change
  useEffect(() => {
    fetchApprovedCustomers();
  }, [fetchApprovedCustomers]);

  // Handle pagination changes for Approved customers
  const handleChangePageApproved = (event, newPage) => {
    setPageApproved(newPage);
  };

  const handleChangeRowsPerPageApproved = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPageApproved(newRowsPerPage);
    setPageApproved(0);
  };

  return (
    <div className="all-customers">
      <h1>All Customers</h1>
      <Tabs
        value={tabIndex}
        onChange={(event, newValue) => setTabIndex(newValue)}
        aria-label="customer tabs"
        indicatorColor="primary"
        textColor="primary"
        variant="fullWidth"
      >
        <Tab label="Approved Customers" />
      </Tabs>

      {/* Approved Customers Tab */}
      <TabPanel value={tabIndex} index={0}>
        <Paper>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <strong>First Name</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Last Name</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Address</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Contact No</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {approvedCustomers.length > 0 ? (
                  approvedCustomers.map((customer, index) => (
                    <TableRow key={index}>
                      <TableCell>{customer.first_name}</TableCell>
                      <TableCell>{customer.last_name}</TableCell>
                      <TableCell>{`${customer.no}, ${customer.street_name}, ${customer.suburb}, ${customer.postal_code}, ${customer.state}`}</TableCell>
                      <TableCell>{customer.contact_no}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      No approved customers.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={totalApprovedCustomers}
            rowsPerPage={rowsPerPageApproved}
            page={pageApproved}
            onPageChange={handleChangePageApproved}
            onRowsPerPageChange={handleChangeRowsPerPageApproved}
          />
        </Paper>
      </TabPanel>

      {/* Snackbar for Notifications */}
      <CustomSnackbar
        open={snackbar.open}
        severity={snackbar.severity}
        message={snackbar.message}
        onClose={handleClose}
      />
    </div>
  );
};

export default AllCustomers;
