import React, { useState, useEffect, useContext } from 'react';
import { Table, TableBody, TableCell, TableContainer,Container, TableHead, TableRow, Paper, TextField, IconButton, Typography, Grid, Box, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { Cached as CachedIcon } from '@mui/icons-material';
import axios from 'axios';
import dayjs from 'dayjs';
import { EmpresaContext } from './EmpresaContext'; // Importa o contexto global

const ResumoQuadroPrevisto = () => {
  const [dataSelecionada, setDataSelecionada] = useState(dayjs().format('YYYY-MM-DD')); // Data de referência
  const [resumo, setResumo] = useState([]); // Dados retornados da API
  const [filtros, setFiltros] = useState({ departamento: '', nivel1: '', nivel2: '', gestor: '', diferenca: 'TODOS' }); // Filtros locais

  const { empresaId, idGestor, adm } = useContext(EmpresaContext); // Acessa o contexto global

  // Carrega os dados sempre que empresaId, idGestor ou adm mudarem
  useEffect(() => {
    if (empresaId) {
      carregarResumo(); // Chama a função sempre que os valores mudarem
    }
  }, [empresaId, idGestor, adm, dataSelecionada]); // Dependências para recarregar a função

  // Função para carregar os dados da API
  const carregarResumo = async () => {
    try {
      if (!empresaId) {
        console.error('Nenhuma empresa selecionada.');
        return;
      }

      // Preparar os parâmetros para a chamada da API
      const params = {
        data_referencia: dataSelecionada,
        id_empresa: empresaId,
      };

      // Se adm for 0, passa o id_gestor
      if (adm === '0') {
        params.id_usuario = idGestor || undefined; // Adiciona o id_usuario se 'adm' for 0
      }

      const response = await axios.get(`https://jlwb9ldard.execute-api.us-east-1.amazonaws.com/dev/resumo-previsto`, {
        params: params,
      });

      setResumo(response.data);
    } catch (error) {
      console.error('Erro ao carregar os dados:', error);
    }
  };

  // Função para aplicar os filtros locais nos dados
  const aplicarFiltros = () => {
    return resumo.filter((item) => {
      const filtroDepartamento = filtros.departamento
        ? (item.descricao || '').toLowerCase().includes(filtros.departamento.toLowerCase())
        : true;

      const filtroNivel1 = filtros.nivel1
        ? (item.nivel_departamento_1 || '').toLowerCase().includes(filtros.nivel1.toLowerCase())
        : true;

      const filtroNivel2 = filtros.nivel2
        ? (item.nivel_departamento_2 || '').toLowerCase().includes(filtros.nivel2.toLowerCase())
        : true;

      const filtroGestor = filtros.gestor
        ? (item.gestor || '').toLowerCase().includes(filtros.gestor.toLowerCase())
        : true;

      // Filtro de diferença
      let filtroDiferenca = true;
      if (filtros.diferenca === 'SEM DIFERENÇA') {
        filtroDiferenca = item.Diferenca === 0;
      } else if (filtros.diferenca === 'COM VAGAS') {
        filtroDiferenca = item.Diferenca > 0;
      } else if (filtros.diferenca === 'EXCEDENTE AO PREVISTO') {
        filtroDiferenca = item.Diferenca < 0;
      }

      return filtroDepartamento && filtroNivel1 && filtroNivel2 && filtroGestor && filtroDiferenca;
    });
  };

  const dadosFiltrados = aplicarFiltros();

  return (
    <Box style={{ display: 'flex', flexDirection: 'column', padding: '10px' }}>
      <Grid container>
        <Typography style={{ display: 'flex', padding: '3px', fontSize: '1.2Rem' }}>Comparativo de Previsão</Typography>
      </Grid>
      {/* Linha de Filtros */}
      <Grid container justifyContent="space-between" wrap="nowrap" mb={1} style={{ marginTop: '10px', marginBottom: '5px', gap: '5px' }}>
        <Grid item xs={12} sm={2}>
          <TextField
            label="Departamento"
            variant="outlined"
            fullWidth
            value={filtros.departamento}
            onChange={(e) => setFiltros({ ...filtros, departamento: e.target.value })}
            InputProps={{
              style: {
                height: '4vh',
                display: 'flex',
                alignItems: 'center',
              },
              inputProps: {
                style: {
                  height: '3vh',
                  padding: '0 2px',
                  display: 'flex',
                  alignItems: 'center',
                },
              },
            }}
            InputLabelProps={{
              style: { lineHeight: '0.85rem' },
            }}
          />
        </Grid>
        <Grid item xs={12} sm={2}>
          <TextField
            label="Nível Departamento 1"
            variant="outlined"
            fullWidth
            value={filtros.nivel1}
            onChange={(e) => setFiltros({ ...filtros, nivel1: e.target.value })}
            InputProps={{
              style: {
                height: '4vh',
                display: 'flex',
                alignItems: 'center',
              },
              inputProps: {
                style: {
                  height: '3vh',
                  padding: '0 2px',
                  display: 'flex',
                  alignItems: 'center',
                },
              },
            }}
            InputLabelProps={{
              style: { lineHeight: '0.85rem' },
            }}
          />
        </Grid>
        <Grid item xs={12} sm={2}>
          <TextField
            label="Nível Departamento 2"
            variant="outlined"
            fullWidth
            value={filtros.nivel2}
            onChange={(e) => setFiltros({ ...filtros, nivel2: e.target.value })}
            InputProps={{
              style: {
                height: '4vh',
                display: 'flex',
                alignItems: 'center',
              },
              inputProps: {
                style: {
                  height: '3vh',
                  padding: '0 2px',
                  display: 'flex',
                  alignItems: 'center',
                },
              },
            }}
            InputLabelProps={{
              style: { lineHeight: '0.85rem' },
            }}
          />
        </Grid>
        <Grid item xs={12} sm={2}>
          <TextField
            label="Gestor"
            variant="outlined"
            fullWidth
            value={filtros.gestor}
            onChange={(e) => setFiltros({ ...filtros, gestor: e.target.value })}
            InputProps={{
              style: {
                height: '4vh',
                display: 'flex',
                alignItems: 'center',
              },
              inputProps: {
                style: {
                  height: '3vh',
                  padding: '0 2px',
                  display: 'flex',
                  alignItems: 'center',
                },
              },
            }}
            InputLabelProps={{
              style: { lineHeight: '0.85rem' },
            }}
          />
        </Grid>
        <Grid item xs={12} sm={2}>
          <FormControl fullWidth variant="outlined" style={{ height: '4vh' }}>
            <InputLabel id="filtro-diferenca-label" style={{ fontSize: '0.85rem' }}>Diferença</InputLabel>
            <Select
              labelId="filtro-diferenca-label"
              label="Diferença"
              value={filtros.diferenca}
              onChange={(e) => setFiltros({ ...filtros, diferenca: e.target.value })}
              style={{ fontSize: '0.85rem', height: '4vh', display: 'flex', alignItems: 'center' }}
            >
              <MenuItem value="TODOS">Todos</MenuItem>
              <MenuItem value="SEM DIFERENÇA">Sem Diferença (0)</MenuItem>
              <MenuItem value="COM VAGAS">Com Vagas (Diferença &gt; 0)</MenuItem>
              <MenuItem value="EXCEDENTE AO PREVISTO">Excedente ao Previsto (Diferença &lt; 0)</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={1}>
          <IconButton onClick={carregarResumo} color="primary" size="large" style={{ fontSize: '0.85rem', height: '4vh', display: 'flex', alignItems: 'center' }}>
            <CachedIcon />
          </IconButton>
        </Grid>
      </Grid>

      {/* Tabela de Resultados */}
      <TableContainer component={Paper} style={{ marginTop: '5px', overflow: 'visible', paddingBottom: '50px' }}>
        <Table>
          <TableHead style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor: '#1976d2' }}>
            <TableRow>
              <TableCell style={{ color: '#fff', fontWeight: 'bold', height: '25px', padding: '5px' }}>DEPARTAMENTO</TableCell>
              <TableCell style={{ color: '#fff', fontWeight: 'bold', height: '25px', padding: '5px' }}>AGRUPAMENTO</TableCell>
              <TableCell style={{ color: '#fff', fontWeight: 'bold', height: '25px', padding: '5px' }}>GESTOR</TableCell>
              <TableCell style={{ color: '#fff', fontWeight: 'bold', height: '25px', padding: '5px', textAlign: 'center' }}>PREVISTO</TableCell>
              <TableCell style={{ color: '#fff', fontWeight: 'bold', height: '25px', padding: '5px', textAlign: 'center' }}>REALIZADO</TableCell>
              <TableCell style={{ color: '#fff', fontWeight: 'bold', height: '25px', padding: '5px', textAlign: 'center' }}>DIFERENÇA</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dadosFiltrados.map((row, index) => (
              <TableRow key={index} style={{ height: '25px', cursor: 'pointer' }}>
                <TableCell style={{ height: '25px', padding: '5px' }}>{row.descricao}</TableCell>
                <TableCell style={{ height: '25px', padding: '5px' }}>{row.nivel_departamento_2 || 'Sem Nível 2'}</TableCell>
                <TableCell style={{ height: '25px', padding: '5px' }}>{row.gestor || 'Sem Gestor'}</TableCell>
                <TableCell style={{ height: '25px', padding: '5px', textAlign: 'center' }}>{row.Previsto}</TableCell>
                <TableCell style={{ height: '25px', padding: '5px', textAlign: 'center' }}>{row.Realizado}</TableCell>
                <TableCell style={{ height: '25px', padding: '5px', textAlign: 'center' }}>{row.Diferenca}</TableCell>
              </TableRow>
            ))}
            <TableRow style={{ backgroundColor: '#ffeb3b', height: '25px' }}>
              <TableCell colSpan={3} style={{ height: '25px', padding: '5px' }}><b>Total</b></TableCell>
              <TableCell style={{ height: '25px', padding: '5px', textAlign: 'center' }}>{dadosFiltrados.reduce((acc, curr) => acc + curr.Previsto, 0)}</TableCell>
              <TableCell style={{ height: '25px', padding: '5px', textAlign: 'center' }}>{dadosFiltrados.reduce((acc, curr) => acc + curr.Realizado, 0)}</TableCell>
              <TableCell style={{ height: '25px', padding: '5px', textAlign: 'center' }}>{dadosFiltrados.reduce((acc, curr) => acc + curr.Diferenca, 0)}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      {/* Rodapé com as somas */}
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
          boxShadow: '0px -4px 10px rgba(0, 0, 0, 0.1)', // Adiciona a sombra no topo
        }}
      >
        <Container style={{ display: 'flex', justifyContent: 'space-between', padding: 0 }}>
          <Typography variant="h6">
            <strong>Previstos: {dadosFiltrados.reduce((acc, curr) => acc + curr.Previsto, 0)}</strong>
          </Typography>
          <Typography variant="h6">
            <strong>Realizados: {dadosFiltrados.reduce((acc, curr) => acc + curr.Realizado, 0)}</strong>
          </Typography>
          <Typography variant="h6">
            <strong>Diferença: {dadosFiltrados.reduce((acc, curr) => acc + curr.Diferenca, 0)}</strong>
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default ResumoQuadroPrevisto;
