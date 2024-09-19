// src/resumo/FooterResumo.js

import React from 'react';
import { Box, Container, Typography } from '@mui/material';

const FooterResumo = ({ totalPrevistos, totalRealizados, totalDiferenca }) => {
  return (
    <Box
      style={{
        backgroundColor: '#fff',
        padding: '5px',
        position: 'fixed',
        bottom: 0,
        left: 0,
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 1200,
        boxShadow: '0px -4px 10px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Container style={{ display: 'flex', justifyContent: 'space-between', padding: 0 }}>
        <Typography variant="h6">
          <strong>Previstos: {totalPrevistos}</strong>
        </Typography>
        <Typography variant="h6">
          <strong>Realizados: {totalRealizados}</strong>
        </Typography>
        <Typography variant="h6">
          <strong>Diferença: {totalDiferenca}</strong>
        </Typography>
      </Container>
    </Box>
  );
};

export default FooterResumo;
