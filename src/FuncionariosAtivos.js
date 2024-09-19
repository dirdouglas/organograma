import React, { useEffect, useState, useCallback } from 'react';
import {
  Container,
  Typography,
  Box,
  Backdrop,
  CircularProgress,
  Alert,
  Button,
} from '@mui/material';
import {
  fetchFuncionariosAtivos as fetchFuncionariosAtivosAPI,
  saveFuncionariosAtivos,
} from './previsao/Api';
import TabelaAtivos from './ativos/TabelaAtivos';
import Filtros from './previsao/Filtros';

// Cria uma referência externa para a função
let fetchFuncionariosAtivosRef = null;

const FuncionariosAtivos = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filters, setFilters] = useState({
    nomeOuMatricula: '',
    funcaoAtual: '',
    departamentoAtual: '',
    status: '',
    tipoContrato: '',
    gestor: '',
    agrupamento: '', // Filtro para o agrupamento usando nivel_departamento_2
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const adm = localStorage.getItem('adm');
  const id_gestor = localStorage.getItem('id_gestor');
  const id_empresa = localStorage.getItem('id_empresa');

  // Função para buscar dados da API
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const funcionariosAtivos = await fetchFuncionariosAtivosAPI(
        id_empresa,
        id_gestor,
        adm
      );
      setData(funcionariosAtivos);
      setFilteredData(funcionariosAtivos); // Inicializa com todos os dados
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  }, [id_empresa, id_gestor, adm]);

  // Armazena a referência da função de atualização para ser usada externamente
  useEffect(() => {
    fetchFuncionariosAtivosRef = fetchData;
  }, [fetchData]);

  // Chama a função fetchData ao carregar o componente
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Gera listas únicas para autocomplete a partir dos dados retornados
  const uniqueFuncoesAtuais = [
    ...new Set(data.map((item) => item.descricao_funcao).filter(Boolean)),
  ];
  const uniqueDepartamentosAtuais = [
    ...new Set(
      data.map((item) => item.descricao_departamento).filter(Boolean)
    ),
  ];
  const uniqueTiposContrato = [
    ...new Set(data.map((item) => item.tipo_contrato).filter(Boolean)),
  ];
  const uniqueGestores = [
    ...new Set(data.map((item) => item.gestor).filter(Boolean)),
  ];
  const uniqueAgrupamentos = [
    ...new Set(data.map((item) => item.nivel_departamento_2).filter(Boolean)),
  ];

  // Função de filtragem
  useEffect(() => {
    const filtered = data.filter((item) => {
      const matchesNomeOuMatricula =
        (item.nome_colaborador
          ?.toLowerCase()
          .includes(filters.nomeOuMatricula.toLowerCase()) ||
          String(item.matricula)
            ?.toLowerCase()
            .includes(filters.nomeOuMatricula.toLowerCase())) ?? false;
      const matchesFuncao = filters.funcaoAtual
        ? item.descricao_funcao
            ?.toLowerCase()
            .includes(filters.funcaoAtual.toLowerCase())
        : true;
      const matchesStatus = filters.status
        ? filters.status === 'Ativo'
          ? item.ativo === 1
          : item.ativo === 0
        : true;
      const matchesTipoContrato = filters.tipoContrato
        ? item.tipo_contrato === filters.tipoContrato
        : true;
      const matchesGestor = filters.gestor
        ? item.gestor?.toLowerCase().includes(filters.gestor.toLowerCase())
        : true;
      const matchesAgrupamento = filters.agrupamento
        ? item.nivel_departamento_2
            ?.toLowerCase()
            .includes(filters.agrupamento.toLowerCase())
        : true;
      const matchesDepartamento = filters.departamentoAtual
        ? item.descricao_departamento
            ?.toLowerCase()
            .includes(filters.departamentoAtual.toLowerCase())
        : true;

      return (
        matchesNomeOuMatricula &&
        matchesFuncao &&
        matchesStatus &&
        matchesTipoContrato &&
        matchesGestor &&
        matchesAgrupamento &&
        matchesDepartamento
      );
    });

    setFilteredData(filtered);
  }, [filters, data]);

  // Função para salvar dados filtrados
  const handleSave = async () => {
    const dataToSend = filteredData.map((item) => ({
      id_empresa: item.id_empresa,
      id_funcionario: item.id_funcionario,
      id_funcao: item.id_funcao,
      id_departamento: item.id_departamento,
      data_demissao: item.data_demissao ? item.data_demissao : null,
      data_admissao: item.data_admissao ? item.data_admissao : null,
    }));

    try {
      await saveFuncionariosAtivos(dataToSend);
      alert('Dados enviados com sucesso!');
    } catch (error) {
      console.error('Erro ao enviar os dados:', error);
      alert('Erro ao enviar os dados');
    }
  };

  return (
    <Container style={{ padding: '8px', maxWidth: '100%' }}>
      <Backdrop open={loading} style={{ zIndex: 1000, color: '#fff' }}>
        <CircularProgress color="inherit" />
      </Backdrop>

      <Box
        style={{
          position: 'sticky',
          top: 1,
          backgroundColor: '#fff',
          zIndex: 100,
          marginTop: '2px',
          marginBottom: '2px',
        }}
      >
        <Typography
          variant="h6"
          style={{
            fontWeight: 'bold',
            color: '#000',
            marginBottom: '3px',
          }}
        >
          Funcionários Ativos
        </Typography>

        {/* Filtros */}
        <Filtros
          filters={filters}
          setFilters={setFilters}
          uniqueFuncoesAtuais={uniqueFuncoesAtuais}
          uniqueDepartamentosAtuais={uniqueDepartamentosAtuais}
          uniqueTiposContrato={uniqueTiposContrato}
          uniqueGestores={uniqueGestores}
          uniqueAgrupamentos={uniqueAgrupamentos}
          showNomeOuMatricula={true}
          showDepartamento={true}
          showStatus={true}
          showTipoContrato={true}
          showFuncaoAtual={true}
          showFuncaoPrevista={false}
          showDepartamentoAtual={true}
          showDepartamentoPrevisto={false}
          showGestor={true}
          showAgrupamento={true}
          showPrevDemissao={false}
          showVagas={false}
          showAumentoQuadro={false}
          showDiferenca={false} // Controla a exibição do filtro de Diferença
        />
      </Box>

      {error && (
        <Alert severity="error" style={{ marginBottom: '5px' }}>
          Erro ao carregar os dados: {error.message}
        </Alert>
      )}

      <TabelaAtivos filteredData={filteredData} />

      {adm === '1' && (
        <Box
          style={{
            backgroundColor: '#fff',
            padding: '10px',
            position: 'fixed',
            bottom: 0,
            left: 0,
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            zIndex: 1200,
          }}
        >
          <Container
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: 0,
              height: '30px',
            }}
          >
            <Button
              variant="contained"
              color="primary"
              onClick={handleSave}
              style={{ height: '30px' }}
            >
              Atualizar Previsão
            </Button>
            <Typography variant="h6" style={{ lineHeight: '30px' }}>
              <strong>Total de Colaboradores Filtrados: {filteredData.length}</strong>
            </Typography>
          </Container>
        </Box>
      )}
    </Container>
  );
};

export default FuncionariosAtivos;

// Exporta a função de atualização para ser usada externamente
export const fetchFuncionariosAtivos = () => {
  if (fetchFuncionariosAtivosRef) {
    fetchFuncionariosAtivosRef();
  } else {
    console.error('A função de atualização não está disponível ainda.');
  }
};
