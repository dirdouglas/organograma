import React from 'react';
import { Box, IconButton } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';

const AddCircleButton = ({ onClick }) => {
  return (
    <Box
      style={{
        width: '60px',
        height: '60px',
        position: 'fixed',
        bottom: '20px',
        right: '20px',
      }}
    >
      <IconButton
        onClick={onClick} // Passamos a função onClick vinda do pai
        style={{ fontSize: '75px' }}
      >
        <AddCircleIcon style={{ fontSize: '75px' }} color="primary" />
      </IconButton>
    </Box>
  );
};

export default AddCircleButton;
