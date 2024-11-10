import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TablePagination,
  Tooltip,
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import InfoIcon from '@mui/icons-material/Info';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import DeleteIcon from '@mui/icons-material/Delete';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import { confirmarPrevisaoApi, deletePrevisaoApi } from './Api';
import AlterarJustificativa from './AlterarJustificativa';
import PreverDemissao from './PreverDemissao';
import DeletePrevisao from './DeletePrevisao';
import NovaVaga from './NovaVaga';
import AlterarDepartamentoDialog from './AlterarDepartamentoDialog';
import AlterarFuncaoDialog from './AlterarFuncaoDialog';

const TabelaFuncionarios = ({ filteredData, fetchData }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(13);
  const [localData, setLocalData] = useState([]);
  const [openJustificativaDialog, setOpenJustificativaDialog] = useState(false);
  const [openDemissaoDialog, setOpenDemissaoDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openDepartamentoDialog, setOpenDepartamentoDialog] = useState(false);
  const [openFuncaoDialog, setOpenFuncaoDialog] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [openVagaDialog, setOpenVagaDialog] = useState(false);

  const handleGroupAddClick = (row) => {
    setSelectedRow(row);
    setOpenVagaDialog(true);
  };

  const handleCloseVagaDialog = () => {
    setOpenVagaDialog(false);
    setSelectedRow(null);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

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

  const handleClickOpenJustificativaDialog = (row) => {
    setSelectedRow(row);
    setOpenJustificativaDialog(true);
  };

  const handleClickOpenDemissaoDialog = (row) => {
    setSelectedRow(row);
    setOpenDemissaoDialog(true);
  };

  const handleDeletePrevisao = (row) => {
    setSelectedRow(row);
    setOpenDeleteDialog(true);
  };

  const handleOpenDepartamentoDialog = (row) => {
    setSelectedRow(row);
    setOpenDepartamentoDialog(true);
  };

  const handleOpenFuncaoDialog = (row) => {
    setSelectedRow(row);
    setOpenFuncaoDialog(true);
  };

  const confirmDeletePrevisao = async () => {
    if (!selectedRow) return;

    try {
      await deletePrevisaoApi(selectedRow.id);
      fetchData().then(() => {
        setLocalData((prevData) => [...prevData]);
      });
      setOpenDeleteDialog(false);
      setSelectedRow(null);
    } catch (error) {
      console.error('Erro ao excluir a previsão:', error);
    }
  };

  useEffect(() => {
    setLocalData(filteredData);
  }, [filteredData]);

  const setRow = (updatedRow) => {
    setLocalData((prevData) =>
      prevData.map((row) => {
        if (row.id === updatedRow.id) {
          return {
            ...row,
            ...updatedRow,
          };
        }
        return row;
      })
    );
  };

  const atualizarJustificativaLocal = (justificativa) => {
    setLocalData((prevData) =>
      prevData.map((row) => (row.id === selectedRow.id ? { ...row, justificativa } : row))
    );
  };

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
              <TableCell style={headStyle} onClick={() => handleOpenFuncaoDialog(selectedRow)}>
                Função Prevista
              </TableCell>
              <TableCell style={headStyle} onClick={() => handleOpenDepartamentoDialog(selectedRow)}>
                Departamento
              </TableCell>
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
                <TableCell style={rowClickableStyle} onClick={() => handleOpenFuncaoDialog(row)}>
                  {row.descricao_funcao_prevista}
                </TableCell>
                <TableCell style={rowClickableStyle} onClick={() => handleOpenDepartamentoDialog(row)}>
                  {row.descricao_departamento}
                </TableCell>
                <TableCell style={rowStyle}>{new Date(row.data_contratacao).toLocaleDateString()}</TableCell>
                <TableCell style={rowStyle}>
                  {row.data_prevista_demissao ? new Date(row.data_prevista_demissao).toLocaleDateString() : ''}
                  {row.data_demissao && (
                    <Tooltip title={`Data de Demissão: ${new Date(row.data_demissao).toLocaleDateString()}`}>
                      <IconButton style={{ padding: 0, marginLeft: '5px' }}>
                        <InfoIcon style={{ fontSize: 15 }} />
                      </IconButton>
                    </Tooltip>
                  )}
                </TableCell>
                <TableCell style={rowStyle}>
                  <IconButton onClick={() => confirmarPrevisao(row)}>
                    <CheckIcon style={{ fontSize: 15 }} />
                  </IconButton>
                  <IconButton onClick={() => handleClickOpenJustificativaDialog(row)}>
                    <InfoIcon style={{ fontSize: 15 }} />
                  </IconButton>
                  <IconButton onClick={() => handleClickOpenDemissaoDialog(row)}>
                    <PersonRemoveIcon style={{ fontSize: 15 }} />
                  </IconButton>
                  <IconButton onClick={() => handleDeletePrevisao(row)}>
                    <DeleteIcon style={{ fontSize: 15 }} />
                  </IconButton>
                  <IconButton onClick={() => handleGroupAddClick(row)}>
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

      {selectedRow && (
        <AlterarJustificativa
          open={openJustificativaDialog}
          onClose={() => setOpenJustificativaDialog(false)}
          row={selectedRow}
          setRow={setRow}
          atualizarJustificativaLocal={atualizarJustificativaLocal}
        />
      )}
      {selectedRow && (
        <PreverDemissao
          open={openDemissaoDialog}
          onClose={() => setOpenDemissaoDialog(false)}
          row={selectedRow}
          setRow={setRow}
        />
      )}
      {selectedRow && (
        <DeletePrevisao
          open={openDeleteDialog}
          onClose={() => setOpenDeleteDialog(false)}
          onDelete={confirmDeletePrevisao}
        />
      )}
      {selectedRow && (
        <NovaVaga
          open={openVagaDialog}
          onClose={handleCloseVagaDialog}
          fetchData={fetchData}
          duplicarRegistro={true}
          row={selectedRow}
        />
      )}
      {selectedRow && (
        <AlterarDepartamentoDialog
          open={openDepartamentoDialog}
          onClose={() => setOpenDepartamentoDialog(false)}
          selectedRow={selectedRow}
          fetchData={fetchData}
        />
      )}
      {selectedRow && (
        <AlterarFuncaoDialog
          open={openFuncaoDialog}
          onClose={() => setOpenFuncaoDialog(false)}
          selectedRow={selectedRow}
          fetchData={fetchData}
        />
      )}
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
  padding: 0,
  height: '25px',
};

const rowClickableStyle = {
  ...rowStyle,
  cursor: 'pointer',
};

export default TabelaFuncionarios;
