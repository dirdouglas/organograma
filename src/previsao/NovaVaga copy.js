import React, { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, Autocomplete, Box } from '@mui/material';
import { listarFuncoes, listarDepartamentos, alterarPrevisao } from './Api';

const NovaVaga = ({ open, onClose, isNewVaga, empresaId, rowData, fetchData }) => {
  const [formData, setFormData] = useState({
    id_funcao_atual: null,
    id_funcao_prevista: null,
    id_departamento_atual: null,
    id_departamento_previsto: null,
    data_prevista_contratacao: new Date().toISOString().split('T')[0], // Data atual
    justificativa: '',
  });
  const [funcoes, setFuncoes] = useState([]);
  const [departamentos, setDepartamentos] = useState([]);

  useEffect(() => {
    const carregarDados = async () => {
      const funcoesData = await listarFuncoes(empresaId);
      const departamentosData = await listarDepartamentos(empresaId);
      setFuncoes(funcoesData);
      setDepartamentos(departamentosData);
    };

    carregarDados();

    if (!isNewVaga && rowData) {
      setFormData({
        id_funcao_atual: rowData.id_funcao_atual || null,
        id_funcao_prevista: rowData.id_funcao_prevista || null,
        id_departamento_atual: rowData.id_departamento_atual || null,
        id_departamento_previsto: rowData.id_departamento_previsto || null,
        data_prevista_contratacao: rowData.data_prevista_contratacao || new Date().toISOString().split('T')[0],
        justificativa: rowData.justificativa || '',
      });
    } else {
      setFormData({
        id_funcao_atual: null,
        id_funcao_prevista: null,
        id_departamento_atual: null,
        id_departamento_previsto: null,
        data_prevista_contratacao: new Date().toISOString().split('T')[0],
        justificativa: '',
      });
    }
  }, [isNewVaga, rowData, empresaId]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    const requestBody = {
      action: 'prever_vaga',
      id_empresa: empresaId,
      id_funcao_atual: formData.id_funcao_atual?.id || null,
      id_funcao_prevista: formData.id_funcao_prevista?.id || null,
      id_departamento_atual: formData.id_departamento_atual?.id || null,
      id_departamento_previsto: formData.id_departamento_previsto?.id || null,
      justificativa: formData.justificativa,
      id_funcionario: null,
    };

    try {
      await alterarPrevisao(requestBody);
      fetchData(); // Recarregar os dados
      onClose(); // Fechar o modal
    } catch (error) {
      console.error('Erro ao adicionar/duplicar vaga:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} PaperProps={{ style: { width: '30vw' } }}>
      <DialogTitle>{isNewVaga ? 'Inserir Nova Vaga' : 'Duplicar Previsão'}</DialogTitle>
      <DialogContent>
        <Autocomplete
          options={funcoes}
          getOptionLabel={(option) => option.descricao || ''}
          renderInput={(params) => <TextField {...params} label="Função" fullWidth />}
          onChange={(event, newValue) => setFormData({ ...formData, id_funcao_atual: newValue })}
          value={formData.id_funcao_atual || null}
          sx={{ mb: 2 }}
        />
        <Autocomplete
          options={departamentos}
          getOptionLabel={(option) => option.descricao || ''}
          renderInput={(params) => <TextField {...params} label="Departamento" fullWidth />}
          onChange={(event, newValue) => setFormData({ ...formData, id_departamento_atual: newValue })}
          value={formData.id_departamento_atual || null}
          sx={{ mb: 2 }}
        />
        <TextField
          label="Justificativa"
          fullWidth
          multiline
          name="justificativa"
          value={formData.justificativa}
          onChange={handleInputChange}
          margin="dense"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSubmit} color="primary">
          {isNewVaga ? 'Inserir Vaga' : 'Duplicar Previsão'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NovaVaga;
