import React, { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, IconButton } from '@mui/material';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CheckIcon from '@mui/icons-material/Check';
import { makeStyles } from '@mui/styles';
import { confirmarPrevisao } from './Api'; // Função da API para confirmar a previsão

// Estilos para colorir as linhas
const useStyles = makeStyles({
  rowRed: {
    backgroundColor: '#ffcccc', // Cor de fundo para demissão confirmada
    color: 'red', // Cor do texto
  },
  rowBlue: {
    backgroundColor: '#cce5ff', // Cor de fundo para vaga confirmada
    color: 'blue',
  },
  rowGreen: {
    backgroundColor: '#ccffcc', // Cor de fundo para previsão confirmada
    color: 'green',
  },
});

const TabelaFuncionarios = ({ rows, handleDialogOpen, fetchData }) => {
  const classes = useStyles();
  const [pageSize, setPageSize] = useState(25); // Define o tamanho da página

  // Função para confirmar a previsão
  const handleConfirmPrevisao = async (row) => {
    try {
      await confirmarPrevisao(row.id); // Chamada à API para confirmar a previsão
      fetchData(); // Atualizar os dados após a confirmação
    } catch (error) {
      console.error('Erro ao confirmar a previsão:', error);
    }
  };

  // Função para definir a classe da linha com base nas condições
  const getRowClassName = (params) => {
    const { row } = params;

    if (row.prev_confirmada === 1 && row.prev_demissao === 1) {
      return classes.rowRed; // Demissão confirmada
    } else if (row.prev_confirmada === 1 && row.prev_vaga === 1) {
      return classes.rowBlue; // Vaga confirmada
    } else if (row.prev_confirmada === 1) {
      return classes.rowGreen; // Previsão confirmada
    }
    return ''; // Sem estilo especial
  };

  // Colunas do DataGrid
  const columns = [
    { field: 'matricula', headerName: 'MATRICULA', flex: 0.4 },
    { field: 'nome_colaborador', headerName: 'COLABORADOR', flex: 1.2 },
    { field: 'descricao_funcao_atual', headerName: 'FUNÇÃO ATUAL', flex: 1.3 },
    { field: 'descricao_funcao_prevista', headerName: 'FUNÇÃO PREVISTA', flex: 1.3 },
    { field: 'descricao_departamento', headerName: 'DEPARTAMENTO', flex: 1.3 },
    {
      field: 'data_contratacao',
      headerName: 'CONTRATAÇÃO',
      flex: 0.5,
      renderCell: (params) => <span>{new Date(params.value).toLocaleDateString()}</span>,
    },
    {
      field: 'data_demissao',
      headerName: 'DEMISSÃO',
      flex: 0.5,
      renderCell: (params) => <span>{params.value ? new Date(params.value).toLocaleDateString() : ''}</span>,
    },
    {
      field: 'actions',
      headerName: 'AÇÕES',
      flex: 0.5,
      renderCell: (params) => (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%', // Para garantir que os ícones fiquem centralizados verticalmente
          }}
        >
          {/* Botão para confirmar a previsão */}
          <IconButton onClick={() => handleConfirmPrevisao(params.row)}>
            <CheckIcon />
          </IconButton>

          {/* Duplicar previsão */}
          <IconButton onClick={() => handleDialogOpen(false, params.row)}>
            <GroupAddIcon />
          </IconButton>

          {/* Nova Vaga */}
          <IconButton onClick={() => handleDialogOpen(true)}>
            <AddCircleIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Box style={{ width: '100%', height: '600px' }}> {/* Definindo a altura fixa da tabela */}
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={25}
        rowsPerPageOptions={[]} // Desabilita a opção de escolher o número de linhas por página
        disableSelectionOnClick
        getRowId={(row) => row.id}
        getRowClassName={getRowClassName} // Aplicando a função para colorir as linhas
        rowHeight={30} // Definindo a altura da linha
        pagination // Habilitando a paginação
        autoHeight
        sx={{
          '& .MuiDataGrid-columnHeader': {
            background: '#1976d2', // Definindo a cor azul para o título
            color: '#fff',
            fontWeight: 'bold', // Negrito para destacar
            height: '35px !important',
          },
        }}
      />
    </Box>
  );
};

export default TabelaFuncionarios;
