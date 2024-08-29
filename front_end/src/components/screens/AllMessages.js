// src/components/AllMessages/AllMessages.jsx

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
  IconButton,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CloseIcon from "@mui/icons-material/Close";
import moment from "moment";
import { getMessages, read } from "../../services/messagesService"; // Ensure correct path

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

const AllMessages = () => {
  // State for Tabs
  const [tabIndex, setTabIndex] = useState(0);

  // State for New Messages Pagination
  const [pageNew, setPageNew] = useState(0);
  const [rowsPerPageNew, setRowsPerPageNew] = useState(5);

  // State for Old Messages Pagination
  const [pageOld, setPageOld] = useState(0);
  const [rowsPerPageOld, setRowsPerPageOld] = useState(5);

  // State for Messages Data
  const [newMessages, setNewMessages] = useState([]);
  const [oldMessages, setOldMessages] = useState([]);
  const [totalNewMessages, setTotalNewMessages] = useState(0);
  const [totalOldMessages, setTotalOldMessages] = useState(0);

  // State for Selected Message and Dialog
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [open, setOpen] = useState(false);

  // State for Snackbar Notifications
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Fetch Messages Function
  const fetchMessages = async (type, page, limit) => {
    try {
      const messages = await getMessages({ type, page, limit });
      return messages;
    } catch (error) {
      console.error("Error fetching messages:", error);
      return { data: [], total: 0 };
    }
  };

  // Extracted Fetch Functions for New and Old Messages
  const fetchNewMessages = async () => {
    const response = await fetchMessages("Unread", pageNew + 1, rowsPerPageNew);
    setNewMessages(response.data || []);
    setTotalNewMessages(response.total || 0);
  };

  const fetchOldMessages = async () => {
    const response = await fetchMessages("Read", pageOld + 1, rowsPerPageOld);
    setOldMessages(response.data || []);
    setTotalOldMessages(response.total || 0);
  };

  // useEffect to Fetch Messages on Dependency Changes
  useEffect(() => {
    if (tabIndex === 0) {
      fetchNewMessages();
    } else {
      fetchOldMessages();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNew, rowsPerPageNew, pageOld, rowsPerPageOld, tabIndex]);

  // Handle Tab Change
  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  // Handle Pagination Changes for New Messages
  const handleChangePageNew = (event, newPage) => {
    setPageNew(newPage);
  };

  const handleChangeRowsPerPageNew = (event) => {
    setRowsPerPageNew(parseInt(event.target.value, 10));
    setPageNew(0);
  };

  // Handle Pagination Changes for Old Messages
  const handleChangePageOld = (event, newPage) => {
    setPageOld(newPage);
  };

  const handleChangeRowsPerPageOld = (event) => {
    setRowsPerPageOld(parseInt(event.target.value, 10));
    setPageOld(0);
  };

  // Handle Opening the Dialog
  const handleOpenDialog = (message) => {
    setSelectedMessage(message);
    setOpen(true);
  };

  // Handle Closing the Dialog and Marking as Read
  const handleCloseDialog = async () => {
    if (selectedMessage && selectedMessage.type === "Unread") {
      const response = await read(selectedMessage.id);

      if (response.success) {
        setSnackbar({
          open: true,
          message: response.message,
          severity: "success",
        });

        // Reload both message lists
        fetchNewMessages();
        fetchOldMessages();
      } else {
        setSnackbar({
          open: true,
          message: response.message,
          severity: "error",
        });
      }
    }

    setOpen(false);
    setSelectedMessage(null);
  };

  // Handle Snackbar Close
  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <div className="all-messages">
      <h1>All Messages</h1>
      <Tabs
        value={tabIndex}
        onChange={handleTabChange}
        aria-label="message tabs"
        indicatorColor="primary"
        textColor="primary"
        variant="fullWidth"
      >
        <Tab label="New Messages" />
        <Tab label="Old Messages" />
      </Tabs>

      {/* New Messages Tab */}
      <TabPanel value={tabIndex} index={0}>
        <Paper>
          <TableContainer>
            <Table>
              <TableHead >
                <TableRow>
                  <TableCell>
                    <strong>Name</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Email</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Subject</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Date</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Action</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {newMessages.length > 0 ? (
                  newMessages.map((message) => (
                    <TableRow key={message.id}>
                      <TableCell>{message.name}</TableCell>
                      <TableCell>{message.email}</TableCell>
                      <TableCell>{message.subject}</TableCell>
                      <TableCell>
                        {moment(message.created_at).format("MM/DD/YYYY")}
                      </TableCell>
                      <TableCell>
                        <Button
                          onClick={() => handleOpenDialog(message)}
                          variant="outlined"
                          startIcon={<VisibilityIcon />}
                        >
                          Read Message
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      No new messages.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={totalNewMessages}
            rowsPerPage={rowsPerPageNew}
            page={pageNew}
            onPageChange={handleChangePageNew}
            onRowsPerPageChange={handleChangeRowsPerPageNew}
          />
        </Paper>
      </TabPanel>

      {/* Old Messages Tab */}
      <TabPanel value={tabIndex} index={1}>
        <Paper>
          <TableContainer>
            <Table>
              <TableHead >
                <TableRow>
                  <TableCell>
                    <strong>Name</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Email</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Subject</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Date</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Action</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {oldMessages.length > 0 ? (
                  oldMessages.map((message) => (
                    <TableRow key={message.id}>
                      <TableCell>{message.name}</TableCell>
                      <TableCell>{message.email}</TableCell>
                      <TableCell>{message.subject}</TableCell>
                      <TableCell>
                        {moment(message.created_at).format("MM/DD/YYYY")}
                      </TableCell>
                      <TableCell>
                        <Button
                          onClick={() => handleOpenDialog(message)}
                          variant="outlined"
                          startIcon={<VisibilityIcon />}
                        >
                          Read Message
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      No old messages.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={totalOldMessages}
            rowsPerPage={rowsPerPageOld}
            page={pageOld}
            onPageChange={handleChangePageOld}
            onRowsPerPageChange={handleChangeRowsPerPageOld}
          />
        </Paper>
      </TabPanel>

      {/* Message Details Dialog */}
      <Dialog
        open={open}
        onClose={handleCloseDialog}
        aria-labelledby="message-dialog-title"
        aria-describedby="message-dialog-description"
        fullWidth
        maxWidth="sm"
        sx={{
          "& .MuiDialog-paper": {
            width: "500px",
            maxWidth: "90%",
          },
        }}
      >
        <DialogTitle id="message-dialog-title">
          {selectedMessage ? selectedMessage.subject : "Message Details"}
          <IconButton
            aria-label="close"
            onClick={handleCloseDialog}
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
          {selectedMessage && (
            <DialogContentText id="message-dialog-description">
              <Typography gutterBottom>
                <strong>From:</strong> {selectedMessage.name} (
                {selectedMessage.email})
              </Typography>
              <Typography gutterBottom>
                <strong>Date:</strong>{" "}
                {moment(selectedMessage.created_at).format("MM/DD/YYYY")}
              </Typography>
              <Typography gutterBottom>
                <strong>Message:</strong>
                {selectedMessage.message}
              </Typography>
            </DialogContentText>
          )}
        </DialogContent>
      </Dialog>

      {/* Snackbar for Notifications */}
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default AllMessages;
