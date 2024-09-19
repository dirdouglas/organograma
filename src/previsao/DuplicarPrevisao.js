import React, { useState, useEffect } from 'react';
import { TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle, Autocomplete } from '@mui/material';
import axios from 'axios';

const DuplicarPrevisao = ({ open, onClose, fetchData, rowData, empresaFilter }) => {
  const [formData, setFormData] = useState({
    id_empresa: empresaFilter?.id_empresa || '',
    id_funcao_atual: rowData?.id_funcao_atual || null,
    id_funcao_prevista: rowData?.id_funcao_prevista || null,
    id_departamento_atual: rowData?.id_departamento_atual || null,
    id_departamento_previsto: rowData?.id_departamento_previsto || null,
    prev_vaga: 1,
    data_prevista_contratacao: '',
    justificativa: rowData?.justificativa || '',
    id_funcionario: null, // sempre null para nova vaga
  });

  const [funcoes, setFuncoes] = useState([]);
  const [departamentos, setDepartamentos] = useState([]);
  const [loading, setLoading] = useState(true); // Inicia como `true` para esperar o carregamento dos dados

  // Função para carregar dados de funções e departamentos
  const carregarDados = async () => {
    try {
      if (!empresaFilter?.id_empresa) {
        console.error('Filtro de empresa não definido');
        return;
      }

      const [funcoesResponse, departamentosResponse] = await Promise.all([
        axios.get('https://44d5uoizbg.execute-api.us-east-1.amazonaws.com/dev/listar-funcoes', {
          params: { id_empresa: empresaFilter?.id_empresa },
        }),
        axios.get('https://jra0np42jc.execute-api.us-east-1.amazonaws.com/dev/departamentos', {
          params: { id_empresa: empresaFilter?.id_empresa },
        }),
      ]);

      // console.log('Funções carregadas:', funcoesResponse.data); // Verifica se as funções foram carregadas
      // console.log('Departamentos carregados:', departamentosResponse.data); // Verifica se os departamentos foram carregados

      setFuncoes(funcoesResponse.data);
      setDepartamentos(departamentosResponse.data);

      // Verifique se `rowData` contém os IDs corretos
      //console.log('rowData:', rowData);

      // Define os dados do formulário após carregar as funções e departamentos
      const funcaoAtual = funcoesResponse.data.find((funcao) => funcao.id === rowData.id_funcao_atual) || null;
      const funcaoPrevista = funcoesResponse.data.find((funcao) => funcao.id === rowData.id_funcao_prevista) || null;
      const departamentoAtual = departamentosResponse.data.find((dep) => dep.id === rowData.id_departamento_atual) || null;
      const departamentoPrevisto = departamentosResponse.data.find((dep) => dep.id === rowData.id_departamento_previsto) || null;

      // console.log('Função atual encontrada:', funcaoAtual); // Verifica a função atual encontrada
      // console.log('Departamento atual encontrado:', departamentoPrevisto); // Verifica o departamento atual encontrado

      setFormData((prevFormData) => ({
        ...prevFormData,
        funcao_atual: funcaoAtual,
        funcao_prevista: funcaoPrevista,
        departamento_atual: departamentoAtual,
        departamento_previsto: departamentoPrevisto,
      }));
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false); // Desativa o carregamento ao final
    }
  };


  useEffect(() => {
    if (open && empresaFilter?.id_empresa) {
      setLoading(true); // Ativa o loading antes de carregar os dados
      setFormData((prevFormData) => ({
        ...prevFormData,
        id_empresa: empresaFilter.id_empresa,
      }));
      carregarDados();
    }

    // Se não houver data de contratação, definir a data atual
    if (!formData.data_prevista_contratacao) {
      const dataAtual = new Date().toISOString().split('T')[0];
      setFormData((prevState) => ({
        ...prevState,
        data_prevista_contratacao: dataAtual,
      }));
    }
  }, [open, empresaFilter]);

  const handleFuncaoChange = (event, newValue) => {
    setFormData((prevState) => ({
      ...prevState,
      funcao_atual: newValue || null,
      funcao_prevista: newValue || null,
    }));
  };

  const handleDepartamentoChange = (event, newValue) => {
    setFormData((prevState) => ({
      ...prevState,
      departamento_atual: newValue || null,
      departamento_previsto: newValue || null,
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
      id_funcao_atual: formData.funcao_atual?.id || null,
      id_funcao_prevista: formData.funcao_prevista?.id || null,
      id_departamento_atual: formData.departamento_atual?.id || null,
      id_departamento_previsto: formData.departamento_previsto?.id || null,
      data_prevista_contratacao: formData.data_prevista_contratacao,
      prev_vaga: formData.prev_vaga,
      justificativa: formData.justificativa,
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
        // console.log(empresaFilter.id_empresa);
        fetchData(empresaFilter.id_empresa);
        onClose(); // Fechar o modal após inserção bem-sucedida
      } else {
        alert('Erro ao duplicar previsão.');
      }
    } catch (error) {
      console.error('Erro ao duplicar previsão:', error);
      alert('Ocorreu um erro ao duplicar a previsão.');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} PaperProps={{ style: { width: '30vw' } }}>
      <DialogTitle>Duplicar Previsão</DialogTitle>
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
              value={formData.funcao_atual || null}
              isOptionEqualToValue={(option, value) => option.id === value?.id} // Comparação correta de objetos
              sx={{ mb: 2 }}
            />
            <Autocomplete
              options={departamentos}
              getOptionLabel={(option) => `${option.codigo} - ${option.descricao}`}
              renderInput={(params) => <TextField {...params} label="Departamento" fullWidth />}
              onChange={handleDepartamentoChange}
              value={formData.departamento_previsto || null}
              isOptionEqualToValue={(option, value) => option.id === value?.id} // Comparação correta de objetos
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
          Duplicar Previsão
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DuplicarPrevisao;
