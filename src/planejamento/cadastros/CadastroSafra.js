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
  Button,
  Switch,
  Collapse,
} from "@mui/material";
import {
  Add,
  Edit,
  Delete,
  CheckCircle,
  ExpandLess,
  ExpandMore,
  PlaylistAdd,
} from "@mui/icons-material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const PLANEJAMENTO_API_URL =
  "https://mrw3jl4pgh.execute-api.us-east-1.amazonaws.com/dev/GerenciaPlanejamento?table=plan_planejamento";
const PLANO_API_URL =
  "https://mrw3jl4pgh.execute-api.us-east-1.amazonaws.com/dev/GerenciaPlanejamento?table=cons_plano";

const CadastroSafra = () => {
  const [planejamentos, setPlanejamentos] = useState([]);
  const [expandedPlanejamento, setExpandedPlanejamento] = useState(null);
  const [expandedPlanos, setExpandedPlanos] = useState({});
  const [planos, setPlanos] = useState([]);
  const [allowMultipleExpand, setAllowMultipleExpand] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPlanejamentos();
  }, []);

  const fetchPlanejamentos = async () => {
    try {
      const response = await axios.get(PLANEJAMENTO_API_URL);
      setPlanejamentos(response.data.result || []);
    } catch (error) {
      console.error("Erro ao buscar planejamentos:", error);
    }
  };

  const fetchPlanos = async (idPlanejamento) => {
    try {
      const response = await axios.get(`${PLANO_API_URL}&id_planejamento=${idPlanejamento}`);
      setPlanos((prevPlanos) => ({
        ...prevPlanos,
        [idPlanejamento]: response.data.result || [],
      }));
    } catch (error) {
      console.error("Erro ao buscar planos:", error);
    }
  };

  const handleExpandPlanejamento = (planejamento) => {
    const isExpanded = planejamento.id === expandedPlanejamento;

    if (allowMultipleExpand) {
      setPlanos((prevPlanos) => {
        if (!prevPlanos[planejamento.id]) {
          fetchPlanos(planejamento.id);
        }
        return prevPlanos;
      });
    } else {
      if (!isExpanded) {
        setPlanos({});
        fetchPlanos(planejamento.id);
      }
    }

    setExpandedPlanejamento(isExpanded ? null : planejamento.id);

    // Grava o planejamento selecionado no localStorage
    if (!isExpanded) {
      localStorage.setItem("planejamentoSelecionado", JSON.stringify(planejamento));
    }
  };

  const handleGerenciarPlanos = (idPlanejamento) => {
    navigate(`/planejamento/cadastros/gerenciarplanos?planejamentoId=${idPlanejamento}`);
  };

  return (
    <Box p={4} sx={{ backgroundColor: "#f9f9f9", borderRadius: "8px" }}>
      {/* Cabeçalho */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" sx={{ fontWeight: "bold", color: "#141C26" }}>
          Planejamento Agrícola
        </Typography>
        <Box display="flex" gap={2}>
          <IconButton
            sx={{
              backgroundColor: "#5CC6BA",
              color: "#fff",
              ":hover": { backgroundColor: "#3CE342" },
            }}
          >
            <Add />
          </IconButton>
        </Box>
      </Box>

      {/* Toggle para permitir múltiplos itens abertos */}
      <Box mb={2} display="flex" alignItems="center" gap={2}>
        <Typography variant="body1" sx={{ color: "#141C26" }}>
          Permitir múltiplos itens expandidos
        </Typography>
        <Switch
          checked={allowMultipleExpand}
          onChange={(e) => setAllowMultipleExpand(e.target.checked)}
        />
      </Box>

      {/* Planejamentos */}
      <TableContainer component={Paper} sx={{ borderRadius: "8px", overflow: "hidden" }}>
        <Table>
          <TableHead sx={{ backgroundColor: "#141C26" }}>
            <TableRow>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>PLANEJAMENTO</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>DATA INÍCIO</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>DATA FIM</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>CULTURA</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>AÇÕES</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {planejamentos.map((planejamento) => (
              <React.Fragment key={planejamento.id}>
                <TableRow
                  sx={{ "&:hover": { backgroundColor: "#E8F5E9", cursor: "pointer" } }}
                  onClick={() => handleExpandPlanejamento(planejamento)}
                >
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      {expandedPlanejamento === planejamento.id ? <ExpandLess /> : <ExpandMore />}
                      {planejamento.descricao_planejamento}
                    </Box>
                  </TableCell>
                  <TableCell>{planejamento.data_inicio}</TableCell>
                  <TableCell>{planejamento.data_fim}</TableCell>
                  <TableCell>{planejamento.cultura}</TableCell>
                  <TableCell>
                    <IconButton
                      color="default"
                      onClick={() => handleGerenciarPlanos(planejamento.id)}
                    >
                      <PlaylistAdd />
                    </IconButton>
                    <IconButton color="primary">
                      <Edit />
                    </IconButton>
                    <IconButton color="secondary">
                      <Delete />
                    </IconButton>
                    <IconButton color="success">
                      <CheckCircle />
                    </IconButton>
                  </TableCell>
                </TableRow>
                {/* Planos Vinculados */}
                <TableRow>
                  <TableCell colSpan={5} sx={{ padding: 0 }}>
                    <Collapse in={expandedPlanejamento === planejamento.id || allowMultipleExpand}>
                      <Table size="small">
                        <TableHead>
                          <TableRow sx={{ backgroundColor: "#f9f9f9" }}>
                            <TableCell sx={{ fontWeight: "bold" }}>PLANO</TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>DATA INÍCIO</TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>DATA FIM</TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>DIAS TOTAIS</TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>ÁREA / PRODUÇÃO</TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>PRODUÇÃO / DIA</TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>RESPONSÁVEL</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {(planos[planejamento.id] || []).map((plano) => (
                            <TableRow key={plano.id}>
                              <TableCell>{plano.descricao_plano}</TableCell>
                              <TableCell>{plano.data_inicio}</TableCell>
                              <TableCell>{plano.data_fim}</TableCell>
                              <TableCell>{plano.dias_totais}</TableCell>
                              <TableCell>{plano.producao}</TableCell>
                              <TableCell>{plano.producao_dia}</TableCell>
                              <TableCell>{plano.responsavel || "N/A"}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </Collapse>
                  </TableCell>
                </TableRow>
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default CadastroSafra;
