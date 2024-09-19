import React, { useState, useEffect, useContext } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';
import { preverDemissaoApi } from './Api'; // Usando a API de prever demissão
import { EmpresaContext } from '../EmpresaContext'; // Usando o contexto da empresa

// Função auxiliar para formatar a data no formato YYYY-MM-DD
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const PreverDemissao = ({ open, onClose, row, setRow, fetchData }) => {
  const { empresaId } = useContext(EmpresaContext);
  const [dataDemissao, setDataDemissao] = useState('');
  const [ ,setPrevDemissao] = useState(0); // Usar 0 ou 1 conforme a lógica

  useEffect(() => {
    if (row && row.data_demissao) {
      setDataDemissao(formatDate(row.data_demissao));
      setPrevDemissao(1); // Quando há uma demissão prevista, prevDemissao será 1
    } else {
      setDataDemissao('');
      setPrevDemissao(0); // Sem demissão, prevDemissao será 0
    }
  }, [row]);

  // Certifique-se de que o row.id é passado corretamente
  const handleClearDate = async () => {
    try {
      await preverDemissaoApi(row.id, null, 0); // Remove a demissão

      // Atualiza localmente a linha com demissão removida
      setRow({ ...row, data_demissao: null, prev_demissao: 0 });

      // Recarrega os dados do backend para garantir sincronização
      if (fetchData) {
        fetchData(empresaId);
      }

      onClose(); // Fecha o modal
    } catch (error) {
      console.error('Erro ao prever demissão:', error);
    }
  };

  // Certifique-se de que o row.id é passado corretamente
  const handleSave = async () => {
    try {
      await preverDemissaoApi(row.id, dataDemissao, 1); // Salva a demissão com nova data

      // Atualiza localmente a linha com nova data de demissão
      setRow({ ...row, data_demissao: dataDemissao, prev_demissao: 1 });

      // Recarrega os dados do backend para garantir sincronização
      if (fetchData) {
        fetchData(empresaId);
      }

      onClose(); // Fecha o modal
    } catch (error) {
      console.error('Erro ao prever demissão:', error);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      PaperProps={{
        style: {
          width: '30vw', 
          padding: '10px', 
        },
      }}
    >
      <DialogTitle>Prever Demissão</DialogTitle>
      <DialogContent>
        <TextField
          label="Data de Demissão"
          type="date"
          fullWidth
          InputLabelProps={{
            shrink: true,
          }}
          value={dataDemissao || ''} 
          onChange={(e) => setDataDemissao(e.target.value)}
          style={{ width: '100%' }}  
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">Cancelar</Button>
        <Button onClick={handleClearDate} color="primary">Remover Data</Button>
        <Button onClick={handleSave} color="primary">Salvar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default PreverDemissao;
