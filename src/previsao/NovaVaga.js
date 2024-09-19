import React, { useState, useEffect, useContext } from 'react';
import { TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle, Autocomplete, Checkbox, FormControlLabel } from '@mui/material';
import { EmpresaContext } from '../EmpresaContext'; // Importa o contexto da empresa
import { listarFuncoes, listarDepartamentos, preverVagaApi } from './Api'; // Chama a API separada

const NovaVaga = ({ open, onClose, fetchData, duplicarRegistro = false, row }) => {
  const { empresaId } = useContext(EmpresaContext); // Usa o empresaId do contexto
  const [formData, setFormData] = useState({
    id_empresa: empresaId,
    id_funcao_atual: null,
    id_funcao_prevista: null,
    id_departamento_atual: null,
    id_departamento_previsto: null,
    prev_vaga: 1,
    aumento_quadro: 0, // Novo campo para "Aumento de Quadro"
    data_prevista_contratacao: '',
    justificativa: '', // Justificativa obrigatória
    id_funcionario: null, // sempre null para nova vaga
  });

  const [funcoes, setFuncoes] = useState([]);
  const [departamentos, setDepartamentos] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Carregar funções e departamentos ao montar o componente
    carregarDados();
    console.log(row);
    if (duplicarRegistro && row) {
      // Se for duplicação, carregar os dados de row
      const dataContratacao = row.data_prevista_contratacao
        ? row.data_prevista_contratacao.split('T')[0] // Formatar data
        : new Date().toISOString().split('T')[0]; // Usar data atual

      setFormData({
        id_empresa: empresaId,
        id_funcao_atual: row.id_funcao_atual || null,
        id_funcao_prevista: row.id_funcao_prevista || null,
        id_departamento_atual: row.id_departamento_atual || null,
        id_departamento_previsto: row.id_departamento_previsto || null,
        justificativa: `SUBST.: ${row.nome_colaborador || 'VAGA A CONTRATAR'}`,
        data_prevista_contratacao: dataContratacao,
        aumento_quadro: row.aumento_quadro || 0,
        prev_vaga: 1,
        id_funcionario: null,
      });
    }
  }, [empresaId, duplicarRegistro, row]);

  const carregarDados = async () => {
    try {
      setLoading(true);
      const funcoesResponse = await listarFuncoes(empresaId);
      const departamentosResponse = await listarDepartamentos(empresaId);
      setFuncoes(funcoesResponse);
      setDepartamentos(departamentosResponse);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
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

  const handleCheckboxChange = (event) => {
    const { checked } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      aumento_quadro: checked ? 1 : 0,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validação da justificativa com mais de 15 caracteres
    if (formData.justificativa.length < 15) {
      alert('A justificativa deve ter pelo menos 15 caracteres.');
      return;
    }

    const requestBody = {
      action: 'prever_vaga',
      id_empresa: formData.id_empresa,
      id_funcao_atual: formData.id_funcao_atual,
      id_funcao_prevista: formData.id_funcao_prevista,
      id_departamento_atual: formData.id_departamento_atual,
      id_departamento_previsto: formData.id_departamento_previsto,
      data_prevista_contratacao: formData.data_prevista_contratacao,
      prev_vaga: formData.prev_vaga,
      justificativa: formData.justificativa,
      aumento_quadro: formData.aumento_quadro, // Campo novo
      id_funcionario: duplicarRegistro ? null : formData.id_funcionario, // null se for duplicação
    };

    try {
      // Enviar payload stringificado
      await preverVagaApi(requestBody);
      fetchData(empresaId); // Atualiza a lista de dados
      onClose(); // Fecha o modal
    } catch (error) {
      console.error('Erro ao prever vaga:', error);
      alert('Erro ao prever vaga.');
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
              value={funcoes.find((f) => f.id === formData.id_funcao_prevista) || null} // Preencher função prevista
              sx={{ mb: 2 }}
            />
            <Autocomplete
              options={departamentos}
              getOptionLabel={(option) => `${option.codigo} - ${option.descricao}`}
              renderInput={(params) => <TextField {...params} label="Departamento" fullWidth />}
              onChange={handleDepartamentoChange}
              value={departamentos.find((d) => d.id === formData.id_departamento_previsto) || null} // Preencher departamento previsto
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
              required
              name="justificativa"
              value={formData.justificativa}
              onChange={handleInputChange}
              margin="dense"
            />
            <FormControlLabel
              control={<Checkbox checked={formData.aumento_quadro === 1} onChange={handleCheckboxChange} />}
              label="Aumento de Quadro"
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

export default NovaVaga;
