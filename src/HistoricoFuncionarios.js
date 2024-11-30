import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, TablePagination, IconButton, TextField, FormControlLabel, Switch, Select, MenuItem, Card, CardContent, Grid } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import axios from 'axios';

const HistoricoFuncionarios = () => {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [cenarioOptions, setCenarioOptions] = useState([]);
    const [funcaoOptions, setFuncaoOptions] = useState([]);
    const [departamentoOptions, setDepartamentoOptions] = useState([]);
    const [cenario, setCenario] = useState("");
    const [nome, setNome] = useState("");
    const [funcao, setFuncao] = useState("");
    const [departamento, setDepartamento] = useState("");
    const [showVagas, setShowVagas] = useState(false);
    const [orderBy, setOrderBy] = useState("nome_funcionario");
    const [order, setOrder] = useState("asc");
    const idEmpresa = localStorage.getItem('id_empresa'); // Obter id_empresa do localStorage

    const fetchData = async () => {
        try {
            const response = await axios.get(
                `https://vtcaetthfg.execute-api.us-east-1.amazonaws.com/dev/hist`,
                { params: { id_empresa: idEmpresa } }
            );
            setData(response.data);
            setFilteredData(response.data);
            populateFilterOptions(response.data);
        } catch (error) {
            console.error("Erro ao buscar dados", error);
        }
    };

    const populateFilterOptions = (data) => {
        const cenarios = [...new Set(data.map((row) => row.descricao_cenario))];
        const funcoes = [...new Set(data.map((row) => row.descricao_funcao))];
        const departamentos = [...new Set(data.map((row) => row.descricao_departamento))];
        setCenarioOptions(cenarios);
        setFuncaoOptions(funcoes);
        setDepartamentoOptions(departamentos);
    };

    useEffect(() => {
        fetchData();
    }, [idEmpresa]);

    const handleRefresh = () => {
        fetchData();
    };

    const handleFilterChange = () => {
        const filtered = data.filter(row => {
            const matchCenario = cenario ? row.descricao_cenario.includes(cenario) : true;
            const matchNome = nome ? row.nome_funcionario.toLowerCase().includes(nome.toLowerCase()) : true;
            const matchFuncao = funcao ? row.descricao_funcao.includes(funcao) : true;
            const matchDepartamento = departamento ? row.descricao_departamento.includes(departamento) : true;
            const matchVaga = showVagas ? row.matricula === 0 : true;
            return matchCenario && matchNome && matchFuncao && matchDepartamento && matchVaga;
        });
        setFilteredData(filtered);
    };

    useEffect(() => {
        handleFilterChange();
    }, [cenario, nome, funcao, departamento, showVagas, data]);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleSort = (column) => {
        const isAsc = orderBy === column && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(column);
    };

    const sortedData = [...filteredData].sort((a, b) => {
        if (order === 'asc') {
            return a[orderBy] > b[orderBy] ? 1 : -1;
        } else {
            return a[orderBy] < b[orderBy] ? 1 : -1;
        }
    });

    const totalColaboradores = filteredData.length;
    const totalDemitir = filteredData.filter(row => row.demissao_prevista).length;
    const totalVagas = filteredData.filter(row => row.matricula === 0).length;
    const totalPrevistos = totalColaboradores - totalDemitir;

    return (
        <Paper>
            <Typography variant="h6" component="div" style={{ padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                Histórico de Funcionários
                <IconButton onClick={handleRefresh} aria-label="refresh">
                    <RefreshIcon />
                </IconButton>
            </Typography>

            {/* Cards Totalizadores */}
            <Grid container spacing={2} style={{ padding: '16px' }}>
                <Grid item>
                    <Card>
                        <CardContent>
                            <Typography>Total: {totalColaboradores} colaboradores</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item>
                    <Card>
                        <CardContent>
                            <Typography>A Demitir: {totalDemitir}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item>
                    <Card>
                        <CardContent>
                            <Typography>Vagas: {totalVagas}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item>
                    <Card>
                        <CardContent>
                            <Typography>Previstos: {totalPrevistos}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Filtros */}
            <div style={{ display: 'flex', gap: '16px', padding: '16px' }}>
                <Select
                    value={cenario}
                    onChange={(e) => setCenario(e.target.value)}
                    displayEmpty
                    style={{ flex: 1 }}
                >
                    <MenuItem value="">Todos Cenários</MenuItem>
                    {cenarioOptions.map((option, index) => (
                        <MenuItem key={index} value={option}>{option}</MenuItem>
                    ))}
                </Select>
                <TextField
                    label="Nome"
                    variant="outlined"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    style={{ flex: 1 }}
                />
                <Select
                    value={funcao}
                    onChange={(e) => setFuncao(e.target.value)}
                    displayEmpty
                    style={{ flex: 1 }}
                >
                    <MenuItem value="">Todas Funções</MenuItem>
                    {funcaoOptions.map((option, index) => (
                        <MenuItem key={index} value={option}>{option}</MenuItem>
                    ))}
                </Select>
                <Select
                    value={departamento}
                    onChange={(e) => setDepartamento(e.target.value)}
                    displayEmpty
                    style={{ flex: 1 }}
                >
                    <MenuItem value="">Todos Departamentos</MenuItem>
                    {departamentoOptions.map((option, index) => (
                        <MenuItem key={index} value={option}>{option}</MenuItem>
                    ))}
                </Select>
                <FormControlLabel
                    control={<Switch checked={showVagas} onChange={() => setShowVagas(!showVagas)} />}
                    label="Exibir Vagas"
                />
            </div>

            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            {["Departamento", "Função", "Funcionário", "Data Admissão", "Demissão Prevista", "Data Inicial Histórico", "Turno", "Quantidade", "Observação"].map((col) => (
                                <TableCell
                                    key={col}
                                    onClick={() => handleSort(col.replace(" ", "_").toLowerCase())}
                                    style={{ cursor: 'pointer' }}
                                >
                                    {col}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
                            <TableRow key={index}>
                                <TableCell>{row.descricao_departamento}</TableCell>
                                <TableCell>{row.descricao_funcao}</TableCell>
                                <TableCell>{row.nome_funcionario}</TableCell>
                                <TableCell>{row.data_admissao}</TableCell>
                                <TableCell>{row.demissao_prevista}</TableCell>
                                <TableCell>{row.data_inicial_historico}</TableCell>
                                <TableCell>{row.turno}</TableCell>
                                <TableCell>{row.quantidade}</TableCell>
                                <TableCell>{row.observacao}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={filteredData.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Paper>
    );
};

export default HistoricoFuncionarios;
