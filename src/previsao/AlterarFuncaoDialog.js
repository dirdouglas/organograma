import React, { useState, useContext } from 'react';
import {
  TextField,
  Autocomplete,
  DialogContent,
  DialogActions,
  Button,
  Dialog,
  DialogTitle,
} from '@mui/material';
import axios from 'axios';
import { EmpresaContext } from '../EmpresaContext'; // Importa o contexto

const AlterarFuncaoDialog = ({ 
  open, 
  onClose, 
  selectedRow, 
  fetchData, 
  funcoes // Agora recebemos as funções como prop
}) => {
  const [funcaoSelecionada, setFuncaoSelecionada] = useState(null);
  const { empresaId } = useContext(EmpresaContext); // Pega empresaId diretamente do contexto

  const handleSaveFuncao = async () => {
    if (selectedRow && funcaoSelecionada) {
      try {
        // Construir o corpo da requisição no formato necessário
        const requestBody = {
          httpMethod: "POST",
          body: JSON.stringify({
            id: String(selectedRow.id),  // Matricula do funcionário (id_funcionario)
            id_funcao_prevista: funcaoSelecionada.id_funcao, // ID da função selecionada
          }),
        };
  
        // Enviar a requisição POST com o formato correto
        await axios.post(
          'https://44d5uoizbg.execute-api.us-east-1.amazonaws.com/dev/listar-funcoes', // Substitua pela URL da sua API Lambda
          requestBody,
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );
  
        onClose(); // Fecha o dialog
        fetchData(empresaId); // Recarrega os dados após a alteração utilizando empresaId do contexto
      } catch (error) {
        console.error('Erro ao salvar a função:', error);
      }
    }
  };

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
          options={funcoes} // Usa as funções carregadas
          getOptionLabel={(option) => `${option.codigo} - ${option.descricao}`}
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
                id_funcao: newValue.id, // Captura o id_funcao ao selecionar
                codigo: newValue.codigo, // Captura o código
                descricao: newValue.descricao // Captura a descrição
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
