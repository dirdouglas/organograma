import React, { useEffect, useState } from "react";
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
import {
  Favorite,
  FavoriteBorder,
  Edit,
  Delete,
  CheckCircle,
  PlaylistAdd,
  KeyboardReturn,
  Add,
  Settings,
} from "@mui/icons-material";
import { useNavigate, useSearchParams } from "react-router-dom";
import dayjs from "dayjs";
import { useFetchPlanoById, useFetchAtividadesByPlanoId } from "../PlanejamentoContext";

const GerenciarAtividades = () => {
  const [searchParams] = useSearchParams();
  const idPlano = searchParams.get("planoId");
  const navigate = useNavigate();

  // React Query hooks
  const { data: dadosPlano, isLoading: isPlanoLoading } = useFetchPlanoById(idPlano);
  const { data: atividades, isLoading: isAtividadesLoading } = useFetchAtividadesByPlanoId(idPlano);

  // Local state
  const [atividadesAgrupadas, setAtividadesAgrupadas] = useState({});
  const [favorites, setFavorites] = useState({});

  // Agrupa as atividades sempre que os dados mudarem
  useEffect(() => {
    if (atividades) {
      const agrupadas = agruparAtividadesPorFrente(atividades);
      setAtividadesAgrupadas(agrupadas);
    }
  }, [atividades]);

  const agruparAtividadesPorFrente = (atividades) => {
    return atividades.reduce((acc, atividade) => {
      const { descricao_frente, id_frente } = atividade;
      if (!acc[descricao_frente]) {
        acc[descricao_frente] = { id_frente, atividades: [] };
      }
      acc[descricao_frente].atividades.push(atividade);
      return acc;
    }, {});
  };

  const toggleFavorite = (atividadeId) => {
    setFavorites((prev) => ({
      ...prev,
      [atividadeId]: !prev[atividadeId],
    }));
  };

  const formatarData = (data) => (data ? dayjs(data).format("DD/MM/YYYY") : "-");

  const navegarParaOperacoes = (idFrente) => {
    navigate(`/planejamento/cadastros/gerenciaroperacoes?id_frente=${idFrente}`);
  };

  return (
    <Box p={4} sx={{ backgroundColor: "#f9f9f9", borderRadius: "8px" }}>
      {/* Cabeçalho */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" sx={{ fontWeight: "bold", color: "#141C26" }}>
          {isPlanoLoading
            ? "Carregando plano..."
            : `${dadosPlano?.descricao_plano || "Plano não encontrado"} - ${
                formatarData(dadosPlano?.data_inicio) || "-"
              } a ${formatarData(dadosPlano?.data_fim) || "-"}`}
        </Typography>
        <Box display="flex" gap={1} alignItems="center">
          <Tooltip title="Adicionar">
            <IconButton
              color="success"
              sx={{ backgroundColor: "#4caf50", ":hover": { backgroundColor: "#388e3c" } }}
            >
              <Add sx={{ color: "#fff" }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Configurações">
            <IconButton
              color="default"
              sx={{ backgroundColor: "#9e9e9e", ":hover": { backgroundColor: "#757575" } }}
            >
              <Settings sx={{ color: "#fff" }} />
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

      {/* Tabela de Atividades por Frente */}
      {isAtividadesLoading ? (
        <Typography textAlign="center">Carregando atividades...</Typography>
      ) : Object.keys(atividadesAgrupadas || {}).length > 0 ? (
        Object.entries(atividadesAgrupadas).map(([frente, frenteData]) => (
          <Box key={frente} mb={4}>
            {/* Subtítulo da Frente */}
            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
                color: "#00796B",
                marginBottom: 2,
                textTransform: "uppercase",
              }}
            >
              {frente}
            </Typography>
            {/* Tabela de Atividades */}
            <TableContainer component={Paper} sx={{ borderRadius: "8px", overflow: "hidden" }}>
              <Table>
                <TableHead sx={{ backgroundColor: "#141C26" }}>
                  <TableRow>
                    <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>FAV</TableCell>
                    <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>ATIVIDADE</TableCell>
                    <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>DATA INÍCIO</TableCell>
                    <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>DATA FIM</TableCell>
                    <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>DIAS TOTAIS</TableCell>
                    <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>ÁREA / PRODUÇÃO</TableCell>
                    <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>PRODUÇÃO / DIA</TableCell>
                    <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>EQUIP.</TableCell>
                    <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>PESSOAS</TableCell>
                    <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>AÇÕES</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {frenteData.atividades.length > 0 ? (
                    frenteData.atividades.map((atividade) => (
                      <TableRow key={atividade.id_atividade} sx={{ height: "35px" }}>
                        <TableCell>
                          <IconButton
                            color="error"
                            onClick={() => toggleFavorite(atividade.id_atividade)}
                            sx={{ padding: "0px" }}
                          >
                            {favorites[atividade.id_atividade] ? <Favorite /> : <FavoriteBorder />}
                          </IconButton>
                        </TableCell>
                        <TableCell>{atividade.descricao_atividade}</TableCell>
                        <TableCell>{formatarData(atividade.data_inicio)}</TableCell>
                        <TableCell>{formatarData(atividade.data_fim)}</TableCell>
                        <TableCell>{atividade.dias_totais || "-"}</TableCell>
                        <TableCell>{atividade.producao || "-"}</TableCell>
                        <TableCell>{atividade.producao_dia || "-"}</TableCell>
                        <TableCell>{atividade.equipamentos || "-"}</TableCell>
                        <TableCell>{atividade.pessoas || "-"}</TableCell>
                        <TableCell>
                          <IconButton
                            color="default"
                            onClick={() => navegarParaOperacoes(frenteData.id_frente)}
                            sx={{ height: "25px", padding: "0px", marginRight: "5px" }}
                          >
                            <PlaylistAdd />
                          </IconButton>
                          <IconButton
                            color="primary"
                            sx={{ height: "25px", padding: "0px", marginRight: "5px" }}
                          >
                            <Edit />
                          </IconButton>
                          <IconButton
                            color="secondary"
                            sx={{ height: "25px", padding: "0px", marginRight: "5px" }}
                          >
                            <Delete />
                          </IconButton>
                          <IconButton
                            color="success"
                            sx={{ height: "25px", padding: "0px", marginRight: "5px" }}
                          >
                            <CheckCircle />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={10} align="center">
                        Nenhuma atividade encontrada para esta frente.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        ))
      ) : (
        <Typography textAlign="center">Nenhuma frente encontrada.</Typography>
      )}
    </Box>
  );
};

export default GerenciarAtividades;
