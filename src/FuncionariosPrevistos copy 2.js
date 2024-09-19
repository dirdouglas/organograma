import React, { useState, useEffect, useContext, useCallback } from 'react';
import { Container, Backdrop, CircularProgress, Alert, Typography, Box } from '@mui/material';
import { EmpresaContext } from './EmpresaContext';
import TabelaFuncionarios from './previsao/TabelaFuncionarios';
import Filtros from './previsao/Filtros';
import FooterLegendas from './previsao/FooterLegendas';
import NovaVaga from './previsao/NovaVaga';
import { listarFuncionariosPrevistos } from './previsao/Api';

const FuncionariosPrevistos = () => {
  const { empresaId, idGestor, adm } = useContext(EmpresaContext);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isNewVaga, setIsNewVaga] = useState(true);
  const [selectedRow, setSelectedRow] = useState(null);

  // Objeto de filtros para manter todos os filtros em um só lugar
  const [filters, setFilters] = useState({
    nomeOuMatricula: '',
    funcaoAtual: '',
    funcaoPrevista: '',
    departamentoAtual: '',
    departamentoPrevisto: '',
    tipoContrato: '',
    prevDemissao: '',
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

  useEffect(() => {
    const filtered = data.filter((item) => {
      const matchesNomeOuMatricula = item.nome_colaborador.toLowerCase().includes(filters.nomeOuMatricula.toLowerCase()) ||
                                     String(item.matricula).toLowerCase().includes(filters.nomeOuMatricula.toLowerCase());
      const matchesFuncaoAtual = filters.funcaoAtual ? item.descricao_funcao_atual?.toLowerCase().includes(filters.funcaoAtual.toLowerCase()) : true;
      const matchesFuncaoPrevista = filters.funcaoPrevista ? item.descricao_funcao_prevista?.toLowerCase().includes(filters.funcaoPrevista.toLowerCase()) : true;
      const matchesDepartamentoAtual = filters.departamentoAtual ? item.descricao_departamento?.toLowerCase().includes(filters.departamentoAtual.toLowerCase()) : true;
      const matchesDepartamentoPrevisto = filters.departamentoPrevisto ? item.descricao_departamento?.toLowerCase().includes(filters.departamentoPrevisto.toLowerCase()) : true;
      const matchesTipoContrato = filters.tipoContrato ? item.tipo_contrato?.toLowerCase().includes(filters.tipoContrato.toLowerCase()) : true;

      return matchesNomeOuMatricula && matchesFuncaoAtual && matchesFuncaoPrevista && matchesDepartamentoAtual && matchesDepartamentoPrevisto && matchesTipoContrato;
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
        showNomeOuMatricula={true}
        showFuncaoAtual={true}
        showFuncaoPrevista={true}
        showDepartamentoAtual={false}
        showDepartamentoPrevisto={true}
        showTipoContrato={false}
        showPrevDemissao={false}
        showVagas={false}
        showAumentoQuadro={false}
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
