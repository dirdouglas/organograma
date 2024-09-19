// src/ativos/TabelaAtivos.js

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

const TabelaAtivos = ({ filteredData }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(16);
  const [localData, setLocalData] = useState([]);

  useEffect(() => {
    setLocalData(filteredData);
    setPage(0);
  }, [filteredData]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 16));
    setPage(0);
  };

  // Obter os dados da página atual
  const paginatedData = localData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Paper style={{ marginBottom: '20px', marginTop: '2px' }}>
      <TableContainer component={Paper} style={{ fontSize: '0.3rem', maxHeight: 435 }}>
        <Table stickyHeader>
          <TableHead stickyHeader>
            <TableRow>
              <TableCell style={headStyle}>Nome do Colaborador</TableCell>
              <TableCell style={headStyle}>Matrícula</TableCell>
              <TableCell style={headStyle}>Função</TableCell>
              <TableCell style={headStyle}>Departamento</TableCell>
              <TableCell style={headStyle}>Data de Admissão</TableCell>
              <TableCell style={headStyle}>Data de Demissão</TableCell>
              <TableCell style={headStyle}>Situação</TableCell>
              <TableCell style={headStyle}>Tipo de Contrato</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.map((row) => (
              <TableRow key={row.id_funcionario}>
                <TableCell style={rowStyle}>{row.nome_colaborador}</TableCell>
                <TableCell style={rowStyle}>{row.matricula}</TableCell>
                <TableCell style={rowStyle}>{row.descricao_funcao}</TableCell>
                <TableCell style={rowStyle}>{row.descricao_departamento}</TableCell>
                <TableCell style={rowStyle}>{new Date(row.data_admissao).toLocaleDateString()}</TableCell>
                <TableCell style={rowStyle}>{row.data_demissao ? new Date(row.data_demissao).toLocaleDateString() : 'Ativo'}</TableCell>
                <TableCell style={rowStyle}>{row.descricao_situacao}</TableCell>
                <TableCell style={rowStyle}>{row.tipo_contrato}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[16, 50, 100]}
        component="div"
        count={localData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

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
  height: '25px',
};

export default TabelaAtivos;
