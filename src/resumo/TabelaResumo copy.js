// src/resumo/TabelaResumo.js

import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
} from '@mui/material';
import axios from 'axios';
import dayjs from 'dayjs';

const TabelaResumo = ({ empresaId, idGestor, adm, dataSelecionada, setDadosFiltrados }) => {
  const [resumo, setResumo] = useState([]); // Dados retornados da API
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);

  useEffect(() => {
    if (empresaId) {
      carregarResumo();
    }
  }, [empresaId, idGestor, adm, dataSelecionada]);

  useEffect(() => {
    // Sempre que os dados forem carregados ou atualizados, filtrar e passar para o ResumoQuadroPrevisto
    setDadosFiltrados(resumo);
  }, [resumo, setDadosFiltrados]);

  const carregarResumo = async () => {
    try {
      const params = {
        data_referencia: dataSelecionada,
        id_empresa: empresaId,
      };

      if (adm === '0') {
        params.id_usuario = idGestor || undefined;
      }

      const response = await axios.get(`https://jlwb9ldard.execute-api.us-east-1.amazonaws.com/dev/resumo-previsto`, {
        params: params,
      });

      setResumo(response.data);
    } catch (error) {
      console.error('Erro ao carregar os dados:', error);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 20));
    setPage(0);
  };

  // Obter os dados da página atual
  const paginatedData = resumo.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Paper style={{ marginBottom: '20px', marginTop: '2px' }}>
      <TableContainer component={Paper} style={{ fontSize: '0.3rem', maxHeight: 505 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell style={headStyle}>Departamento</TableCell>
              <TableCell style={headStyle}>Agrupamento</TableCell>
              <TableCell style={headStyle}>Gestor</TableCell>
              <TableCell style={headStyle} align="center">Previsto</TableCell>
              <TableCell style={headStyle} align="center">Realizado</TableCell>
              <TableCell style={headStyle} align="center">Diferença</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.map((row, index) => (
              <TableRow key={index}>
                <TableCell style={rowStyle}>{row.descricao}</TableCell>
                <TableCell style={rowStyle}>{row.nivel_departamento_2 || 'Sem Nível 2'}</TableCell>
                <TableCell style={rowStyle}>{row.gestor || 'Sem Gestor'}</TableCell>
                <TableCell style={rowStyle} align="center">{row.Previsto}</TableCell>
                <TableCell style={rowStyle} align="center">{row.Realizado}</TableCell>
                <TableCell style={rowStyle} align="center">{row.Diferenca}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[14, 50, 100]}
        component="div"
        count={resumo.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

// Estilos de cabeçalho e linha da tabela, herdados do TabelaAtivos.js
const headStyle = {
  backgroundColor: '#1976d2',
  color: '#fff',
  fontWeight: 'bold',
  textTransform: 'uppercase',
  padding: '5px',
  fontSize: '0.75rem',
  height: '10px',
};

const rowStyle = {
  fontSize: '0.75rem',
  padding: '3px 1px',
  height: '20px',
};

export default TabelaResumo;
