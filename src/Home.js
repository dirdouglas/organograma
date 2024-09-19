import React from 'react';
import { Box, Button, Container, Typography, Grid } from '@mui/material';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ flexGrow: 1, mt: 4 }}>
        <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>
          Bem-vindo ao Sistema de Gestão
        </Typography>
        
        {/* Usar Grid para organizar os botões */}
        <Grid container spacing={3} justifyContent="center">
          {/* Opção Funcionários Ativos */}
          <Grid item xs={12} sm={6} md={4}>
            <Button
              variant="contained"
              color="primary"
              component={Link}
              to="/funcionarios-ativos"
              fullWidth
              sx={{ padding: '20px', fontSize: '18px' }}
            >
              Funcionários Ativos
            </Button>
          </Grid>

          {/* Opção Funcionários Previstos */}
          <Grid item xs={12} sm={6} md={4}>
            <Button
              variant="contained"
              color="primary"
              component={Link}
              to="/funcionarios-previstos"
              fullWidth
              sx={{ padding: '20px', fontSize: '18px' }}
            >
              Funcionários Previstos
            </Button>
          </Grid>

          {/* Opção Resumo Quadro Previsto */}
          <Grid item xs={12} sm={6} md={4}>
            <Button
              variant="contained"
              color="primary"
              component={Link}
              to="/resumo-quadro-previsto"
              fullWidth
              sx={{ padding: '20px', fontSize: '18px' }}
            >
              Resumo Quadro Previsto
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Home;
