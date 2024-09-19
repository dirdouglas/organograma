import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  IconButton,
  Collapse,
  Box,
} from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import axios from 'axios';

const TabelaResumo = ({ empresaId, idGestor, adm, dataSelecionada, setDadosFiltrados }) => {
  const [resumo, setResumo] = useState([]); // Dados retornados da API
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [openRows, setOpenRows] = useState({}); // Para controlar quais linhas estão abertas

  useEffect(() => {
    if (empresaId) {
      carregarResumo();
    }
  }, [empresaId, idGestor, adm, dataSelecionada, carregarResumo]);

  useEffect(() => {
    // Sempre que os dados forem carregados ou atualizados, filtrar e passar para o ResumoQuadroPrevisto
    setDadosFiltrados(resumo);
  }, [resumo, setDadosFiltrados]);

  const carregarResumo = async () => {
    try {
      const params = {
        data_referencia: dataSelecionada,
        id_empresa: empresaId,
      };

      if (adm === '0') {
        params.id_usuario = idGestor || undefined;
      }

      const response = await axios.get(`https://jlwb9ldard.execute-api.us-east-1.amazonaws.com/dev/resumo-previsto`, {
        params: params,
      });

      setResumo(response.data);
    } catch (error) {
      console.error('Erro ao carregar os dados:', error);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const toggleRow = (agrupamento) => {
    setOpenRows((prevOpenRows) => ({
      ...prevOpenRows,
      [agrupamento]: !prevOpenRows[agrupamento],
    }));
  };

  // Função para calcular subtotal de cada agrupamento
  const calcularSubtotal = (dados) => {
    const subtotal = dados.reduce(
      (acc, curr) => ({
        Previsto: acc.Previsto + curr.Previsto,
        Realizado: acc.Realizado + curr.Realizado,
        Diferenca: acc.Diferenca + curr.Diferenca,
      }),
      { Previsto: 0, Realizado: 0, Diferenca: 0 }
    );
    return subtotal;
  };

  // Organizar os dados em agrupamentos usando `nivel_departamento_2`
  const agrupamentos = resumo.reduce((acc, curr) => {
    const agrupamento = curr.nivel_departamento_2 || 'Sem Agrupamento';
    if (!acc[agrupamento]) {
      acc[agrupamento] = [];
    }
    acc[agrupamento].push(curr);
    return acc;
  }, {});

  // Obter os dados da página atual
  const agrupamentosPaginados = Object.entries(agrupamentos).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Paper style={{ marginBottom: '20px', marginTop: '2px' }}>
      <TableContainer component={Paper} style={{ fontSize: '0.3rem', maxHeight: 505 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell style={colStyles.selecione}>SEL</TableCell>
              <TableCell style={colStyles.agrupamento} colSpan={2}>AGRUPAMENTO</TableCell>
              <TableCell style={colStyles.codigo}>DEPARTAMENTO</TableCell>
              <TableCell style={colStyles.descricao}>DESCRIÇÃO</TableCell>
              <TableCell style={colStyles.gestor}>GESTOR</TableCell>
              <TableCell style={colStyles.previsto}>PREVISTO</TableCell>
              <TableCell style={colStyles.realizado}>REALIZADO</TableCell>
              <TableCell style={colStyles.diferenca}>DIFERENÇA</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {agrupamentosPaginados.map(([agrupamento, dados], index) => {
              const subtotal = calcularSubtotal(dados);
              return (
                <React.Fragment key={index}>
                  <TableRow>
                    <TableCell style={colStyles.selecione}>
                      <IconButton size="small" onClick={() => toggleRow(agrupamento)}>
                        {openRows[agrupamento] ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                      </IconButton>
                    </TableCell>
                    <TableCell style={colStyles.agrupamento} colSpan={2}>{agrupamento}</TableCell>
                    <TableCell />
                    <TableCell />
                    <TableCell />
                    <TableCell style={colStyles.previsto}><strong>{subtotal.Previsto}</strong></TableCell>
                    <TableCell style={colStyles.realizado}><strong>{subtotal.Realizado}</strong></TableCell>
                    <TableCell style={colStyles.diferenca}><strong>{subtotal.Diferenca}</strong></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={12} style={{ paddingBottom: 0, paddingTop: 0 }}>
                      <Collapse in={openRows[agrupamento]} timeout="auto" unmountOnExit>
                        <Box margin={1}>
                          <Table size="small" aria-label="details">
                            <TableBody>
                              {dados.map((row, i) => (
                                <TableRow key={i}>
                                  <TableCell style={colStyles.selecione} />
                                  <TableCell style={{ ...colStyles.agrupamento, paddingLeft: '20px' }} colSpan={0}></TableCell>
                                  <TableCell style={colStyles.codigo}>{row.descricao_departamento}</TableCell>
                                  <TableCell style={colStyles.descricao}>{row.descricao}</TableCell>
                                  <TableCell style={colStyles.gestor}>{row.gestor || 'Sem Gestor'}</TableCell>
                                  <TableCell style={colStyles.previsto}>{row.Previsto}</TableCell>
                                  <TableCell style={colStyles.realizado}>{row.Realizado}</TableCell>
                                  <TableCell style={colStyles.diferenca}>{row.Diferenca}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[14, 50, 100]}
        component="div"
        count={Object.keys(agrupamentos).length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

// Estilos de colunas herdados do TabelaAtivos.js e aplicados tanto no nível superior quanto no collapse
const colStyles = {
  selecione: { width: '5%', fontWeight: 'bold', padding: '3px', fontSize: '0.75rem', height: '20px' },
  agrupamento: { width: '30%', fontWeight: 'bold', padding: '3px', fontSize: '0.75rem', height: '20px' },
  codigo: { width: '7%', fontWeight: 'bold', padding: '3px', fontSize: '0.75rem', height: '20px' },
  descricao: { width: '24%', fontWeight: 'bold', padding: '3px', fontSize: '0.75rem', height: '20px' },
  gestor: { width: '10%', fontWeight: 'bold', padding: '3px', fontSize: '0.75rem', height: '20px' },
  previsto: { width: '8%', fontWeight: 'bold', padding: '3px', fontSize: '0.75rem', height: '20px', textAlign: 'center' },
  realizado: { width: '8%', fontWeight: 'bold', padding: '3px', fontSize: '0.75rem', height: '20px', textAlign: 'center' },
  diferenca: { width: '8%', fontWeight: 'bold', padding: '3px', fontSize: '0.75rem', height: '20px', textAlign: 'center' },
};

export default TabelaResumo;
