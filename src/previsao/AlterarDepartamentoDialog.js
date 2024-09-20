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
import { listarDepartamentos, alterarDepartamento } from './Api'; // Importa a função de alterar o departamento
import { EmpresaContext } from '../EmpresaContext'; // Importa o contexto da empresa

const AlterarDepartamentoDialog = ({ 
  open, 
  onClose, 
  selectedRow, 
  fetchData 
}) => {
  const [departamentos, setDepartamentos] = useState([]); // Estado para armazenar os departamentos
  const [departamentoSelecionado, setDepartamentoSelecionado] = useState(null);
  const { empresaId } = useContext(EmpresaContext); // Obtém o ID da empresa do contexto

  // Função para salvar o departamento selecionado
  const handleSaveDepartamento = async () => {
    if (selectedRow && departamentoSelecionado) {
      try {
        // Chama a função de alterar departamento no Api.js, passando o `id`
        await alterarDepartamento(selectedRow.id, departamentoSelecionado.id);

        onClose(); // Fecha o diálogo
        fetchData(empresaId); // Recarrega os dados após a alteração
      } catch (error) {
        console.error('Erro ao salvar o departamento:', error);
      }
    }
  };

  // Função para carregar os departamentos da API
  const carregarDepartamentos = async () => {
    try {
      const departamentosCarregados = await listarDepartamentos(empresaId); // Chama a função para listar departamentos
      setDepartamentos(departamentosCarregados); // Armazena os departamentos no estado
    } catch (error) {
      console.error('Erro ao carregar os departamentos:', error);
    }
  };

  // Hook para carregar os departamentos quando o diálogo for aberto
  useEffect(() => {
    if (open) {
      carregarDepartamentos();
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
      <DialogTitle>Alterar Departamento Previsto</DialogTitle>
      <DialogContent>
        <Autocomplete
          options={departamentos} // Lista de departamentos carregados da API
          getOptionLabel={(option) => `${option.codigo} - ${option.descricao}`} // Exibe o código e a descrição
          isOptionEqualToValue={(option, value) => option.codigo === value.codigo} // Compara pelo código do departamento
          renderInput={(params) => (
            <TextField 
              {...params} 
              label="Selecione o Departamento" 
              variant="outlined" 
              fullWidth 
            />
          )}
          value={departamentoSelecionado}
          onChange={(event, newValue) => {
            if (newValue) {
              setDepartamentoSelecionado({
                id: newValue.id, // ID do departamento selecionado
                codigo: newValue.codigo, // Código do departamento selecionado
                descricao: newValue.descricao, // Descrição do departamento selecionado
              });
            } else {
              setDepartamentoSelecionado(null);
            }
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancelar
        </Button>
        <Button onClick={handleSaveDepartamento} color="primary" variant="contained">
          Salvar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AlterarDepartamentoDialog;
