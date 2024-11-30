import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Grid,
  Switch,
  FormControlLabel,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import { ExpandMore, Delete } from "@mui/icons-material";

const Escala = () => {
  const [funcionarios, setFuncionarios] = useState([
    {
      matricula: "001",
      nome: "João Silva",
      departamentoCodigo: "D001",
      departamentoDescricao: "Financeiro",
      dias: 0,
    },
    {
      matricula: "002",
      nome: "Maria Oliveira",
      departamentoCodigo: "D002",
      departamentoDescricao: "RH",
      dias: 0,
    },
  ]);

  const [vagas, setVagas] = useState([
    { codigo: "V001", tipo: "Titular", total: 0, matricula: [] },
    { codigo: "V002", tipo: "Titular", total: 0, matricula: [] },
    { codigo: "V003", tipo: "Folguista", total: 0, matricula: [] },
    { codigo: "V004", tipo: "Titular", total: 0, matricula: [] },
    { codigo: "V005", tipo: "Folguista", total: 0, matricula: [] },
  ]);

  const [mostrarVagasLivres, setMostrarVagasLivres] = useState(false);
  const [popupOpen, setPopupOpen] = useState(false);
  const [vagasColaborador, setVagasColaborador] = useState([]);
  const [colaboradorSelecionado, setColaboradorSelecionado] = useState("");

  // Filtrar vagas
  const filtrarVagas = () => {
    if (mostrarVagasLivres) {
      return vagas.filter((vaga) => vaga.matricula.length === 0);
    }
    return vagas;
  };

  // Abrir popup para exibir vagas vinculadas a um colaborador
  const abrirPopup = (matricula) => {
    const vagasRelacionadas = vagas.filter((vaga) =>
      vaga.matricula.includes(matricula)
    );
    setColaboradorSelecionado(matricula);
    setVagasColaborador(vagasRelacionadas);
    setPopupOpen(true);
  };

  // Fechar popup
  const fecharPopup = () => {
    setPopupOpen(false);
    setVagasColaborador([]);
    setColaboradorSelecionado("");
  };

  // Remover vínculo do colaborador com uma vaga
  const desvincularVaga = (vagaCodigo, matricula) => {
    setVagas((prevVagas) =>
      prevVagas.map((vaga) => {
        if (vaga.codigo === vagaCodigo) {
          const isFolguista = vaga.tipo === "Folguista";
          const fator = isFolguista ? 0.2 : 1;

          return {
            ...vaga,
            matricula: vaga.matricula.filter((mat) => mat !== matricula),
            total: vaga.total - fator,
          };
        }
        return vaga;
      })
    );

    setFuncionarios((prevFuncionarios) =>
      prevFuncionarios.map((func) =>
        func.matricula === matricula
          ? {
              ...func,
              dias: Math.max(
                0,
                func.dias - (vagaCodigo.tipo === "Folguista" ? 0.2 : 1)
              ),
            }
          : func
      )
    );

    // Fechar o popup se todas as vagas forem removidas
    const vagasRelacionadas = vagas.filter((vaga) =>
      vaga.matricula.includes(matricula)
    );
    if (vagasRelacionadas.length === 1) fecharPopup();
  };

  // Desescalar todas as vagas de um colaborador
  const desescalarColaborador = (matricula) => {
    setVagas((prevVagas) =>
      prevVagas.map((vaga) => {
        if (vaga.matricula.includes(matricula)) {
          const isFolguista = vaga.tipo === "Folguista";
          const fator = isFolguista ? 0.2 : 1;

          return {
            ...vaga,
            matricula: vaga.matricula.filter((mat) => mat !== matricula),
            total: vaga.total - fator,
          };
        }
        return vaga;
      })
    );

    setFuncionarios((prevFuncionarios) =>
      prevFuncionarios.map((func) =>
        func.matricula === matricula ? { ...func, dias: 0 } : func
      )
    );
  };

  // Função para arrastar colaborador
  const onDragStart = (e, matricula) => {
    e.dataTransfer.setData("matricula", matricula);
  };

  // Soltar colaborador em uma vaga
  const onDrop = (e, codigoVaga) => {
    const matricula = e.dataTransfer.getData("matricula");
    const vaga = vagas.find((v) => v.codigo === codigoVaga);
    const isFolguista = vaga.tipo === "Folguista";
    const fator = isFolguista ? 0.2 : 1;

    // Bloquear se o colaborador já atingiu 1
    const funcionario = funcionarios.find((func) => func.matricula === matricula);
    if (funcionario.dias + fator > 1) return;

    // Bloquear se a vaga já tem um colaborador para vagas titulares
    if (!isFolguista && vaga.matricula.length > 0) return;

    // Atualizar vagas
    setVagas((prevVagas) =>
      prevVagas.map((vaga) => {
        if (vaga.codigo === codigoVaga) {
          return {
            ...vaga,
            matricula: [...vaga.matricula, matricula],
            total: vaga.total + fator,
          };
        }
        return vaga;
      })
    );

    // Atualizar dias alocados
    setFuncionarios((prevFuncionarios) =>
      prevFuncionarios.map((func) =>
        func.matricula === matricula
          ? { ...func, dias: Math.min(1, func.dias + fator) }
          : func
      )
    );
  };

  // Permitir o drop
  const onDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Sistema de Controle de Funcionários e Vagas
      </Typography>
      <Grid container spacing={3}>
        {/* Funcionários Previstos */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ padding: 2 }}>
            <Typography variant="h5" gutterBottom>
              Funcionários Previstos
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Matrícula</TableCell>
                    <TableCell>Nome</TableCell>
                    <TableCell>Cód. Departamento</TableCell>
                    <TableCell>Descrição</TableCell>
                    <TableCell>Dias Alocados</TableCell>
                    <TableCell>Ações</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {funcionarios.map((func) => (
                    <TableRow
                      key={func.matricula}
                      draggable
                      onDragStart={(e) => onDragStart(e, func.matricula)}
                      sx={{
                        backgroundColor:
                          func.dias >= 1 ? "lightgreen" : "inherit",
                      }}
                    >
                      <TableCell>{func.matricula}</TableCell>
                      <TableCell>{func.nome}</TableCell>
                      <TableCell>{func.departamentoCodigo}</TableCell>
                      <TableCell>{func.departamentoDescricao}</TableCell>
                      <TableCell>{func.dias.toFixed(1)}</TableCell>
                      <TableCell>
                        <Button
                          variant="outlined"
                          color="secondary"
                          onClick={() => desescalarColaborador(func.matricula)}
                        >
                          Desescalar Todas
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Vagas Criadas */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ padding: 2 }}>
            <Typography variant="h5" gutterBottom>
              Vagas Criadas
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Código da Vaga</TableCell>
                    <TableCell>Tipo de Vaga</TableCell>
                    <TableCell>Total Ajustado</TableCell>
                    <TableCell>Matrícula</TableCell>
                    <TableCell>Ações</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filtrarVagas().map((vaga) => (
                    <TableRow
                      key={vaga.codigo}
                      onDrop={(e) => onDrop(e, vaga.codigo)}
                      onDragOver={onDragOver}
                      sx={{
                        backgroundColor:
                          vaga.total === 1 ? "lightgreen" : "inherit",
                      }}
                    >
                      <TableCell>
                        {vaga.tipo === "Folguista" && vaga.total < 1 ? (
                          <IconButton onClick={() => abrirPopup(vaga.matricula[0])}>
                            <ExpandMore />
                          </IconButton>
                        ) : (
                          vaga.codigo
                        )}
                      </TableCell>
                      <TableCell>{vaga.tipo}</TableCell>
                      <TableCell>{vaga.total.toFixed(1)}</TableCell>
                      <TableCell>
                        {vaga.matricula.length > 0
                          ? vaga.matricula.join(", ")
                          : "Vaga Não Preenchida"}
                      </TableCell>
                      <TableCell>
                        {vaga.matricula.map((matricula) => (
                          <Button
                            key={matricula}
                            variant="outlined"
                            onClick={() => abrirPopup(matricula)}
                          >
                            Detalhes
                          </Button>
                        ))}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* Popup de Vagas Vinculadas */}
      <Dialog open={popupOpen} onClose={fecharPopup} maxWidth="md" fullWidth>
        <DialogTitle>
          Vagas Vinculadas - Colaborador: {colaboradorSelecionado}
        </DialogTitle>
        <DialogContent>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Código da Vaga</TableCell>
                  <TableCell>Tipo de Vaga</TableCell>
                  <TableCell>Total Ajustado</TableCell>
                  <TableCell>Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {vagasColaborador.map((vaga) => (
                  <TableRow key={vaga.codigo}>
                    <TableCell>{vaga.codigo}</TableCell>
                    <TableCell>{vaga.tipo}</TableCell>
                    <TableCell>{vaga.total.toFixed(1)}</TableCell>
                    <TableCell>
                      <IconButton
                        color="error"
                        onClick={() => desvincularVaga(vaga.codigo, colaboradorSelecionado)}
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Escala;
