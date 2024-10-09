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
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Button,
} from "@mui/material";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CloseIcon from "@mui/icons-material/Close";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import {
  getUsers,
  updateUserStatus,
  deleteUser,
} from "../../services/userService";
import LoadingSpinner from "./LoadingSpinner";
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

const AllDrivers = () => {
  const [loading, setLoading] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);

  const [pagePending, setPagePending] = useState(0);
  const [rowsPerPagePending, setRowsPerPagePending] = useState(5);

  const [pageAccepted, setPageAccepted] = useState(0);
  const [rowsPerPageAccepted, setRowsPerPageAccepted] = useState(5);

  const [pageRejected, setPageRejected] = useState(0);
  const [rowsPerPageRejected, setRowsPerPageRejected] = useState(5);

  const [pendingDrivers, setPendingDrivers] = useState([]);
  const [acceptedDrivers, setAcceptedDrivers] = useState([]);
  const [rejectedDrivers, setRejectedDrivers] = useState([]);

  const [totalPendingDrivers, setTotalPendingDrivers] = useState(0);
  const [totalAcceptedDrivers, setTotalAcceptedDrivers] = useState(0);
  const [totalRejectedDrivers, setTotalRejectedDrivers] = useState(0);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [idToDelete, setIdToDelete] = useState(null);

  const fetchDrivers = async (page, limit, status) => {
    try {
      const response = await getUsers({
        page: page,
        limit: limit,
        status: status,
        user_type: "Driver",
      });
      return response;
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Error fetching drivers",
        severity: "error",
      });
      console.error("Error fetching drivers:", error);
    }
  };

  const fetchPendingDrivers = useCallback(async () => {
    const response = await fetchDrivers(
      pagePending + 1,
      rowsPerPagePending,
      "Pending"
    );
    setPendingDrivers(response.data || []);
    setTotalPendingDrivers(response.total || 0);
  }, [pagePending, rowsPerPagePending]);

  const fetchAcceptedDrivers = useCallback(async () => {
    const response = await fetchDrivers(
      pageAccepted + 1,
      rowsPerPageAccepted,
      "Approved"
    );
    setAcceptedDrivers(response.data || []);
    setTotalAcceptedDrivers(response.total || 0);
  }, [pageAccepted, rowsPerPageAccepted]);

  const fetchRejectedDrivers = useCallback(async () => {
    const response = await fetchDrivers(
      pageRejected + 1,
      rowsPerPageRejected,
      "Rejected"
    );
    setRejectedDrivers(response.data || []);
    setTotalRejectedDrivers(response.total || 0);
  }, [pageRejected, rowsPerPageRejected]);

  useEffect(() => {
    if (tabIndex === 0) {
      fetchPendingDrivers();
    } else if (tabIndex === 1) {
      fetchAcceptedDrivers();
    } else if (tabIndex === 2) {
      fetchRejectedDrivers();
    }
  }, [
    tabIndex,
    fetchPendingDrivers,
    fetchAcceptedDrivers,
    fetchRejectedDrivers,
  ]);

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

  const handleOpenDeleteDialog = (id) => {
    setIdToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    setLoading(true);
    const response = await deleteUser(idToDelete);
    if (response.success) {
      setSnackbar({
        open: true,
        message: response.message,
        severity: "success",
      });
    } else {
      setSnackbar({ open: true, message: response.message, severity: "error" });
    }
    setIdToDelete(null);
    setDeleteDialogOpen(false);

    setTimeout(() => {
      setLoading(false);
      handReloadTables();
    }, 2500);
  };

  const handleView = (driver) => {
    /* Implement view logic */
  };
  const handleAccept = async (id) => {
    setLoading(true);
    const response = await updateUserStatus(id, "Approved");
    if (response.success) {
      setSnackbar({
        open: true,
        message: response.message,
        severity: "success",
      });
    } else {
      setSnackbar({ open: true, message: response.message, severity: "error" });
    }
    setTimeout(() => {
      setLoading(false);
      handReloadTables();
    }, 2500);
  };

  const handleReject = async (id) => {
    setLoading(true);
    const response = await updateUserStatus(id, "Rejected");
    if (response.success) {
      setSnackbar({
        open: true,
        message: response.message,
        severity: "success",
      });
    } else {
      setSnackbar({ open: true, message: response.message, severity: "error" });
    }
    setTimeout(() => {
      setLoading(false);
      handReloadTables();
    }, 2500);
  };

  const handlePending = async (id) => {
    setLoading(true);
    const response = await updateUserStatus(id, "Pending");
    if (response.success) {
      setSnackbar({
        open: true,
        message: response.message,
        severity: "success",
      });
    } else {
      setSnackbar({ open: true, message: response.message, severity: "error" });
    }
    setTimeout(() => {
      setLoading(false);
      handReloadTables();
    }, 2500);
  };

  const handReloadTables = () => {
    fetchAcceptedDrivers();
    fetchRejectedDrivers();
    fetchPendingDrivers();
  };

  return (
    <div className="all-drivers">
      <h1>All Drivers</h1>
      <Tabs
        value={tabIndex}
        onChange={(event, newValue) => setTabIndex(newValue)}
        aria-label="driver tabs"
        indicatorColor="primary"
        textColor="primary"
        variant="fullWidth"
      >
        <Tab label="Pending Drivers" />
        <Tab label="Accepted Drivers" />
        <Tab label="Rejected Drivers" />
      </Tabs>

      {/* Pending Drivers Tab */}
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
                  <TableCell>
                    <strong>Actions</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pendingDrivers.length > 0 ? (
                  pendingDrivers.map((driver, index) => (
                    <TableRow key={index}>
                      <TableCell>{driver.first_name}</TableCell>
                      <TableCell>{driver.last_name}</TableCell>
                      <TableCell>{`${driver.no}, ${driver.street_name}, ${driver.suburb}, ${driver.postal_code}, ${driver.state}`}</TableCell>
                      <TableCell>{driver.contact_no}</TableCell>
                      <TableCell>
                        <Tooltip title="Accept">
                          <IconButton
                            color="success"
                            onClick={() => handleAccept(driver.id)}
                          >
                            <ThumbUpIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Reject">
                          <IconButton
                            color="warning"
                            onClick={() => handleReject(driver.id)}
                          >
                            <ThumbDownIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="View">
                          <IconButton
                            color="info"
                            onClick={() => handleView(driver)}
                          >
                            <VisibilityIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            color="error"
                            onClick={() => handleOpenDeleteDialog(driver.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      No pending drivers.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={totalPendingDrivers}
            rowsPerPage={rowsPerPagePending}
            page={pagePending}
            onPageChange={handleChangePagePending}
            onRowsPerPageChange={handleChangeRowsPerPagePending}
          />
        </Paper>
      </TabPanel>

      {/* Accepted Drivers Tab */}
      <TabPanel value={tabIndex} index={1}>
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
                  <TableCell>
                    <strong>Actions</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {acceptedDrivers.length > 0 ? (
                  acceptedDrivers.map((driver, index) => (
                    <TableRow key={index}>
                      <TableCell>{driver.first_name}</TableCell>
                      <TableCell>{driver.last_name}</TableCell>
                      <TableCell>{`${driver.no}, ${driver.street_name}, ${driver.suburb}, ${driver.postal_code}, ${driver.state}`}</TableCell>
                      <TableCell>{driver.contact_no}</TableCell>
                      <TableCell>
                        <Tooltip title="Set Pending">
                          <IconButton
                            color="secondary"
                            onClick={() => handlePending(driver.id)}
                          >
                            <HourglassEmptyIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Reject">
                          <IconButton
                            color="warning"
                            onClick={() => handleReject(driver.id)}
                          >
                            <ThumbDownIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="View">
                          <IconButton
                            color="info"
                            onClick={() => handleView(driver)}
                          >
                            <VisibilityIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            color="error"
                            onClick={() => handleOpenDeleteDialog(driver.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
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
            count={totalAcceptedDrivers}
            rowsPerPage={rowsPerPageAccepted}
            page={pageAccepted}
            onPageChange={handleChangePageAccepted}
            onRowsPerPageChange={handleChangeRowsPerPageAccepted}
          />
        </Paper>
      </TabPanel>

      {/* Rejected Drivers Tab */}
      <TabPanel value={tabIndex} index={2}>
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
                  <TableCell>
                    <strong>Actions</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rejectedDrivers.length > 0 ? (
                  rejectedDrivers.map((driver, index) => (
                    <TableRow key={index}>
                      <TableCell>{driver.first_name}</TableCell>
                      <TableCell>{driver.last_name}</TableCell>
                      <TableCell>{`${driver.no}, ${driver.street_name}, ${driver.suburb}, ${driver.postal_code}, ${driver.state}`}</TableCell>
                      <TableCell>{driver.contact_no}</TableCell>
                      <TableCell>
                        <Tooltip title="Set Pending">
                          <IconButton
                            color="secondary"
                            onClick={() => handlePending(driver.id)}
                          >
                            <HourglassEmptyIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Approve">
                          <IconButton
                            color="success"
                            onClick={() => handleAccept(driver.id)}
                          >
                            <ThumbUpIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="View">
                          <IconButton
                            color="info"
                            onClick={() => handleView(driver)}
                          >
                            <VisibilityIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            color="error"
                            onClick={() => handleOpenDeleteDialog(driver.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
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
            count={totalRejectedDrivers}
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

      {/* Loading Spinner */}
      <LoadingSpinner open={loading} />

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        aria-labelledby="delete-dialog-title"
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle id="delete-dialog-title">
          Confirm Delete
          <IconButton
            aria-label="close"
            onClick={() => setDeleteDialogOpen(false)}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <DialogContentText>
            Are you sure you want to delete this Merchant? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setDeleteDialogOpen(false)}
          >
            Cancel
          </Button>
          <Button variant="contained" color="error" onClick={handleDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AllDrivers;
