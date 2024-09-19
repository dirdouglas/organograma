import React, { useState } from 'react';
import axios from 'axios';
import {
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import CheckIcon from '@mui/icons-material/Check';
import AlterarDepartamentoDialog from './AlterarDepartamentoDialog';
import AlterarFuncaoDialog from './AlterarFuncaoDialog';

const AlteracoesFuncionario = ({ row, empresaFilter, fetchData, departamentos, funcoes }) => {
  const [openDialogDepartamento, setOpenDialogDepartamento] = useState(false);
  const [openDialogFuncao, setOpenDialogFuncao] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [openJustificativaDialog, setOpenJustificativaDialog] = useState(false);
  const [justificativaSelecionada, setJustificativaSelecionada] = useState('');

  const handleClickOpenDialogDepartamento = () => {
    setSelectedRow(row);
    setOpenDialogDepartamento(true);
  };

  const handleClickOpenDialogFuncao = () => {
    setSelectedRow(row);
    setOpenDialogFuncao(true);
  };

  const handleCloseDialogDepartamento = () => {
    setOpenDialogDepartamento(false);
  };

  const handleCloseDialogFuncao = () => {
    setOpenDialogFuncao(false);
  };

  const handleClickOpenJustificativaDialog = () => {
    setJustificativaSelecionada(row.justificativa || 'SEM JUSTIFICATIVA');
    setOpenJustificativaDialog(true);
  };

  const handleCloseJustificativaDialog = () => {
    setOpenJustificativaDialog(false);
    setJustificativaSelecionada('');
  };

  const confirmarPrevisao = async () => {
    try {
      const novoValorConfirmacao = row.prev_confirmada === 1 ? 0 : 1;

      const requestBody = {
        httpMethod: "POST",
        body: JSON.stringify({
          id: String(row.id),
          prev_confirmada: novoValorConfirmacao,
        }),
      };

      await axios.post(
        'https://2gfpdxjv31.execute-api.us-east-1.amazonaws.com/dev/altera-previsao',
        requestBody,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      fetchData(empresaFilter.id_empresa);
    } catch (error) {
      console.error('Erro ao confirmar a previsão:', error);
    }
  };

  return (
    <>
      <IconButton aria-label="Justificativa" onClick={handleClickOpenJustificativaDialog}>
        <InfoIcon />
      </IconButton>
      <IconButton aria-label="Confirmar Previsão" onClick={confirmarPrevisao}>
        <CheckIcon />
      </IconButton>

      <Dialog open={openDialogDepartamento} onClose={handleCloseDialogDepartamento}>
        <AlterarDepartamentoDialog
          open={openDialogDepartamento}
          onClose={handleCloseDialogDepartamento}
          selectedRow={selectedRow}
          fetchData={fetchData}
          empresaFilter={empresaFilter}
          departamentos={departamentos}
        />
      </Dialog>

      <Dialog open={openDialogFuncao} onClose={handleCloseDialogFuncao}>
        <AlterarFuncaoDialog
          open={openDialogFuncao}
          onClose={handleCloseDialogFuncao}
          selectedRow={selectedRow}
          fetchData={fetchData}
          empresaFilter={empresaFilter}
          funcoes={funcoes}
        />
      </Dialog>

      <Dialog open={openJustificativaDialog} onClose={handleCloseJustificativaDialog}>
        <DialogTitle>Justificativa</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            {justificativaSelecionada}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseJustificativaDialog} color="primary">
            Fechar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AlteracoesFuncionario;
