import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, TablePagination } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import { confirmarPrevisaoApi } from './Api';
import AlterarDepartamentoDialog from './AlterarDepartamentoDialog';  // Importando o diálogo de departamento
import AlterarFuncaoDialog from './AlterarFuncaoDialog';  // Importando o diálogo de função

const TabelaFuncionarios = ({ filteredData, fetchData, departamentos = [], funcoes = [] }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(13);
  const [localData, setLocalData] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [openDepartamentoDialog, setOpenDepartamentoDialog] = useState(false);
  const [openFuncaoDialog, setOpenFuncaoDialog] = useState(false);

  // Função para abrir o diálogo de alteração de departamento
  const handleOpenDepartamentoDialog = (row) => {
    setSelectedRow(row);
    setOpenDepartamentoDialog(true);
  };

  // Função para abrir o diálogo de alteração de função
  const handleOpenFuncaoDialog = (row) => {
    setSelectedRow(row);
    setOpenFuncaoDialog(true);
  };

  const handleCloseDepartamentoDialog = () => {
    setOpenDepartamentoDialog(false);
    setSelectedRow(null);
  };

  const handleCloseFuncaoDialog = () => {
    setOpenFuncaoDialog(false);
    setSelectedRow(null);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Função para definir a cor das linhas
  const getRowColor = (row) => {
    if (row.prev_confirmada === 1 && row.prev_demissao === 1) {
      return '#ffcccc'; 
    } else if (row.prev_confirmada === 1 && row.prev_vaga === 1) {
      return '#cce5ff'; 
    } else if (row.prev_confirmada === 1) {
      return '#ccffcc'; 
    } else {
      return 'inherit'; 
    }
  };

  // Função para confirmar a previsão de funcionário
  const confirmarPrevisao = async (row) => {
    try {
      const novoValorConfirmacao = row.prev_confirmada === 1 ? 0 : 1;
      await confirmarPrevisaoApi(row.id, novoValorConfirmacao);
      setLocalData((prevData) =>
        prevData.map((r) => (r.id === row.id ? { ...r, prev_confirmada: novoValorConfirmacao } : r))
      );
    } catch (error) {
      console.error('Erro ao confirmar a previsão:', error);
    }
  };

  useEffect(() => {
    setLocalData(filteredData);
    setPage(0);
  }, [filteredData]);

  // Função para renderizar a tabela com paginação
  const paginatedData = localData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Paper style={{ marginBottom: '20px', marginTop: '2px' }}>
      <TableContainer component={Paper} style={{ fontSize: '0.3rem', maxHeight: 455 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow style={{ backgroundColor: '#1976d2', color: '#fff', height: '25px' }}>
              <TableCell style={headStyle}>Matrícula</TableCell>
              <TableCell style={headStyle}>Nome do Colaborador</TableCell>
              <TableCell style={headStyle}>Função Atual</TableCell>
              <TableCell style={headStyle}>Função Prevista</TableCell>
              <TableCell style={headStyle}>Departamento Previsto</TableCell>
              <TableCell style={headStyle}>Contratação</TableCell>
              <TableCell style={headStyle}>Demissão</TableCell>
              <TableCell style={headStyle}>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.map((row, index) => (
              <TableRow key={index} style={{ height: '25px', backgroundColor: getRowColor(row) }}>
                <TableCell style={rowStyle}>{row.matricula}</TableCell>
                <TableCell style={rowStyle}>{row.nome_colaborador}</TableCell>
                <TableCell style={rowStyle}>{row.descricao_funcao_atual}</TableCell>
                
                {/* Função Prevista - Abre o diálogo para alterar a função ao clicar */}
                <TableCell style={rowClickableStyle} onClick={() => handleOpenFuncaoDialog(row)}>
                  {row.descricao_funcao_prevista}
                </TableCell>

                {/* Departamento Previsto - Abre o diálogo para alterar o departamento ao clicar */}
                <TableCell style={rowClickableStyle} onClick={() => handleOpenDepartamentoDialog(row)}>
                  {row.descricao_departamento}
                </TableCell>

                <TableCell style={rowStyle}>{new Date(row.data_contratacao).toLocaleDateString()}</TableCell>
                <TableCell style={rowStyle}>
                  {row.data_demissao ? new Date(row.data_demissao).toLocaleDateString() : ''}
                </TableCell>
                <TableCell style={rowStyle}>
                  <IconButton onClick={() => confirmarPrevisao(row)}>
                    <CheckIcon style={{ fontSize: 15 }} />
                  </IconButton>
                  <IconButton>
                    <GroupAddIcon style={{ fontSize: 15 }} />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[13, 50, 100]}
        component="div"
        count={localData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {/* Diálogo de Alterar Departamento */}
      {selectedRow && (
        <AlterarDepartamentoDialog
          open={openDepartamentoDialog}
          onClose={handleCloseDepartamentoDialog}
          selectedRow={selectedRow}
          fetchData={fetchData}
          departamentos={departamentos || []}  // Removeu o comentário de bloco
        />
      )}

      {/* Diálogo de Alterar Função */}
      {selectedRow && (
        <AlterarFuncaoDialog
          open={openFuncaoDialog}
          onClose={handleCloseFuncaoDialog}
          selectedRow={selectedRow}
          fetchData={fetchData}
          funcoes={funcoes || []}  // Removeu o comentário de bloco
        />
      )}
    </Paper>
  );
};

// Estilos de cabeçalhos e células
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
  padding: 0,
  height: '25px',
};

const rowClickableStyle = {
  ...rowStyle,
  cursor: 'pointer',
};

export default TabelaFuncionarios;
