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
  Typography,
  Box,
  IconButton,
  Tooltip,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import { getUsers } from "../../services/userService";
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
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
};
 
const AllMerchants = () => {
  const [tabIndex, setTabIndex] = useState(0);
 
  const [pagePending, setPagePending] = useState(0);
  const [rowsPerPagePending, setRowsPerPagePending] = useState(5);
 
  const [pageAccepted, setPageAccepted] = useState(0);
  const [rowsPerPageAccepted, setRowsPerPageAccepted] = useState(5);
 
  const [pageRejected, setPageRejected] = useState(0);
  const [rowsPerPageRejected, setRowsPerPageRejected] = useState(5);
 
  const [pendingMerchants, setPendingMerchants] = useState([]);
  const [acceptedMerchants, setAcceptedMerchants] = useState([]);
  const [rejectedMerchants, setRejectedMerchants] = useState([]);
  const [totalPendingMerchants, setTotalPendingMerchants] = useState(0);
  const [totalAcceptedMerchants, setTotalAcceptedMerchants] = useState(0);
  const [totalRejectedMerchants, setTotalRejectedMerchants] = useState(0);
 
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
 
  const handleClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };
 
  const fetchMerchants = async (page, limit, status) => {
    try {
      const response = await getUsers({
        page: page,
        limit: limit,
        status: status,
        user_type: "Merchant",
      });
      return response;
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Error fetching merchants",
        severity: "error",
      });
      console.error("Error fetching merchants:", error);
    }
  };
 
  const fetchPendingMerchants = useCallback(async () => {
    const response = await fetchMerchants(pagePending + 1, rowsPerPagePending, "Pending");
    setPendingMerchants(response.data || []);
    setTotalPendingMerchants(response.total || 0);
  }, [pagePending, rowsPerPagePending]);
 
  const fetchAcceptedMerchants = useCallback(async () => {
    const response = await fetchMerchants(pageAccepted + 1, rowsPerPageAccepted, "Approved");
    setAcceptedMerchants(response.data || []);
    setTotalAcceptedMerchants(response.total || 0);
  }, [pageAccepted, rowsPerPageAccepted]);
 
  const fetchRejectedMerchants = useCallback(async () => {
    const response = await fetchMerchants(pageRejected + 1, rowsPerPageRejected, "Rejected");
    setRejectedMerchants(response.data || []);
    setTotalRejectedMerchants(response.total || 0);
  }, [pageRejected, rowsPerPageRejected]);
 
  useEffect(() => {
    if (tabIndex === 0) {
      fetchPendingMerchants();
    } else if (tabIndex === 1) {
      fetchAcceptedMerchants();
    } else if (tabIndex === 2) {
      fetchRejectedMerchants();
    }
  }, [tabIndex, fetchPendingMerchants, fetchAcceptedMerchants, fetchRejectedMerchants]);
 
  const handleChangePagePending = (event, newPage) => {
    setPagePending(newPage);
  };
 
  const handleChangeRowsPerPagePending = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPagePending(newRowsPerPage);
    setPagePending(0);
  };
 
  const handleChangePageAccepted = (event, newPage) => {
    setPageAccepted(newPage);
  };
 
  const handleChangeRowsPerPageAccepted = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPageAccepted(newRowsPerPage);
    setPageAccepted(0);
  };
 
  const handleChangePageRejected = (event, newPage) => {
    setPageRejected(newPage);
  };
 
  const handleChangeRowsPerPageRejected = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPageRejected(newRowsPerPage);
    setPageRejected(0);
  };
 
  const handleAccept = (id) => { /* Implement accept logic */ };
  const handleReject = (id) => { /* Implement reject logic */ };
  const handleDelete = (id) => { /* Implement delete logic */ };
  const handleView = (merchant) => { /* Implement view logic */ };
  const handlePending = (id) => { /* Implement pending logic */ };
 
  return (
    <div className="all-merchants">
      <h1>All Merchants</h1>
      <Tabs
        value={tabIndex}
        onChange={(event, newValue) => setTabIndex(newValue)}
        aria-label="merchant tabs"
        indicatorColor="primary"
        textColor="primary"
        variant="fullWidth"
      >
        <Tab label="Pending Approvals" />
        <Tab label="Accepted Merchants" />
        <Tab label="Rejected Merchants" />
      </Tabs>
 
      {/* Pending Merchants Tab */}
      <TabPanel value={tabIndex} index={0}>
        <Paper>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Business Name</strong></TableCell>
                  <TableCell><strong>Address</strong></TableCell>
                  <TableCell><strong>Contact No</strong></TableCell>
                  <TableCell><strong>Actions</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pendingMerchants.length > 0 ? (
                  pendingMerchants.map((merchant, index) => (
                    <TableRow key={index}>
                      <TableCell>{merchant.first_name}</TableCell>
                      <TableCell>{`${merchant.no}, ${merchant.street_name}, ${merchant.suburb}, ${merchant.postal_code}, ${merchant.state}`}</TableCell>
                      <TableCell>{merchant.contact_no}</TableCell>
                      <TableCell>
                        <Tooltip title="Accept">
                          <IconButton color="success" onClick={() => handleAccept(merchant.id)}><CheckIcon /></IconButton>
                        </Tooltip>
                        <Tooltip title="Reject">
                          <IconButton color="secondary" onClick={() => handleReject(merchant.id)}><ClearIcon /></IconButton>
                        </Tooltip>
                        <Tooltip title="View">
                          <IconButton color="info" onClick={() => handleView(merchant)}><VisibilityIcon /></IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton color="error" onClick={() => handleDelete(merchant.id)}><DeleteIcon /></IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} align="center">No pending merchants.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={totalPendingMerchants}
            rowsPerPage={rowsPerPagePending}
            page={pagePending}
            onPageChange={handleChangePagePending}
            onRowsPerPageChange={handleChangeRowsPerPagePending}
          />
        </Paper>
      </TabPanel>
 
      {/* Accepted Merchants Tab */}
      <TabPanel value={tabIndex} index={1}>
        <Paper>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Business Name</strong></TableCell>
                  <TableCell><strong>Address</strong></TableCell>
                  <TableCell><strong>Contact No</strong></TableCell>
                  <TableCell><strong>Actions</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {acceptedMerchants.length > 0 ? (
                  acceptedMerchants.map((merchant, index) => (
                    <TableRow key={index}>
                      <TableCell>{merchant.first_name}</TableCell>
                      <TableCell>{`${merchant.no}, ${merchant.street_name}, ${merchant.suburb}, ${merchant.postal_code}, ${merchant.state}`}</TableCell>
                      <TableCell>{merchant.contact_no}</TableCell>
                      <TableCell>
                        <Tooltip title="Set Pending">
                          <IconButton color="warning" onClick={() => handlePending(merchant.id)}><HourglassEmptyIcon /></IconButton>
                        </Tooltip>
                        <Tooltip title="Reject">
                          <IconButton color="secondary" onClick={() => handleReject(merchant.id)}><ClearIcon /></IconButton>
                        </Tooltip>
                        <Tooltip title="View">
                          <IconButton color="info" onClick={() => handleView(merchant)}><VisibilityIcon /></IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton color="error" onClick={() => handleDelete(merchant.id)}><DeleteIcon /></IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} align="center">No accepted merchants.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={totalAcceptedMerchants}
            rowsPerPage={rowsPerPageAccepted}
            page={pageAccepted}
            onPageChange={handleChangePageAccepted}
            onRowsPerPageChange={handleChangeRowsPerPageAccepted}
          />
        </Paper>
      </TabPanel>
 
      {/* Rejected Merchants Tab */}
      <TabPanel value={tabIndex} index={2}>
        <Paper>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Business Name</strong></TableCell>
                  <TableCell><strong>Address</strong></TableCell>
                  <TableCell><strong>Contact No</strong></TableCell>
                  <TableCell><strong>Actions</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rejectedMerchants.length > 0 ? (
                  rejectedMerchants.map((merchant, index) => (
                    <TableRow key={index}>
                      <TableCell>{merchant.first_name}</TableCell>
                      <TableCell>{`${merchant.no}, ${merchant.street_name}, ${merchant.suburb}, ${merchant.postal_code}, ${merchant.state}`}</TableCell>
                      <TableCell>{merchant.contact_no}</TableCell>
                      <TableCell>
                        <Tooltip title="Set Pending">
                          <IconButton color="warning" onClick={() => handlePending(merchant.id)}><HourglassEmptyIcon /></IconButton>
                        </Tooltip>
                        <Tooltip title="Approve">
                          <IconButton color="success" onClick={() => handleAccept(merchant.id)}><CheckIcon /></IconButton>
                        </Tooltip>
                        <Tooltip title="View">
                          <IconButton color="info" onClick={() => handleView(merchant)}><VisibilityIcon /></IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton color="error" onClick={() => handleDelete(merchant.id)}><DeleteIcon /></IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} align="center">No rejected merchants.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={totalRejectedMerchants}
            rowsPerPage={rowsPerPageRejected}
            page={pageRejected}
            onPageChange={handleChangePageRejected}
            onRowsPerPageChange={handleChangeRowsPerPageRejected}
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
 
export default AllMerchants;