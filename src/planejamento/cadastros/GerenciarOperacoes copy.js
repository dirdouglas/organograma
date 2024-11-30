import React from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
} from "@mui/material";
import { Edit, Delete, Add, KeyboardReturn, CheckCircle } from "@mui/icons-material";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useFetchPlanoById, useFetchOperacoesByFrenteId } from "../PlanejamentoContext";

const GerenciarOperacoes = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const idFrente = searchParams.get("idfrente");
  const idPlano = searchParams.get("idplano");
  const descricaoAtividade = searchParams.get("descricaoAtividade");

  // Busca os dados do plano e operações usando os hooks personalizados
  const { data: plano, isLoading: isPlanoLoading } = useFetchPlanoById(idPlano);
  const { data: operacoes, isLoading: isOperacoesLoading } = useFetchOperacoesByFrenteId(idFrente);

  const handleAdicionarOperacao = () => {
    console.log("Adicionar operação");
  };

  const handleEditarOperacao = (idOperacao) => {
    console.log("Editar operação:", idOperacao);
  };

  const handleExcluirOperacao = (idOperacao) => {
    console.log("Excluir operação:", idOperacao);
  };

  return (
    <Box p={4} sx={{ backgroundColor: "#f9f9f9", borderRadius: "8px" }}>
      {/* Cabeçalho */}
      <Box mb={3}>
        <Typography variant="h5" sx={{ fontWeight: "bold", color: "#141C26" }}>
          {isPlanoLoading
            ? "Carregando planejamento..."
            : plano
            ? `${plano.descricao_plano} - ${
                plano.data_inicio && plano.data_fim
                  ? `${new Date(plano.data_inicio).toLocaleDateString("pt-BR")} a ${new Date(
                      plano.data_fim
                    ).toLocaleDateString("pt-BR")}`
                  : "-"
              }`
            : "Planejamento não encontrado"}
        </Typography>
        <Typography variant="h6" sx={{ color: "#00796B", mt: 1 }}>
          {descricaoAtividade || "Atividade não encontrada"} | Frente {idFrente || "Não encontrada"}
        </Typography>
      </Box>

      {/* Botões de Ação */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box />
        <Box display="flex" gap={1}>
          <Tooltip title="Adicionar Operação">
            <IconButton
              color="success"
              onClick={handleAdicionarOperacao}
              sx={{ backgroundColor: "#4caf50", ":hover": { backgroundColor: "#388e3c" } }}
            >
              <Add sx={{ color: "#fff" }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Voltar">
            <IconButton
              color="primary"
              onClick={() => navigate(-1)}
              sx={{ backgroundColor: "#e0f7fa", ":hover": { backgroundColor: "#b2ebf2" } }}
            >
              <KeyboardReturn />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Tabela de Operações */}
      <TableContainer component={Paper} sx={{ borderRadius: "8px", overflow: "hidden" }}>
        <Table>
          <TableHead sx={{ backgroundColor: "#141C26" }}>
            <TableRow>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>ATIVIDADE</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>DATA INÍCIO</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>DATA FIM</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>DIAS TOTAIS</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>ÁREA / PRODUÇÃO</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>DISPON.</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>DIAS DISPON.</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>PRODUÇÃO / DIA</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>EQUIP.</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>PESSOAS</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>AÇÕES</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isOperacoesLoading ? (
              <TableRow>
                <TableCell colSpan={11} align="center">
                  Carregando...
                </TableCell>
              </TableRow>
            ) : operacoes && operacoes.length > 0 ? (
              operacoes.map((operacao) => (
                <TableRow key={operacao.id}>
                  <TableCell>{operacao.descricao_operacao}</TableCell>
                  <TableCell>
                    {operacao.data_inicio
                      ? new Date(operacao.data_inicio).toLocaleDateString("pt-BR")
                      : "-"}
                  </TableCell>
                  <TableCell>
                    {operacao.data_fim
                      ? new Date(operacao.data_fim).toLocaleDateString("pt-BR")
                      : "-"}
                  </TableCell>
                  <TableCell>{operacao.dias_totais || "-"}</TableCell>
                  <TableCell>{operacao.area_producao || "-"}</TableCell>
                  <TableCell>{operacao.disponibilidade || "-"}</TableCell>
                  <TableCell>{operacao.dias_disponiveis || "-"}</TableCell>
                  <TableCell>{operacao.producao_dia || "-"}</TableCell>
                  <TableCell>{operacao.equipamentos || "-"}</TableCell>
                  <TableCell>{operacao.pessoas || "-"}</TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => handleEditarOperacao(operacao.id)}
                      sx={{ marginRight: "5px" }}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      color="secondary"
                      onClick={() => handleExcluirOperacao(operacao.id)}
                      sx={{ marginRight: "5px" }}
                    >
                      <Delete />
                    </IconButton>
                    <IconButton color="success" sx={{ marginRight: "5px" }}>
                      <CheckCircle />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={11} align="center">
                  Nenhuma operação encontrada.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default GerenciarOperacoes;
