import * as React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

const LoadingSpinner = ({ open }) => {
  return (
    <Modal
      open={open}
      aria-labelledby="loading-modal-title"
      aria-describedby="loading-modal-description"
    >
      <Box sx={style}>
        <CircularProgress />
      </Box>
    </Modal>
  );
};

export default LoadingSpinner;
