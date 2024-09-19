// src/previsao/Titulo.js

import React from 'react';
import { Grid, Typography } from '@mui/material';

const Titulo = () => {
  return (
    <Grid container alignItems="center" justifyContent="space-between">
      <Grid item xs={8} md={6}>
        <Typography variant="h4" style={{ fontWeight: 'bold', color: '#000' }}>
          Funcionários Previstos
        </Typography>
      </Grid>
    </Grid>
  );
};

export default Titulo;
