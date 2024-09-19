import React, { useState, useEffect, useContext, useCallback } from 'react';
import {
  Container,
  Typography,
  Box,
  Backdrop,
  CircularProgress,
  Alert,
} from '@mui/material';
import dayjs from 'dayjs';
import { EmpresaContext } from './EmpresaContext';
import TabelaResumo from './resumo/TabelaResumo';
import Filtros from './previsao/Filtros';
import FooterResumo from './resumo/FooterResumo';
import { carregarResumo } from './previsao/Api';

const ResumoQuadroPrevisto = () => {
  //const [dataSelecionada, setDataSelecionada] = useState(dayjs().format('YYYY-MM-DD'));
  const [dados, setDados] = useState([]);
  const [dadosFiltrados, setDadosFiltrados] = useState([]);
  const [filtros, setFiltros] = useState({
    departamento: '',
    nivel1: '',
    nivel2: '',
    gestor: '',
    diferenca: 'TODOS',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { empresaId, idGestor, adm } = useContext(EmpresaContext);

  // Função para buscar dados da API
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const resumoQuadro = await carregarResumo(
        dataSelecionada,
        empresaId,
        idGestor,
        adm
      ); // Chama a função da API
      setDados(resumoQuadro);
      setDadosFiltrados(resumoQuadro); // Inicializa com todos os dados
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  }, [dataSelecionada, empresaId, idGestor, adm]);

  useEffect(() => {
    if (empresaId) {
      fetchData();
    }
  }, [fetchData, empresaId, idGestor, adm, dataSelecionada]);

  // Gera listas únicas para autocomplete a partir dos dados retornados
  const uniqueDepartamentos = [...new Set(dados.map(item => item.descricao_departamento).filter(Boolean))];
  const uniqueNiveis1 = [...new Set(dados.map(item => item.nivel1).filter(Boolean))];
  const uniqueNiveis2 = [...new Set(dados.map(item => item.nivel2).filter(Boolean))];
  const uniqueGestores = [...new Set(dados.map(item => item.gestor).filter(Boolean))];

  // Função de filtragem
  useEffect(() => {
    const filtered = dados.filter((item) => {
      const matchesDepartamento = filtros.departamento
        ? item.descricao_departamento?.toLowerCase().includes(filtros.departamento.toLowerCase())
        : true;
      const matchesNivel1 = filtros.nivel1
        ? item.nivel1?.toLowerCase().includes(filtros.nivel1.toLowerCase())
        : true;
      const matchesNivel2 = filtros.nivel2
        ? item.nivel2?.toLowerCase().includes(filtros.nivel2.toLowerCase())
        : true;
      const matchesGestor = filtros.gestor
        ? item.gestor?.toLowerCase().includes(filtros.gestor.toLowerCase())
        : true;
      const matchesDiferenca =
        filtros.diferenca === 'TODOS' ||
        (filtros.diferenca === 'COM VAGAS' && item.Diferenca > 0) ||
        (filtros.diferenca === 'EXCEDENTE' && item.Diferenca < 0) ||
        (filtros.diferenca === 'SEM DIFERENÇA' && item.Diferenca === 0);

      return matchesDepartamento && matchesNivel1 && matchesNivel2 && matchesGestor && matchesDiferenca;
    });

    setDadosFiltrados(filtered);
  }, [filtros, dados]);

  // Função de cálculo para o rodapé com base nos dados filtrados
  const calcularTotais = (dados) => {
    const totalPrevistos = dados.reduce((acc, curr) => acc + curr.Previsto, 0);
    const totalRealizados = dados.reduce((acc, curr) => acc + curr.Realizado, 0);
    const totalDiferenca = dados.reduce((acc, curr) => acc + curr.Diferenca, 0);

    return {
      totalPrevistos,
      totalRealizados,
      totalDiferenca,
    };
  };

  return (
    <Container style={{ padding: '8px', maxWidth: '100%' }}>
      <Backdrop open={loading} style={{ zIndex: 1000, color: '#fff' }}>
        <CircularProgress color="inherit" />
      </Backdrop>

      <Box style={{ position: 'sticky', top: 1, backgroundColor: '#fff', zIndex: 100, marginTop: '2px', marginBottom: '2px' }}>
        <Typography
          variant="h6"
          style={{
            fontWeight: 'bold',
            color: '#000',
            marginBottom: '3px',
          }}
        >
          Resumo Quadro Previsto
        </Typography>

        {/* Filtros */}
        <Filtros
          filters={filtros}
          setFilters={setFiltros}
          uniqueDepartamentosAtuais={uniqueDepartamentos}
          uniqueFuncoesAtuais={uniqueNiveis1}
          uniqueFuncoesPrevistas={uniqueNiveis2}
          uniqueGestores={uniqueGestores}
          showNomeOuMatricula={false}
          showDepartamentoAtual={true}
          showDepartamentoPrevisto={false}
          showTipoContrato={false}
          showFuncaoAtual={false}
          showFuncaoPrevista={false}
          showGestor={true}
          showAgrupamento={true}
          showDiferenca={true} // Exibe o filtro de diferença
        />
      </Box>

      {error && (
        <Alert severity="error" style={{ marginBottom: '5px' }}>
          Erro ao carregar os dados: {error.message}
        </Alert>
      )}

      <TabelaResumo
        empresaId={empresaId}
        idGestor={idGestor}
        adm={adm}
        dataSelecionada={dataSelecionada}
        setDadosFiltrados={setDadosFiltrados} // Atualiza os dados filtrados
      />

      <FooterResumo {...calcularTotais(dadosFiltrados)} /> {/* Passa os totais calculados */}
    </Container>
  );
};

export default ResumoQuadroPrevisto;
