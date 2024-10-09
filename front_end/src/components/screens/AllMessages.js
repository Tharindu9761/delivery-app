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
  Tooltip,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CloseIcon from "@mui/icons-material/Close";
import moment from "moment";
import { getMessages, read } from "../../services/messagesService";
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

const AllMessages = () => {
  const [tabIndex, setTabIndex] = useState(0);

  const [pageNew, setPageNew] = useState(0);
  const [rowsPerPageNew, setRowsPerPageNew] = useState(5);

  const [pageOld, setPageOld] = useState(0);
  const [rowsPerPageOld, setRowsPerPageOld] = useState(5);

  const [newMessages, setNewMessages] = useState([]);
  const [oldMessages, setOldMessages] = useState([]);
  const [totalNewMessages, setTotalNewMessages] = useState(0);
  const [totalOldMessages, setTotalOldMessages] = useState(0);

  const [selectedMessage, setSelectedMessage] = useState(null);
  const [open, setOpen] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const fetchMessages = async (status, page, limit) => {
    try {
      const messages = await getMessages({ status, page, limit });
      return messages;
    } catch (error) {
      console.error("Error fetching messages:", error);
      return { data: [], total: 0 };
    }
  };

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

  useEffect(() => {
    if (tabIndex === 0) {
      fetchNewMessages();
    } else {
      fetchOldMessages();
    }
  }, [pageNew, rowsPerPageNew, pageOld, rowsPerPageOld, tabIndex]);

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  const handleChangePageNew = (event, newPage) => {
    setPageNew(newPage);
  };

  const handleChangeRowsPerPageNew = (event) => {
    setRowsPerPageNew(parseInt(event.target.value, 10));
    setPageNew(0);
  };

  const handleChangePageOld = (event, newPage) => {
    setPageOld(newPage);
  };

  const handleChangeRowsPerPageOld = (event) => {
    setRowsPerPageOld(parseInt(event.target.value, 10));
    setPageOld(0);
  };

  const handleOpenDialog = (message) => {
    setSelectedMessage(message);
    setOpen(true);
  };

  const handleCloseDialog = async () => {
    if (selectedMessage && selectedMessage.status === "Unread") {
      const response = await read(selectedMessage.id);

      if (response.success) {
        setSnackbar({
          open: true,
          message: response.message,
          severity: "success",
        });

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
              <TableHead>
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
                        <Tooltip title="Read Message">
                          <IconButton
                            color="primary"
                            onClick={() => handleOpenDialog(message)}
                          >
                            <VisibilityIcon />
                          </IconButton>
                        </Tooltip>
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
              <TableHead>
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
                        <Tooltip title="Read Message">
                          <IconButton
                            color="primary"
                            onClick={() => handleOpenDialog(message)}
                          >
                            <VisibilityIcon />
                          </IconButton>
                        </Tooltip>
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
            color="error"
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
        <DialogContent
          dividers
          sx={{ backgroundColor: "#f9f9f9", padding: "20px" }}
        >
          {selectedMessage && (
            <DialogContentText
              id="message-dialog-description"
              sx={{ color: "#333" }}
            >
              <Typography
                gutterBottom
                variant="subtitle1"
                sx={{ fontWeight: "bold" }}
              >
                From: {selectedMessage.name} ({selectedMessage.email})
              </Typography>
              <Typography
                gutterBottom
                variant="subtitle1"
                sx={{ fontWeight: "bold" }}
              >
                Date:{" "}
                {moment(selectedMessage.created_at).format(
                  "MMMM Do YYYY, h:mm a"
                )}
              </Typography>
              <Typography
                variant="body1"
                sx={{ marginTop: "20px", lineHeight: "1.6" }}
              >
                {selectedMessage.message}
              </Typography>
            </DialogContentText>
          )}
        </DialogContent>
      </Dialog>

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

export default AllMessages;
