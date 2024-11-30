import React, { useState, useEffect } from "react";
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
  Collapse,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Switch,
} from "@mui/material";
import {
  Add,
  Settings,
  Edit,
  Delete,
  CheckCircle,
  PlaylistAdd,
  ExpandLess,
  ExpandMore,
  KeyboardReturn,
} from "@mui/icons-material";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import dayjs from "dayjs";
import { usePlanejamentoContext } from "../PlanejamentoContext";

const PLANO_API_URL =
  "https://mrw3jl4pgh.execute-api.us-east-1.amazonaws.com/dev/GerenciaPlanejamento?table=cons_plano";
const ATIVIDADES_API_URL =
  "https://mrw3jl4pgh.execute-api.us-east-1.amazonaws.com/dev/GerenciaPlanejamento?table=cons_atividade";
const PLANEJAMENTO_API_URL =
  "https://mrw3jl4pgh.execute-api.us-east-1.amazonaws.com/dev/GerenciaPlanejamento?table=plan_planejamento";

const GerenciarPlanos = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { salvarDados } = usePlanejamentoContext();

  const [planos, setPlanos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedPlanos, setExpandedPlanos] = useState({});
  const [atividades, setAtividades] = useState({});
  const [allowMultipleExpand, setAllowMultipleExpand] = useState(false);
  const [descricaoPlanejamento, setDescricaoPlanejamento] = useState("");
  const [settingsOpen, setSettingsOpen] = useState(false);

  const idPlanejamento = searchParams.get("planejamentoId");

  useEffect(() => {
    if (idPlanejamento) {
      fetchPlanos(idPlanejamento);
      fetchPlanejamento(idPlanejamento);
    }
  }, [idPlanejamento]);

  const fetchPlanos = async (idPlanejamento) => {
    setLoading(true);
    try {
      const response = await axios.get(`${PLANO_API_URL}&id_planejamento=${idPlanejamento}`);
      setPlanos(response.data.result || []);
    } catch (error) {
      console.error("Erro ao buscar planos:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPlanejamento = async (idPlanejamento) => {
    try {
      const response = await axios.get(`${PLANEJAMENTO_API_URL}&id_planejamento=${idPlanejamento}`);
      const planejamento = response.data.result?.[0];
      setDescricaoPlanejamento(planejamento?.descricao_planejamento || "Planejamento Desconhecido");
    } catch (error) {
      console.error("Erro ao buscar planejamento:", error);
      setDescricaoPlanejamento("Erro ao buscar planejamento");
    }
  };

  const fetchAtividades = async (planoId) => {
    try {
      const response = await axios.get(`${ATIVIDADES_API_URL}&id_plano=${planoId}`);
      setAtividades((prev) => ({
        ...prev,
        [planoId]: response.data.result || [],
      }));
    } catch (error) {
      console.error("Erro ao buscar atividades:", error);
    }
  };

  const toggleExpandPlano = (planoId) => {
    const isExpanded = !!expandedPlanos[planoId];
    if (!allowMultipleExpand && !isExpanded) {
      setExpandedPlanos({});
    }
    if (!isExpanded) {
      fetchAtividades(planoId);
    }
    setExpandedPlanos((prev) => ({
      ...prev,
      [planoId]: !isExpanded,
    }));
  };

  const groupPlanosByTipo = () =>
    planos.reduce((acc, plano) => {
      if (!acc[plano.descricao_tipo_plano]) {
        acc[plano.descricao_tipo_plano] = [];
      }
      acc[plano.descricao_tipo_plano].push(plano);
      return acc;
    }, {});

  const groupedPlanos = groupPlanosByTipo();

  const formatarData = (data) => (data ? dayjs(data).format("DD/MM/YYYY") : "-");

  const handlePlaylistAdd = (planoId, atividadeId = null, frenteId = null) => {
    salvarDados({ id_plano: planoId, id_atividade: atividadeId, id_frente: frenteId });
    navigate("/destino");
  };

  return (
    <Box p={4} sx={{ backgroundColor: "#f9f9f9", borderRadius: "8px" }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Tooltip title={`ID: ${idPlanejamento}`}>
          <Typography variant="h5" sx={{ fontWeight: "bold", color: "#141C26" }}>
            {descricaoPlanejamento}
          </Typography>
        </Tooltip>
      </Box>

      <Dialog open={settingsOpen} onClose={() => setSettingsOpen(false)}>
        <DialogTitle>Configurações de Tela</DialogTitle>
        <DialogContent>
          <Box display="flex" alignItems="center" gap={2}>
            <Typography>Permitir múltiplos planos expandidos</Typography>
            <Switch
              checked={allowMultipleExpand}
              onChange={(e) => setAllowMultipleExpand(e.target.checked)}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSettingsOpen(false)}>Fechar</Button>
        </DialogActions>
      </Dialog>

      <TableContainer component={Paper} sx={{ borderRadius: "8px", overflow: "hidden" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell>Plano</TableCell>
              <TableCell>Data Início</TableCell>
              <TableCell>Data Fim</TableCell>
              <TableCell>Responsável</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  Carregando...
                </TableCell>
              </TableRow>
            ) : (
              Object.keys(groupedPlanos).map((tipoPlano) => (
                <React.Fragment key={tipoPlano}>
                  <TableRow>
                    <TableCell colSpan={6}>{tipoPlano.toUpperCase()}</TableCell>
                  </TableRow>
                  {groupedPlanos[tipoPlano].map((plano) => (
                    <React.Fragment key={plano.id}>
                      <TableRow onClick={() => toggleExpandPlano(plano.id)}>
                        <TableCell>
                          <IconButton>
                            {expandedPlanos[plano.id] ? <ExpandLess /> : <ExpandMore />}
                          </IconButton>
                        </TableCell>
                        <TableCell>{plano.descricao_plano}</TableCell>
                        <TableCell>{formatarData(plano.data_inicio)}</TableCell>
                        <TableCell>{formatarData(plano.data_fim)}</TableCell>
                        <TableCell>{plano.responsavel || "N/A"}</TableCell>
                        <TableCell>
                          <IconButton onClick={() => handlePlaylistAdd(plano.id)}>
                            <PlaylistAdd />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    </React.Fragment>
                  ))}
                </React.Fragment>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default GerenciarPlanos;
