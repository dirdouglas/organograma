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

const AlterarDepartamentoDialog = ({ 
  open, 
  onClose, 
  selectedRow, 
  fetchData,
  departamentos // Agora recebemos os departamentos como prop
}) => {
  const [departamentoSelecionado, setDepartamentoSelecionado] = useState(null);
  const { empresaId } = useContext(EmpresaContext); // Pega empresaId diretamente do contexto

  const handleSaveDepartamento = async () => {
    if (selectedRow && departamentoSelecionado) {
      try {
        // Construir o corpo da requisição no formato necessário
        const requestBody = {
          httpMethod: "POST",
          body: JSON.stringify({
            id: String(selectedRow.id),  // Matricula do funcionário (id_funcionario)
            id_departamento_previsto: departamentoSelecionado.id_departamento, // ID do departamento selecionado
          }),
        };

        // Enviar a requisição POST com o formato correto
        await axios.post(
          'https://jra0np42jc.execute-api.us-east-1.amazonaws.com/dev/departamentos',
          requestBody, // Passa o corpo como segundo argumento
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );

        onClose(); // Fecha o dialog
        fetchData(empresaId); // Recarrega os dados após a alteração, utilizando empresaId do contexto
      } catch (error) {
        console.error('Erro ao salvar o departamento:', error);
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
      <DialogTitle>Alterar Departamento Previsto</DialogTitle>
      <DialogContent>
        <Autocomplete
          options={departamentos} // Usa os departamentos carregados
          getOptionLabel={(option) => `${option.codigo} - ${option.descricao}`}
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
                id_departamento: newValue.id, // Captura o id_departamento ao selecionar
                codigo: newValue.codigo, // Captura o código
                descricao: newValue.descricao // Captura a descrição
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
