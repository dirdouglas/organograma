import React, { useState, useEffect, useContext, useCallback, useMemo } from 'react';
import { Container, Backdrop, Button, CircularProgress, Alert, Typography, Box, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { EmpresaContext } from './EmpresaContext';
import TabelaFuncionarios from './previsao/TabelaFuncionarios';
import Filtros from './previsao/Filtros';
import FooterLegendas from './previsao/FooterLegendas';
import NovaVaga from './previsao/NovaVaga';
import { listarFuncionariosPrevistos } from './previsao/Api';
import { gerarRelatorioPDF } from './GeradorRelatorioPDF';

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
  const [confPrevFilter, setConfPrevFilter] = useState(null);

  const [demissaoFilter, setDemissaoFilter] = useState(null);
  const [statusFilter, setStatusFilter] = useState(null);
  const [vagaFilter, setVagaFilter] = useState(null); // Novo estado para prev_vaga

  const [filters, setFilters] = useState({
    nomeOuMatricula: '',
    funcaoAtual: '',
    funcaoPrevista: '',
    departamentoAtual: '',
    departamentoPrevisto: '',
    tipoContrato: '',
    prevDemissao: '',
    gestor: '',
    prevConf: '',
    vagas: '',
    aumentoQuadro: ''
  });

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const id_usuario = adm === '0' && idGestor ? idGestor : null;
      const funcionarios = await listarFuncionariosPrevistos(empresaId, id_usuario);

      const sortedFuncionarios = funcionarios.sort((a, b) => a.matricula - b.matricula);

      const filteredFuncionarios = sortedFuncionarios.filter((item) => {
        const matchesConfPrev = confPrevFilter === null || item.prev_confirmada === confPrevFilter;
        const matchesDemissao = demissaoFilter === null || item.prev_demissao === demissaoFilter;
        const matchesStatus = statusFilter === null || (statusFilter === 1 ? item.data_demissao !== null : item.data_demissao === null);
        const matchesVaga = vagaFilter === null || item.prev_vaga === vagaFilter; // Aplica o filtro prev_vaga

        return matchesConfPrev && matchesDemissao && matchesStatus && matchesVaga;
      });

      setData(filteredFuncionarios);
      setFilteredData(filteredFuncionarios);
      setLoading(false);
    } catch (error) {
      setError('Erro ao carregar os dados.');
      setLoading(false);
    }
  }, [adm, empresaId, idGestor, confPrevFilter, demissaoFilter, statusFilter, vagaFilter]);

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
      
      const matchesDepartamentoPrevisto = filters.departamentoPrevisto
        ? `${item.id_departamento_previsto.slice(2)} - ${item.descricao_departamento}`.toLowerCase().includes(filters.departamentoPrevisto.toLowerCase())
        : true;

      const matchesTipoContrato = filters.tipoContrato ? item.tipo_contrato?.toLowerCase().includes(filters.tipoContrato.toLowerCase()) : true;
      
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

      const matchesPrevConf = filters.prevConf !== '' ? item.prev_confirmada === filters.prevConf : true;

      return matchesNomeOuMatricula && matchesFuncaoAtual && matchesFuncaoPrevista && matchesDepartamentoAtual &&
             matchesDepartamentoPrevisto && matchesTipoContrato && matchesPrevDemissao && matchesGestor && matchesPrevConf;
    });

    setFilteredData(filtered);
  }, [filters, data]);

  const handleDialogOpen = (isNovaVaga, row = null) => {
    setIsNewVaga(isNovaVaga);
    setSelectedRow(row);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleConfPrevToggle = (event, newFilter) => {
    setConfPrevFilter(newFilter); 
  };

  const handleDemissaoToggle = (event, newFilter) => {
    setDemissaoFilter(newFilter);
  };

  const handleStatusToggle = (event, newFilter) => {
    setStatusFilter(newFilter);
  };

  const handleVagaToggle = (event, newFilter) => {
    setVagaFilter(newFilter); // Atualiza o estado de vagaFilter
  };

  useEffect(() => {
    if (empresaId) {
      fetchData();
    }
  }, [empresaId, fetchData]);

  const uniqueDepartamentosPrevistos = useMemo(() => {
    return [...new Map(
      data.map(item => [item.id_departamento_previsto, `${item.id_departamento_previsto.slice(2)} - ${item.descricao_departamento}`])
    ).values()].sort();
  }, [data]);

  const uniqueFuncoesAtuais = useMemo(() => {
    return [...new Map(
      data.map(item => [item.id_funcao_atual, item.descricao_funcao_atual])
    ).values()].sort();
  }, [data]);

  const uniqueFuncoesPrevistas = useMemo(() => {
    return [...new Map(
      data.map(item => [item.id_funcao_prevista, item.descricao_funcao_prevista])
    ).values()].sort();
  }, [data]);

  const uniqueDepartamentosAtuais = [...new Set(data.map(item => item.descricao_departamento))];
  const uniqueTiposContrato = [...new Set(data.map(item => item.tipo_contrato))];
  const uniqueGestores = [...new Set(data.map(item => item.gestor))];
  const uniquePrevDemissao = ['DEMISSÃO PREVISTA', 'VERIFICAR DEMISSÃO', 'VERIFICAR EFETIVAÇÃO'];

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

      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h6" style={{ fontWeight: 'bold', color: '#000', marginBottom: '2px' }}>
          Funcionários Previstos
        </Typography>

        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            const empresaNome = localStorage.getItem('empresa_nome') || 'Empresa';
            gerarRelatorioPDF(filteredData, empresaNome);
          }}
          style={{ margin: '20px 0' }}
        >
          Gerar Relatório PDF
        </Button>

        <Box display="flex" alignItems="center" gap="16px">
          {/* Filtro de Vaga (prev_vaga) */}
          <Box border="1px solid #ccc" borderRadius="4px" padding="8px">
            <Typography style={{ fontWeight: 'bold', color: '#000', marginBottom: '8px', fontSize: '10px' }}>
              VAGA
            </Typography>
            <ToggleButtonGroup
              value={vagaFilter}
              exclusive
              onChange={handleVagaToggle}
              aria-label="Filtro de Vaga"
            >
              <ToggleButton value={1} aria-label="Vaga" style={{ height: '30px' }}>
                Vaga
              </ToggleButton>
              <ToggleButton value={0} aria-label="Preenchido" style={{ height: '30px' }}>
                Preenchido
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>

          {/* Filtro de Demissão (prev_demissao) */}
          <Box border="1px solid #ccc" borderRadius="4px" padding="8px">
            <Typography style={{ fontWeight: 'bold', color: '#000', marginBottom: '8px', fontSize: '10px' }}>
              DEMISSÃO
            </Typography>
            <ToggleButtonGroup
              value={demissaoFilter}
              exclusive
              onChange={handleDemissaoToggle}
              aria-label="Filtro de Demissão"
            >
              <ToggleButton value={0} aria-label="Sem Demissão" style={{ height: '30px' }}>
                Sem Demissão
              </ToggleButton>
              <ToggleButton value={1} aria-label="Com Demissão" style={{ height: '30px' }}>
                Com Demissão
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>

          {/* Filtro de Status (data_demissao) */}
          <Box border="1px solid #ccc" borderRadius="4px" padding="8px">
            <Typography style={{ fontWeight: 'bold', color: '#000', marginBottom: '8px', fontSize: '10px' }}>
              STATUS
            </Typography>
            <ToggleButtonGroup
              value={statusFilter}
              exclusive
              onChange={handleStatusToggle}
              aria-label="Filtro de Status"
            >
              <ToggleButton value={0} aria-label="Ativo" style={{ height: '30px' }}>
                Ativo
              </ToggleButton>
              <ToggleButton value={1} aria-label="Demitido" style={{ height: '30px' }}>
                Demitido
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>

          {/* Filtro de Confirmação (prev_confirmada) */}
          <Box border="1px solid #ccc" borderRadius="4px" padding="8px">
            <Typography style={{ fontWeight: 'bold', color: '#000', marginBottom: '8px', fontSize: '10px' }}>
              CONFIRMAÇÃO
            </Typography>
            <ToggleButtonGroup
              value={confPrevFilter}
              exclusive
              onChange={handleConfPrevToggle}
              aria-label="Filtro de Confirmação"
            >
              <ToggleButton value={0} aria-label="Não Confirmado" style={{ height: '30px' }}>
                Não Confirmado
              </ToggleButton>
              <ToggleButton value={1} aria-label="Confirmado" style={{ height: '30px' }}>
                Confirmado
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>
        </Box>
      </Box>

      <Filtros
        filters={filters}
        setFilters={setFilters}
        uniqueFuncoesAtuais={uniqueFuncoesAtuais}
        uniqueFuncoesPrevistas={uniqueFuncoesPrevistas}
        uniqueDepartamentosAtuais={uniqueDepartamentosAtuais}
        uniqueDepartamentosPrevistos={uniqueDepartamentosPrevistos}
        uniqueTiposContrato={uniqueTiposContrato}
        uniqueGestores={uniqueGestores}
        uniquePrevDemissao={uniquePrevDemissao}
        showNomeOuMatricula={true}
        showFuncaoAtual={true}
        showFuncaoPrevista={true}
        showDepartamentoAtual={false}
        showDepartamentoPrevisto={true}
        showTipoContrato={false}
        showPrevDemissao={true}
        showGestor={true}
        showAgrupamento={false}
        showDiferenca={false}
        showConfPrev={true}
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
