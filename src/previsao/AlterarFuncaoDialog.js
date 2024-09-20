import React, { useState, useEffect, useContext } from 'react';
import {
  TextField,
  Autocomplete,
  DialogContent,
  DialogActions,
  Button,
  Dialog,
  DialogTitle,
} from '@mui/material';
import { listarFuncoes, alterarFuncao } from './Api'; // Importar as funções da API
import { EmpresaContext } from '../EmpresaContext'; // Importar o contexto da empresa

const AlterarFuncaoDialog = ({ 
  open, 
  onClose, 
  selectedRow, 
  fetchData 
}) => {
  const [funcoes, setFuncoes] = useState([]); // Armazena as funções carregadas
  const [funcaoSelecionada, setFuncaoSelecionada] = useState(null);
  const { empresaId } = useContext(EmpresaContext); // Obtém o ID da empresa do contexto

  // Função para salvar a função selecionada
  const handleSaveFuncao = async () => {
    if (selectedRow && funcaoSelecionada) {
      try {
        // Chama a função de alterar função no Api.js
        await alterarFuncao(selectedRow.id, funcaoSelecionada.id);

        onClose(); // Fecha o diálogo
        fetchData(empresaId); // Recarrega os dados após a alteração
      } catch (error) {
        console.error('Erro ao salvar a função:', error);
      }
    }
  };

  // Função para carregar as funções da API
  const carregarFuncoes = async () => {
    try {
      const funcoesCarregadas = await listarFuncoes(empresaId); // Chama a função para listar funções
      setFuncoes(funcoesCarregadas); // Armazena as funções no estado
    } catch (error) {
      console.error('Erro ao carregar as funções:', error);
    }
  };

  // Hook para carregar as funções quando o diálogo for aberto
  useEffect(() => {
    if (open) {
      carregarFuncoes();
    }
  }, [open, empresaId]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        style: {
          width: '30vw',
        },
      }}
    >
      <DialogTitle>Alterar Função Prevista</DialogTitle>
      <DialogContent>
        <Autocomplete
          options={funcoes} // Lista de funções carregadas da API
          getOptionLabel={(option) => `${option.codigo} - ${option.descricao}`} // Exibe o código e a descrição
          isOptionEqualToValue={(option, value) => option.codigo === value.codigo} // Compara pelo código da função
          renderInput={(params) => (
            <TextField 
              {...params} 
              label="Selecione a Função" 
              variant="outlined" 
              fullWidth 
            />
          )}
          value={funcaoSelecionada}
          onChange={(event, newValue) => {
            if (newValue) {
              setFuncaoSelecionada({
                id: newValue.id, // ID da função selecionada
                codigo: newValue.codigo, // Código da função selecionada
                descricao: newValue.descricao, // Descrição da função selecionada
              });
            } else {
              setFuncaoSelecionada(null);
            }
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancelar
        </Button>
        <Button onClick={handleSaveFuncao} color="primary" variant="contained">
          Salvar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AlterarFuncaoDialog;
