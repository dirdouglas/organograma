import React, { useState } from 'react';
import { 
  confirmarPrevisao as confirmarPrevisaoApi, 
  excluirPrevisao as deletarPrevisaoApi, 
  alterarPrevisao as duplicarPrevisaoApi 
} from './Api';  
import AlterarDepartamentoDialog from './AlterarDepartamentoDialog';
import AlterarFuncaoDialog from './AlterarFuncaoDialog';

const AjustesPrevisao = ({ fetchData, empresaId, departamentos, funcoes }) => {
  const [selectedRow, setSelectedRow] = useState(null);
  const [openDialogDepartamento, setOpenDialogDepartamento] = useState(false); 
  const [openDialogFuncao, setOpenDialogFuncao] = useState(false);

  const handleClickOpenDialogDepartamento = (row) => {
    setSelectedRow(row);
    setOpenDialogDepartamento(true); 
  };

  const handleClickOpenDialogFuncao = (row) => {
    setSelectedRow(row);
    setOpenDialogFuncao(true); 
  };

  const confirmarPrevisao = async (row) => {
    try {
      // Cria o corpo no formato que a API espera
      const requestBody = {
        action: 'confirmar_previsao',
        id: String(row.id),  // Converte o id para string
        prev_confirmada: row.prev_confirmada === 1 ? 0 : 1  // Alterna entre 0 e 1
      };
  
      // Envia o JSON no formato correto com apenas um JSON.stringify
      await confirmarPrevisaoApi({
        body: JSON.stringify(requestBody)  // Apenas stringificando o conteúdo do body
      });
  
      fetchData(empresaId);  // Atualiza a lista após a confirmação
    } catch (error) {
      console.error('Erro ao confirmar a previsão:', error);
    }
  };
  
  
  
  const handleDeletePrevisao = async (row) => {
    try {
      await deletarPrevisaoApi(row.id);
      fetchData(empresaId);  
    } catch (error) {
      console.error('Erro ao excluir previsão:', error);
    }
  };

  const duplicarPrevisao = async (row) => {
    setSelectedRow(row);
    try {
      await duplicarPrevisaoApi(row);
      fetchData(empresaId);  
    } catch (error) {
      console.error('Erro ao duplicar a previsão:', error);
    }
  };

  const handleClickOpenDemissaoDialog = (row) => {
    setSelectedRow(row);
    // Lógica para abrir o diálogo de demissão
  };

  return {
    handleClickOpenDialogDepartamento,
    handleClickOpenDialogFuncao,
    confirmarPrevisao,
    handleDeletePrevisao,
    duplicarPrevisao,
    handleClickOpenDemissaoDialog,  // Retornar todas as funções que serão usadas externamente
  };
};

export default AjustesPrevisao;
