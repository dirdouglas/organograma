import React, { useState, useEffect, useContext, useCallback } from 'react';
import { Container, Backdrop, CircularProgress, Alert, Typography, Box } from '@mui/material';
import { EmpresaContext } from './EmpresaContext';
import TabelaFuncionarios from './previsao/TabelaFuncionarios';
import Filtros from './previsao/Filtros';
import FooterLegendas from './previsao/FooterLegendas';
import NovaVaga from './previsao/NovaVaga';
import { listarFuncionariosPrevistos } from './previsao/Api';

// Cria uma referência externa para a função
let fetchFuncionariosPrevistosRef = null;

const FuncionariosPrevistos = () => {
  const { empresaId, idGestor, adm } = useContext(EmpresaContext);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isNewVaga, setIsNewVaga] = useState(true);
  const [selectedRow, setSelectedRow] = useState(null);

  const [filters, setFilters] = useState({
    nomeOuMatricula: '',
    funcaoAtual: '',
    funcaoPrevista: '',
    departamentoAtual: '',
    departamentoPrevisto: '',
    tipoContrato: '',
    prevDemissao: '',
    gestor: '',    // Adicionado filtro de gestor
    vagas: '',
    aumentoQuadro: ''
  });

  // Função para buscar os dados de funcionários previstos
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const id_usuario = adm === '0' && idGestor ? idGestor : null;
      const funcionarios = await listarFuncionariosPrevistos(empresaId, id_usuario);
      setData(funcionarios);
      setFilteredData(funcionarios);
      setLoading(false);
    } catch (error) {
      setError('Erro ao carregar os dados.');
      setLoading(false);
    }
  }, [adm, empresaId, idGestor]);

  // Atribui a função fetchData à referência global para permitir a exportação
  useEffect(() => {
    fetchFuncionariosPrevistosRef = fetchData;
  }, [fetchData]);

  useEffect(() => {
    const filtered = data.filter((item) => {
      const matchesNomeOuMatricula = item.nome_colaborador.toLowerCase().includes(filters.nomeOuMatricula.toLowerCase()) ||
                                     String(item.matricula).toLowerCase().includes(filters.nomeOuMatricula.toLowerCase());
      const matchesFuncaoAtual = filters.funcaoAtual ? item.descricao_funcao_atual?.toLowerCase().includes(filters.funcaoAtual.toLowerCase()) : true;
      const matchesFuncaoPrevista = filters.funcaoPrevista ? item.descricao_funcao_prevista?.toLowerCase().includes(filters.funcaoPrevista.toLowerCase()) : true;
      const matchesDepartamentoAtual = filters.departamentoAtual ? item.descricao_departamento?.toLowerCase().includes(filters.departamentoAtual.toLowerCase()) : true;
      const matchesDepartamentoPrevisto = filters.departamentoPrevisto ? item.descricao_departamento?.toLowerCase().includes(filters.departamentoPrevisto.toLowerCase()) : true;
      const matchesTipoContrato = filters.tipoContrato ? item.tipo_contrato?.toLowerCase().includes(filters.tipoContrato.toLowerCase()) : true;
      
      // Lógica de filtragem para prevDemissao
      let matchesPrevDemissao = true;
      if (filters.prevDemissao) {
        if (item.prev_demissao === 1 && filters.prevDemissao === 'DEMISSÃO PREVISTA') {
          matchesPrevDemissao = true;
        } else if (item.prev_demissao === 0 && item.descricao_tipo_contrato === 'SAFRA' && filters.prevDemissao === 'VERIFICAR DEMISSÃO') {
          matchesPrevDemissao = true;
        } else if (
          item.prev_demissao === 0 &&
          (item.descricao_tipo_contrato === 'DETERMINADO' || item.descricao_tipo_contrato === 'EXPERIENCIA') &&
          filters.prevDemissao === 'VERIFICAR EFETIVAÇÃO'
        ) {
          matchesPrevDemissao = true;
        } else {
          matchesPrevDemissao = false;
        }
      }
  
      const matchesGestor = filters.gestor ? item.gestor?.toLowerCase().includes(filters.gestor.toLowerCase()) : true;
  
      return matchesNomeOuMatricula && matchesFuncaoAtual && matchesFuncaoPrevista && matchesDepartamentoAtual &&
             matchesDepartamentoPrevisto && matchesTipoContrato && matchesPrevDemissao && matchesGestor;
    });
  
    setFilteredData(filtered);
  }, [filters, data]);
  

  // Função para abrir o modal de Nova Vaga
  const handleDialogOpen = (isNovaVaga, row = null) => {
    setIsNewVaga(isNovaVaga);
    setSelectedRow(row);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  useEffect(() => {
    if (empresaId) {
      fetchData();
    }
  }, [empresaId, fetchData]);

  // Criando listas únicas para o autocomplete dos filtros
  const uniqueFuncoesAtuais = [...new Set(data.map(item => item.descricao_funcao_atual))];
  const uniqueFuncoesPrevistas = [...new Set(data.map(item => item.descricao_funcao_prevista))];
  const uniqueDepartamentosAtuais = [...new Set(data.map(item => item.descricao_departamento))];
  const uniqueDepartamentosPrevistos = [...new Set(data.map(item => item.descricao_departamento))];
  const uniqueTiposContrato = [...new Set(data.map(item => item.tipo_contrato))];
  const uniqueGestores = [...new Set(data.map(item => item.gestor))]; // Dados para filtro de gestores
  const uniquePrevDemissao = ['DEMISSÃO PREVISTA', 'VERIFICAR DEMISSÃO', 'VERIFICAR EFETIVAÇÃO']; // Valores para prevDemissao

  return (
    <Container style={{ padding: '8px', maxWidth: '100%', display: 'flex', flexDirection: 'column' }}>
      <Backdrop open={loading} style={{ zIndex: 1000, color: '#fff' }}>
        <CircularProgress color="inherit" />
      </Backdrop>

      {error && (
        <Alert severity="error" style={{ marginBottom: '3px' }}>
          {error}
        </Alert>
      )}

      <Typography variant="h6" style={{ fontWeight: 'bold', color: '#000', marginBottom: '2px' }}>
        Funcionários Previstos
      </Typography>

      {/* Filtros */}
      <Filtros
        filters={filters}
        setFilters={setFilters}
        uniqueFuncoesAtuais={uniqueFuncoesAtuais}
        uniqueFuncoesPrevistas={uniqueFuncoesPrevistas}
        uniqueDepartamentosAtuais={uniqueDepartamentosAtuais}
        uniqueDepartamentosPrevistos={uniqueDepartamentosPrevistos}
        uniqueTiposContrato={uniqueTiposContrato}
        uniqueGestores={uniqueGestores} // Adiciona gestores ao filtro
        uniquePrevDemissao={uniquePrevDemissao} // Adiciona prevDemissao ao filtro
        showNomeOuMatricula={true}
        showFuncaoAtual={true}
        showFuncaoPrevista={true}
        showDepartamentoAtual={false}
        showDepartamentoPrevisto={true}
        showTipoContrato={false}
        showPrevDemissao={true} // Exibe filtro de prevDemissao
        showGestor={true} // Exibe filtro de gestor
        showAgrupamento ={false}
        showDiferenca ={false} // Controla a exibição do filtro de Diferença
      />

      <Box style={{ flex: 1, overflow: 'hidden' }}>
        <TabelaFuncionarios
          filteredData={filteredData}
          fetchData={fetchData}
          handleDialogOpen={handleDialogOpen}
        />
      </Box>

      <NovaVaga
        open={dialogOpen}
        onClose={handleDialogClose}
        isNewVaga={isNewVaga}
        empresaId={empresaId}
        rowData={selectedRow}
        fetchData={fetchData}
      />

      <Box style={{ position: 'fixed', bottom: 0, left: 0, width: '100%', backgroundColor: '#f9f9f9', padding: '5px 10px', zIndex: 1000 }}>
        <FooterLegendas
          tipo="funcionarios_previstos"
          totalFiltrados={filteredData.length}
          onNovaVaga={() => handleDialogOpen(true)}
        />
      </Box>
    </Container>
  );
};

export default FuncionariosPrevistos;

// Exporta a função de atualização para ser usada externamente
export const fetchFuncionariosPrevistos = () => {
  if (fetchFuncionariosPrevistosRef) {
    fetchFuncionariosPrevistosRef();
  } else {
    console.error("A função de atualização não está disponível ainda.");
  }
};
