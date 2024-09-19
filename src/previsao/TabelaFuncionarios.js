import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, TablePagination } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import InfoIcon from '@mui/icons-material/Info';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import DeleteIcon from '@mui/icons-material/Delete';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import { confirmarPrevisaoApi, deletePrevisaoApi } from './Api'; // Importando as funções da API
import AlterarJustificativa from './AlterarJustificativa'; // Importando o diálogo de justificativa
import PreverDemissao from './PreverDemissao'; // Importando o diálogo de previsão de demissão
import DeletePrevisao from './DeletePrevisao'; // Importando o diálogo de exclusão
import NovaVaga from './NovaVaga';

const TabelaFuncionarios = ({ filteredData, fetchData }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(13);
  const [localData, setLocalData] = useState([]); // Estado local para armazenar os dados passados
  const [openJustificativaDialog, setOpenJustificativaDialog] = useState(false);
  const [openDemissaoDialog, setOpenDemissaoDialog] = useState(false); // Estado para o diálogo de demissão
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false); // Estado para o diálogo de exclusão
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

  // Função para alterar a página
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Função para alterar o número de linhas por página
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Função para definir a cor das linhas com base nos dados
  const getRowColor = (row) => {
    if (row.prev_confirmada === 1 && row.prev_demissao === 1) {
      return '#ffcccc'; // Colaborador demitido
    } else if (row.prev_confirmada === 1 && row.prev_vaga === 1) {
      return '#cce5ff'; // Vaga aberta
    } else if (row.prev_confirmada === 1) {
      return '#ccffcc'; // Previsão confirmada
    } else {
      return 'inherit'; // Padrão
    }
  };

  // Função para confirmar previsão e atualizar a tabela
  const confirmarPrevisao = async (row) => {
    try {
      const novoValorConfirmacao = row.prev_confirmada === 1 ? 0 : 1;
      await confirmarPrevisaoApi(row.id, novoValorConfirmacao);

      // Atualiza localmente a linha alterada
      setLocalData((prevData) =>
        prevData.map((r) => (r.id === row.id ? { ...r, prev_confirmada: novoValorConfirmacao } : r))
      );
    } catch (error) {
      console.error('Erro ao confirmar a previsão:', error);
    }
  };

  // Função para abrir o diálogo de justificativa
  const handleClickOpenJustificativaDialog = (row) => {
    setSelectedRow(row);
    setOpenJustificativaDialog(true);
  };

  // Função para abrir o diálogo de demissão
  const handleClickOpenDemissaoDialog = (row) => {
    setSelectedRow(row);
    setOpenDemissaoDialog(true);
  };

  // Função para abrir o diálogo de exclusão
  const handleDeletePrevisao = (row) => {
    setSelectedRow(row);
    setOpenDeleteDialog(true);
  };

  // Função para confirmar a exclusão da previsão
  const confirmDeletePrevisao = async () => {
    if (!selectedRow) return;

    try {
      await deletePrevisaoApi(selectedRow.id); // Excluir a previsão

      // Atualiza a lista de dados após a exclusão
      fetchData();
      setOpenDeleteDialog(false);
      setSelectedRow(null);
    } catch (error) {
      console.error('Erro ao excluir a previsão:', error);
    }
  };

  // Atualizar localData quando filteredData mudar
  useEffect(() => {
    setLocalData(filteredData);
    setPage(0);
  }, [filteredData]);

  // Função para atualizar a linha inteira localmente
  const setRow = (updatedRow) => {
    setLocalData((prevData) =>
      prevData.map((row) => {
        if (row.id === updatedRow.id) {
          return {
            ...row, // Preserva todos os campos anteriores
            ...updatedRow, // Sobrescreve com os dados novos de updatedRow
          };
        }
        return row; // Retorna a linha original se o ID não for o mesmo
      })
    );
  };

  // Atualizar justificativa diretamente no localData sem fetch
  const atualizarJustificativaLocal = (justificativa) => {
    setLocalData((prevData) =>
      prevData.map((row) => (row.id === selectedRow.id ? { ...row, justificativa } : row))
    );
  };

  // Obter os dados da página atual
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
              <TableCell style={headStyle}>Departamento</TableCell>
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
                <TableCell style={rowClickableStyle} onClick={() => confirmarPrevisao(row)}>
                  {row.descricao_funcao_prevista}
                </TableCell>
                <TableCell style={rowClickableStyle}>{row.descricao_departamento}</TableCell>
                <TableCell style={rowStyle}>{new Date(row.data_contratacao).toLocaleDateString()}</TableCell>
                <TableCell style={rowStyle}>
                  {row.data_demissao ? new Date(row.data_demissao).toLocaleDateString() : ''}
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

      {/* Componente de paginação */}
      <TablePagination
        rowsPerPageOptions={[13, 50, 100]}
        component="div"
        count={localData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {/* Diálogo de justificativa */}
      {selectedRow && (
        <AlterarJustificativa
          open={openJustificativaDialog}
          onClose={() => setOpenJustificativaDialog(false)}
          row={selectedRow}
          setRow={setRow}
          atualizarJustificativaLocal={atualizarJustificativaLocal}
        />
      )}

      {/* Diálogo de demissão */}
      {selectedRow && (
        <PreverDemissao
          open={openDemissaoDialog}
          onClose={() => setOpenDemissaoDialog(false)}
          row={selectedRow}
          setRow={setRow}
        />
      )}

      {/* Diálogo de exclusão */}
      {selectedRow && (
        <DeletePrevisao
          open={openDeleteDialog}
          onClose={() => setOpenDeleteDialog(false)}
          onDelete={confirmDeletePrevisao}
        />
      )}

      {/* Diálogo de exclusão */}
      {selectedRow && (
        <NovaVaga
          open={openVagaDialog}
          onClose={handleCloseVagaDialog}
          fetchData={fetchData}
          duplicarRegistro={true} // Passando como duplicação de registro
          row={selectedRow}  // Passando a linha selecionada
        />
      )}

    </Paper>
  );
};

// Estilos ajustados
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
