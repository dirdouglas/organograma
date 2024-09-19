import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
  Autocomplete,
  Grid,
  IconButton,
  Box,
  Backdrop,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import InfoIcon from '@mui/icons-material/Info';
import CheckIcon from '@mui/icons-material/Check';
import AlterarDepartamentoDialog from './AlterarDepartamentoDialog';
import AlterarFuncaoDialog from './AlterarFuncaoDialog';

const FuncionariosPrevistos = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [departamentos, setDepartamentos] = useState([]);
  const [funcoes, setFuncoes] = useState([]);
  const [empresaFilter, setEmpresaFilter] = useState({ label: 'AGRO RBT (2)', id_empresa: 2 });
  const [nomeFilter, setNomeFilter] = useState('');
  const [funcaoAtualFilter, setFuncaoAtualFilter] = useState('');
  const [funcaoPrevistaFilter, setFuncaoPrevistaFilter] = useState('');
  const [departamentoFilter, setDepartamentoFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [novoValorConfirmacao , setNovoValorConfirmacao ] = useState(null);

  // Estados para os dialogs de alteração de departamento e função
  const [openDialogDepartamento, setOpenDialogDepartamento] = useState(false);
  const [openDialogFuncao, setOpenDialogFuncao] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  // Estado para o dialog de justificativa
  const [openJustificativaDialog, setOpenJustificativaDialog] = useState(false);
  const [justificativaSelecionada, setJustificativaSelecionada] = useState('');

  const empresas = [
    { label: 'AGRO RBT (2)', id_empresa: 2 },
    { label: 'AGRO URU (6)', id_empresa: 6 },
    { label: 'PFCMO GO (4)', id_empresa: 4 },
    { label: 'PFCMO MG (8)', id_empresa: 8 },
  ];

  const fetchData = async (id_empresa) => {
    try {
      setLoading(true);
      setError(null);

      // Fazer a chamada única para obter funcionários previstos, departamentos e funções
      const [funcionariosResponse, departamentosResponse, funcoesResponse] = await Promise.all([
        axios.get(`https://i2vtho4ifl.execute-api.us-east-1.amazonaws.com/dev/listar-previstos?id_empresa=${id_empresa}`),
        axios.get(`https://jra0np42jc.execute-api.us-east-1.amazonaws.com/dev/departamentos?id_empresa=${id_empresa}`),
        axios.get(`https://44d5uoizbg.execute-api.us-east-1.amazonaws.com/dev/listar-funcoes?id_empresa=${id_empresa}`)
      ]);

      setData(funcionariosResponse.data);
      setFilteredData(funcionariosResponse.data);
      setDepartamentos(Array.isArray(departamentosResponse.data) ? departamentosResponse.data : []);
      setFuncoes(Array.isArray(funcoesResponse.data) ? funcoesResponse.data : []);
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (empresaFilter && empresaFilter.id_empresa) {
      fetchData(empresaFilter.id_empresa);
    }
  }, [empresaFilter]);

  useEffect(() => {
    const filtered = data.filter((item) => {
      const matchesNome = item.nome_colaborador?.toLowerCase().includes(nomeFilter.toLowerCase());
      const matchesFuncaoAtual = funcaoAtualFilter ? item.descricao_funcao_atual?.toLowerCase().includes(funcaoAtualFilter.toLowerCase()) : true;
      const matchesFuncaoPrevista = funcaoPrevistaFilter ? item.descricao_funcao_prevista?.toLowerCase().includes(funcaoPrevistaFilter.toLowerCase()) : true;
      const matchesDepartamento = departamentoFilter ? item.descricao_departamento?.toLowerCase().includes(departamentoFilter.toLowerCase()) : true;

      return matchesNome && matchesFuncaoAtual && matchesFuncaoPrevista && matchesDepartamento;
    });

    setFilteredData(filtered);
  }, [nomeFilter, funcaoAtualFilter, funcaoPrevistaFilter, departamentoFilter, data]);

  const handleClickOpenDialogDepartamento = (row) => {
    setSelectedRow(row);
    setOpenDialogDepartamento(true);
  };

  const handleClickOpenDialogFuncao = (row) => {
    setSelectedRow(row);
    setOpenDialogFuncao(true);
  };

  const handleCloseDialogDepartamento = () => {
    setOpenDialogDepartamento(false);
  };

  const handleCloseDialogFuncao = () => {
    setOpenDialogFuncao(false);
  };

  const handleClickOpenJustificativaDialog = (justificativa) => {
    setJustificativaSelecionada(justificativa || 'SEM JUSTIFICATIVA'); // Exibe "SEM JUSTIFICATIVA" se não houver justificativa
    setOpenJustificativaDialog(true);
  };

  const handleCloseJustificativaDialog = () => {
    setOpenJustificativaDialog(false);
    setJustificativaSelecionada('');
  };

// Função para confirmar previsão e marcar prev_confirmada = 1
const confirmarPrevisao = async (row) => {
  console.log(row.id_funcionario);
  try {

        // Verifique o valor atual de prev_confirmada
        const novoValorConfirmacao = row.prev_confirmada === 1 ? 0 : 1;


    // Construir o corpo da requisição no formato necessário
    const requestBody = {
      httpMethod: "POST",
      body: JSON.stringify({
        id_funcionario: String(row.id_funcionario),  // Certifique-se de que id_funcionario esteja presente
        prev_confirmada: novoValorConfirmacao, // Confirmar previsão
      }),
    };

    // Enviar a requisição POST com o formato correto
    await axios.post(
      'https://2gfpdxjv31.execute-api.us-east-1.amazonaws.com/dev/altera-previsao', // Substitua pela URL da sua API Lambda
      requestBody,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    fetchData(empresaFilter.id_empresa); // Recarrega os dados após a alteração
  } catch (error) {
    console.error('Erro ao confirmar a previsão:', error);
  }
};




  // Função para definir a cor da linha com base nas condições
  const getRowColor = (row) => {
    if (row.prev_confirmada === 1 && row.prev_demissao === 1) {
      return 'red'; // Vermelho
    } else if (row.prev_confirmada === 1 && row.prev_vaga === 1) {
      return 'blue'; // Azul
    } else if (row.prev_confirmada === 1) {
      return 'green'; // Verde
    } else {
      return 'inherit'; // Cor padrão
    }
  };

  return (
    <Container style={{ padding: '3px', maxWidth: '100%' }}>
      <Backdrop open={loading} style={{ zIndex: 1000, color: '#fff' }}>
        <CircularProgress color="inherit" />
      </Backdrop>

      <Box style={{ position: 'sticky', padding: '3px', top: 1, backgroundColor: '#fff', zIndex: 100, marginTop: '3px', marginBottom: '3px' }}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item xs={8} md={6}>
            <Typography variant="h4" style={{ fontWeight: 'bold', color: '#000' }}>
              Funcionários Previstos
            </Typography>
          </Grid>
          <Grid item xs={12} md={6} sm={3}>
            <Box display="flex" justifyContent="flex-end" alignItems="center">
              <Autocomplete
                options={empresas}
                getOptionLabel={(option) => option.label}
                isOptionEqualToValue={(option, value) => option.id_empresa === value.id_empresa}
                renderInput={(params) => (
                  <TextField {...params} label="Selecione a Empresa" variant="outlined" fullWidth />
                )}
                value={empresaFilter}
                onChange={(event, newValue) => {
                  setEmpresaFilter(newValue || { label: '', id_empresa: null });
                }}
                style={{ marginRight: '5px', width: '30%', fontSize:'0.8rem'}}
              />

              <IconButton onClick={() => fetchData(empresaFilter?.id_empresa)}>
                <RefreshIcon />
              </IconButton>
            </Box>
          </Grid>
        </Grid>

        <Grid container spacing={2} style={{ marginTop: '1px', marginBottom: '1px' }}>
          <Grid item xs={12} sm={3}>
            <TextField
              label="Nome do Colaborador"
              variant="outlined"
              fullWidth
              value={nomeFilter}
              onChange={(e) => setNomeFilter(e.target.value)}
              InputProps={{ style: {height: '5vh', display: 'flex', alignItems: 'center',},
                inputProps: { style: {height: '4vh', padding: '0 10px', display: 'flex', alignItems: 'center',},},}}
              InputLabelProps={{style: {lineHeight: '0.9rem', },}}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              label="Função Atual"
              variant="outlined"
              fullWidth
              value={funcaoAtualFilter}
              onChange={(e) => setFuncaoAtualFilter(e.target.value)}
              InputProps={{ style: {height: '5vh', display: 'flex', alignItems: 'center',},
                inputProps: { style: {height: '4vh', padding: '0 10px', display: 'flex', alignItems: 'center',},},}}
              InputLabelProps={{style: {lineHeight: '0.9rem', },}}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              label="Função Prevista"
              variant="outlined"
              fullWidth
              value={funcaoPrevistaFilter}
              onChange={(e) => setFuncaoPrevistaFilter(e.target.value)}
              InputProps={{ style: {height: '5vh', display: 'flex', alignItems: 'center',},
                inputProps: { style: {height: '4vh', padding: '0 10px', display: 'flex', alignItems: 'center',},},}}
              InputLabelProps={{style: {lineHeight: '0.9rem', },}}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              label="Departamento"
              variant="outlined"
              fullWidth
              value={departamentoFilter}
              onChange={(e) => setDepartamentoFilter(e.target.value)}
              InputProps={{ style: {height: '5vh', display: 'flex', alignItems: 'center',},
                inputProps: { style: {height: '4vh', padding: '0 10px', display: 'flex', alignItems: 'center',},},}}
              InputLabelProps={{style: {lineHeight: '0.9rem', },}}
            />
          </Grid>
        </Grid>
      </Box>

      {error && (
        <Alert severity="error" style={{ marginBottom: '3px' }}>
          Erro ao carregar os dados: {error.message}
        </Alert>
      )}

      <TableContainer component={Paper} style={{ fontSize: '0.3rem'}} >
        <Table stickyHeader>
          <TableHead>
            <TableRow style={{ fontSize: '1REM', padding: '4px 8px'}}>
              <TableCell style={{ backgroundColor: '#2196f3', color: '#fff', fontWeight: 'bold', textTransform: 'uppercase', paddingTop: '0px', paddingBottom: '0px' }}>Matrícula</TableCell>
              <TableCell style={{ backgroundColor: '#2196f3', color: '#fff', fontWeight: 'bold', textTransform: 'uppercase', paddingTop: '0px', paddingBottom: '0px' }}>Nome do Colaborador</TableCell>
              <TableCell style={{ backgroundColor: '#2196f3', color: '#fff', fontWeight: 'bold', textTransform: 'uppercase', paddingTop: '0px', paddingBottom: '0px' }}>Função Atual</TableCell>
              <TableCell style={{ backgroundColor: '#2196f3', color: '#fff', fontWeight: 'bold', textTransform: 'uppercase', paddingTop: '0px', paddingBottom: '0px' }}>Função Prevista</TableCell>
              <TableCell style={{ backgroundColor: '#2196f3', color: '#fff', fontWeight: 'bold', textTransform: 'uppercase', paddingTop: '0px', paddingBottom: '0px' }}>Departamento</TableCell>
              <TableCell style={{ backgroundColor: '#2196f3', color: '#fff', fontWeight: 'bold', textTransform: 'uppercase', paddingTop: '0px', paddingBottom: '0px' }}>Data de Contratação</TableCell>
              <TableCell style={{ backgroundColor: '#2196f3', color: '#fff', fontWeight: 'bold', textTransform: 'uppercase', paddingTop: '0px', paddingBottom: '0px' }}>Data de Demissão</TableCell>
              <TableCell style={{ backgroundColor: '#2196f3', color: '#fff', fontWeight: 'bold', textTransform: 'uppercase', paddingTop: '0px', paddingBottom: '0px' }}>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.map((row, index) => {
               console.log('Row:', row.id_funcionario); 
              const rowColor = getRowColor(row); // Obtenha a cor da linha
              return (
                <TableRow key={index}>
                  <TableCell style={{ color: rowColor, fontSize: '0.7rem', padding: '4px 8px' }}>{row.matricula}</TableCell>
                  <TableCell style={{ color: rowColor, fontSize: '0.7rem', padding: '4px 8px'  }}>{row.nome_colaborador}</TableCell>
                  <TableCell style={{ color: rowColor, fontSize: '0.7rem', padding: '4px 8px'  }}>{row.descricao_funcao_atual}</TableCell>
                  <TableCell style={{ color: rowColor, fontSize: '0.7rem', padding: '4px 8px' , cursor: 'pointer' }} onClick={() => handleClickOpenDialogFuncao(row)}>
                    {row.descricao_funcao_prevista}
                  </TableCell>
                  <TableCell style={{ color: rowColor, fontSize: '0.7rem', padding: '4px 8px', cursor: 'pointer' }} onClick={() => handleClickOpenDialogDepartamento(row)}>
                    {row.descricao_departamento}
                  </TableCell>
                  <TableCell style={{ color: rowColor, fontSize: '0.7rem', padding: '4px 8px'  }}>{new Date(row.data_contratacao).toLocaleDateString()}</TableCell>
                  <TableCell style={{ color: rowColor, fontSize: '0.7rem', padding: '4px 8px'  }}>{row.data_demissao ? new Date(row.data_demissao).toLocaleDateString() : ''}</TableCell>
                  <TableCell style={{ color: rowColor, fontSize: '0.7rem', padding: '4px 8px'  }}>
                    <IconButton aria-label="Justificativa" onClick={() => handleClickOpenJustificativaDialog(row.justificativa || 'SEM JUSTIFICATIVA')}>
                      <InfoIcon />
                    </IconButton>
                    <IconButton aria-label="Confirmar Previsão" onClick={() => confirmarPrevisao(row)}>
                      <CheckIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialogDepartamento} onClose={handleCloseDialogDepartamento}>
        <AlterarDepartamentoDialog
          open={openDialogDepartamento}
          onClose={handleCloseDialogDepartamento}
          selectedRow={selectedRow}
          fetchData={fetchData}
          empresaFilter={empresaFilter}
          departamentos={departamentos} // Passa os departamentos carregados
        />
      </Dialog>

      <Dialog open={openDialogFuncao} onClose={handleCloseDialogFuncao}>
        <AlterarFuncaoDialog
          open={openDialogFuncao}
          onClose={handleCloseDialogFuncao}
          selectedRow={selectedRow}
          fetchData={fetchData}
          empresaFilter={empresaFilter}
          funcoes={funcoes} // Passa as funções carregadas
        />
      </Dialog>

      <Dialog open={openJustificativaDialog} onClose={handleCloseJustificativaDialog}>
        <DialogTitle>Justificativa</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            {justificativaSelecionada}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseJustificativaDialog} color="primary">
            Fechar
          </Button>
        </DialogActions>
      </Dialog>

      <Box style={{ backgroundColor: '#fff', padding: '10px', position: 'fixed', bottom: 0, left: 0, width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 1200 }}>
        <Container style={{ display: 'flex', justifyContent: 'space-between', padding: 0 }}>
          <Typography variant="body1">
            <strong>Legenda:</strong> 
            <span style={{ color: 'green', padding: '2px 5px', margin: '0 5px' }}>Confirmada</span>
            <span style={{ color: 'blue', padding: '2px 5px', margin: '0 5px' }}>Confirmada e Vaga</span>
            <span style={{ color: 'red', padding: '2px 5px', margin: '0 5px' }}>Confirmada e Demissão</span>
          </Typography>
          <Typography variant="h6">
            <strong>Total de Colaboradores Filtrados: {filteredData.length}</strong>
          </Typography>
        </Container>
      </Box>
    </Container>
  );
};

export default FuncionariosPrevistos;
