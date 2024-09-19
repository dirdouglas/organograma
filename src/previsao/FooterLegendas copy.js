import React, { useState } from 'react';
import { Box, Container, Typography } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import NovaVaga from './NovaVaga'; // Mantemos apenas aqui o formulário

const FooterLegendas = ({ totalFiltrados, fetchData, empresaFilter }) => {
  const [openDialog, setOpenDialog] = useState(false);

  // Função para abrir o modal de nova vaga
  const handleOpenDialog = () => {
    // console.log('empresaFilterfooter:', empresaFilter);
    setOpenDialog(true);
  };

  // Função para fechar o modal de nova vaga
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <Box
      style={{
        backgroundColor: '#fff',
        padding: '10px',
        position: 'fixed',
        bottom: 0,
        left: 0,
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 1200,
      }}
    >
      <Container style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 0 }}>
        <Typography variant="body1">
          <strong>Legenda:</strong>
          <span style={{ color: 'green', padding: '2px 5px', margin: '0 5px' }}>Confirmada</span>
          <span style={{ color: 'blue', padding: '2px 5px', margin: '0 5px' }}>Confirmada e Vaga</span>
          <span style={{ color: 'red', padding: '2px 5px', margin: '0 5px' }}>Confirmada e Demissão</span>
        </Typography>

        {/* Botão AddCircle centralizado */}
        <Box
          style={{
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
          }}
        >
          <AddCircleIcon
            style={{ fontSize: '60px', marginBottom: '15px', cursor: 'pointer' }}
            color="primary"
            onClick={handleOpenDialog} // Abre o modal ao clicar
          />
        </Box>

        <Typography variant="h6">
          <strong>Total de Colaboradores Filtrados: {totalFiltrados}</strong>
        </Typography>
      </Container>

      {/* Formulário de nova vaga */}
      <NovaVagaForm
        open={openDialog}
        onClose={handleCloseDialog}
        fetchData={fetchData}
        empresaFilter={empresaFilter}
        duplicarRegistro={false} // Passando como nova vaga
      />
    </Box>
  );
};

export default FooterLegendas;
