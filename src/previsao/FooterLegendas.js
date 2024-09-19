import React from 'react';
import { Grid, Box, Typography, IconButton } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';

const FooterLegendas = ({ tipo, totalFiltrados, onNovaVaga }) => {
  const renderLegendas = () => {
    if (tipo === 'funcionarios_previstos') {
      return (
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <Box
              style={{
                display: 'inline-block',
                width: '15px',
                height: '15px',
                backgroundColor: '#ccffcc',
                marginRight: '5px',
              }}
            />
            <Typography variant="body2" style={{ display: 'inline-block' }}>
              Previsão Confirmada
            </Typography>
          </Grid>
          <Grid item>
            <Box
              style={{
                display: 'inline-block',
                width: '15px',
                height: '15px',
                backgroundColor: '#ffcccc',
                marginRight: '5px',
              }}
            />
            <Typography variant="body2" style={{ display: 'inline-block' }}>
              Demissão Confirmada
            </Typography>
          </Grid>
          <Grid item>
            <Box
              style={{
                display: 'inline-block',
                width: '15px',
                height: '15px',
                backgroundColor: '#cce5ff',
                marginRight: '5px',
              }}
            />
            <Typography variant="body2" style={{ display: 'inline-block' }}>
              Vaga Confirmada
            </Typography>
          </Grid>
        </Grid>
      );
    }
    return null;
  };

  return (
    <Box
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        width: '100%',
        backgroundColor: '#f9f9f9',
        padding: '5px 10px', // Margem superior e inferior reduzidas
        height: '50px', // Altura fixa reduzida
        boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        alignItems: 'center', // Alinha verticalmente os itens no centro
        zIndex: 1000,
      }}
    >
      <Grid container alignItems="center" justifyContent="space-between">
        {/* Legenda à esquerda */}
        <Grid item xs={4}>
          {renderLegendas()}
        </Grid>

        {/* Botão de adicionar vaga no centro */}
        {tipo === 'funcionarios_previstos' && (
          <Grid item xs={4} style={{ textAlign: 'center' }}>
            <IconButton onClick={onNovaVaga}>
              <AddCircleIcon style={{ fontSize: 60, marginBottom: '15px',color: '#3f51b5' }} />
            </IconButton>
          </Grid>
        )}

        {/* Total de funcionários à direita */}
        {tipo === 'funcionarios_previstos' && (
          <Grid item xs={4} style={{ textAlign: 'right' }}>
            <Typography variant="body1" style={{ display: 'flex', alignItems: 'center' }}>
              Total de Funcionários Filtrados: <strong>{totalFiltrados}</strong>
            </Typography>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default FooterLegendas;
