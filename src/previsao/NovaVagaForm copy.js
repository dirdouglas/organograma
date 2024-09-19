import React, { useState, useEffect, useContext } from 'react';
import { TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle, Autocomplete } from '@mui/material';
import axios from 'axios';
import { EmpresaContext } from '../EmpresaContext'; // Importa o contexto da empresa

const NovaVagaForm = ({ open, onClose, fetchData }) => {
  const { empresaId } = useContext(EmpresaContext); // Usa o empresaId do contexto
  const [formData, setFormData] = useState({
    id_empresa: empresaId || '',
    id_funcao_atual: null,
    id_funcao_prevista: null,
    id_departamento_atual: null,
    id_departamento_previsto: null,
    prev_vaga: 1,
    data_prevista_contratacao: '',
    justificativa: '', // Adicionado campo de justificativa
    id_funcionario: null, // sempre null para nova vaga
  });

  const [funcoes, setFuncoes] = useState([]);
  const [departamentos, setDepartamentos] = useState([]);
  const [loading, setLoading] = useState(false); // Iniciar com "false"

  useEffect(() => {
    if (empresaId) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        id_empresa: empresaId,
      }));
      carregarDados();
    }

    // Se não houver data de contratação, usar a data atual
    if (!formData.data_prevista_contratacao) {
      const dataAtual = new Date().toISOString().split('T')[0];
      setFormData((prevState) => ({
        ...prevState,
        data_prevista_contratacao: dataAtual,
      }));
    }
  }, [empresaId, open]);

  const carregarDados = async () => {
    try {
      if (!empresaId) {
        console.error('Empresa não selecionada');
        return;
      }

      setLoading(true);
      const [funcoesResponse, departamentosResponse] = await Promise.all([
        axios.get('https://44d5uoizbg.execute-api.us-east-1.amazonaws.com/dev/listar-funcoes', {
          params: { id_empresa: empresaId },
        }),
        axios.get('https://jra0np42jc.execute-api.us-east-1.amazonaws.com/dev/departamentos', {
          params: { id_empresa: empresaId },
        }),
      ]);

      setFuncoes(funcoesResponse.data);
      setDepartamentos(departamentosResponse.data);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false); // Desativar o loading
    }
  };

  const handleFuncaoChange = (event, newValue) => {
    setFormData((prevState) => ({
      ...prevState,
      id_funcao_atual: newValue?.id || null,
      id_funcao_prevista: newValue?.id || null,
    }));
  };

  const handleDepartamentoChange = (event, newValue) => {
    setFormData((prevState) => ({
      ...prevState,
      id_departamento_atual: newValue?.id || null,
      id_departamento_previsto: newValue?.id || null,
    }));
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requestBody = {
      action: 'prever_vaga',
      id_empresa: formData.id_empresa,
      id_funcao_atual: formData.id_funcao_atual,
      id_funcao_prevista: formData.id_funcao_prevista,
      id_departamento_atual: formData.id_departamento_atual,
      id_departamento_previsto: formData.id_departamento_previsto,
      data_prevista_contratacao: formData.data_prevista_contratacao,
      prev_vaga: formData.prev_vaga,
      justificativa: formData.justificativa, // Incluindo justificativa
      id_funcionario: formData.id_funcionario, // sempre null
    };

    try {
      const formattedBody = {
        body: JSON.stringify(requestBody),
      };

      const response = await axios.post(
        'https://2gfpdxjv31.execute-api.us-east-1.amazonaws.com/dev/altera-previsao',
        JSON.stringify(formattedBody),
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );

      if (response.status === 200) {
        fetchData(empresaId); // Atualizar os dados após inserção
        onClose(); // Fechar o modal
      } else {
        alert('Erro ao prever vaga.');
      }
    } catch (error) {
      console.error('Erro ao prever vaga:', error);
      alert('Ocorreu um erro ao prever vaga.');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} PaperProps={{ style: { width: '30vw' } }}>
      <DialogTitle>Inserir Nova Vaga</DialogTitle>
      <DialogContent>
        {loading ? (
          <p>Carregando...</p>
        ) : (
          <>
            <Autocomplete
              options={funcoes}
              getOptionLabel={(option) => `${option.codigo} - ${option.descricao}`}
              renderInput={(params) => <TextField {...params} label="Função" fullWidth />}
              onChange={handleFuncaoChange}
              sx={{ mb: 2 }}
            />
            <Autocomplete
              options={departamentos}
              getOptionLabel={(option) => `${option.codigo} - ${option.descricao}`}
              renderInput={(params) => <TextField {...params} label="Departamento" fullWidth />}
              onChange={handleDepartamentoChange}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Data de Contratação"
              type="date"
              fullWidth
              name="data_prevista_contratacao"
              value={formData.data_prevista_contratacao}
              onChange={handleInputChange}
              InputLabelProps={{ shrink: true }}
              margin="dense"
            />
            <TextField
              label="Justificativa"
              multiline
              fullWidth
              name="justificativa"
              value={formData.justificativa}
              onChange={handleInputChange}
              margin="dense"
            />
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSubmit} color="primary">
          Inserir Vaga
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NovaVagaForm;
