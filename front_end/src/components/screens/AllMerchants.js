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
import CustomSnackbar from "./CustomSnackbar";
import LoadingSpinner from "./LoadingSpinner";

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

const AllMerchants = () => {
  const [loading, setLoading] = useState(false);
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

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [idToDelete, setIdToDelete] = useState(null);

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
    const response = await fetchMerchants(
      pagePending + 1,
      rowsPerPagePending,
      "Pending"
    );
    setPendingMerchants(response.data || []);
    setTotalPendingMerchants(response.total || 0);
  }, [pagePending, rowsPerPagePending]);

  const fetchAcceptedMerchants = useCallback(async () => {
    const response = await fetchMerchants(
      pageAccepted + 1,
      rowsPerPageAccepted,
      "Approved"
    );
    setAcceptedMerchants(response.data || []);
    setTotalAcceptedMerchants(response.total || 0);
  }, [pageAccepted, rowsPerPageAccepted]);

  const fetchRejectedMerchants = useCallback(async () => {
    const response = await fetchMerchants(
      pageRejected + 1,
      rowsPerPageRejected,
      "Rejected"
    );
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
  }, [
    tabIndex,
    fetchPendingMerchants,
    fetchAcceptedMerchants,
    fetchRejectedMerchants,
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

  const handleView = (merchant) => {
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
    fetchAcceptedMerchants();
    fetchRejectedMerchants();
    fetchPendingMerchants();
  };

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
                  <TableCell>
                    <strong>Business Name</strong>
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
                {pendingMerchants.length > 0 ? (
                  pendingMerchants.map((merchant, index) => (
                    <TableRow key={index}>
                      <TableCell>{merchant.first_name}</TableCell>
                      <TableCell>{`${merchant.no}, ${merchant.street_name}, ${merchant.suburb}, ${merchant.postal_code}, ${merchant.state}`}</TableCell>
                      <TableCell>{merchant.contact_no}</TableCell>
                      <TableCell>
                        <Tooltip title="Accept">
                          <IconButton
                            color="success"
                            onClick={() => handleAccept(merchant.id)}
                          >
                            <ThumbUpIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Reject">
                          <IconButton
                            color="warning"
                            onClick={() => handleReject(merchant.id)}
                          >
                            <ThumbDownIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="View">
                          <IconButton
                            color="info"
                            onClick={() => handleView(merchant)}
                          >
                            <VisibilityIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            color="error"
                            onClick={() => handleOpenDeleteDialog(merchant.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      No pending merchants.
                    </TableCell>
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
                  <TableCell>
                    <strong>Business Name</strong>
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
                {acceptedMerchants.length > 0 ? (
                  acceptedMerchants.map((merchant, index) => (
                    <TableRow key={index}>
                      <TableCell>{merchant.first_name}</TableCell>
                      <TableCell>{`${merchant.no}, ${merchant.street_name}, ${merchant.suburb}, ${merchant.postal_code}, ${merchant.state}`}</TableCell>
                      <TableCell>{merchant.contact_no}</TableCell>
                      <TableCell>
                        <Tooltip title="Set Pending">
                          <IconButton
                            color="secondary"
                            onClick={() => handlePending(merchant.id)}
                          >
                            <HourglassEmptyIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Reject">
                          <IconButton
                            color="warning"
                            onClick={() => handleReject(merchant.id)}
                          >
                            <ThumbDownIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="View">
                          <IconButton
                            color="info"
                            onClick={() => handleView(merchant)}
                          >
                            <VisibilityIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            color="error"
                            onClick={() => handleOpenDeleteDialog(merchant.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
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
                  <TableCell>
                    <strong>Business Name</strong>
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
                {rejectedMerchants.length > 0 ? (
                  rejectedMerchants.map((merchant, index) => (
                    <TableRow key={index}>
                      <TableCell>{merchant.first_name}</TableCell>
                      <TableCell>{`${merchant.no}, ${merchant.street_name}, ${merchant.suburb}, ${merchant.postal_code}, ${merchant.state}`}</TableCell>
                      <TableCell>{merchant.contact_no}</TableCell>
                      <TableCell>
                        <Tooltip title="Set Pending">
                          <IconButton
                            color="secondary"
                            onClick={() => handlePending(merchant.id)}
                          >
                            <HourglassEmptyIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Approve">
                          <IconButton
                            color="success"
                            onClick={() => handleAccept(merchant.id)}
                          >
                            <ThumbUpIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="View">
                          <IconButton
                            color="info"
                            onClick={() => handleView(merchant)}
                          >
                            <VisibilityIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            color="error"
                            onClick={() => handleOpenDeleteDialog(merchant.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
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

export default AllMerchants;
