import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from "@mui/material";
import { Add, Settings, Visibility, Edit, Delete, CheckCircle } from "@mui/icons-material";
import axios from "axios";

const PLANO_API_URL = "https://mrw3jl4pgh.execute-api.us-east-1.amazonaws.com/dev/GerenciaPlanejamento?table=cons_plano";

const CadastroPlano = () => {
  const [planos, setPlanos] = useState([]);

  // Busca de dados
  useEffect(() => {
    fetchPlanos();
  }, []);

  const fetchPlanos = async () => {
    try {
      const response = await axios.get(PLANO_API_URL);
      setPlanos(response.data.result);
    } catch (error) {
      console.error("Erro ao buscar planos:", error);
    }
  };

  return (
    <Box p={4} sx={{ backgroundColor: "#f9f9f9", borderRadius: "8px" }}>
      {/* Cabeçalho */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" sx={{ fontWeight: "bold", color: "#2F3A48" }}>
          Cenário: Entressafra 2022/23
        </Typography>
        <Box display="flex" gap={2}>
          <IconButton sx={{ backgroundColor: "#3C8DBC", color: "#fff", ":hover": { backgroundColor: "#367FA9" } }}>
            <Add />
          </IconButton>
          <IconButton sx={{ backgroundColor: "#3C8DBC", color: "#fff", ":hover": { backgroundColor: "#367FA9" } }}>
            <Settings />
          </IconButton>
        </Box>
      </Box>

      {/* Tabela */}
      <TableContainer component={Paper} sx={{ borderRadius: "8px", overflow: "hidden" }}>
        <Table>
          {/* Cabeçalho da Tabela */}
          <TableHead sx={{ backgroundColor: "#2F3A48" }}>
            <TableRow>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>PLANEJAMENTO</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>DATA INÍCIO</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>DATA FIM</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>DIAS TOTAIS</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>ÁREA / PRODUÇÃO</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>PRODUÇÃO / DIA</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>RESPONSÁVEL</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>AÇÕES</TableCell>
            </TableRow>
          </TableHead>
          {/* Corpo da Tabela */}
          <TableBody>
            {planos.map((plano, index) => (
              <React.Fragment key={index}>
                {/* Agrupamento */}
                {index === 0 || planos[index - 1].descricao_tipo_plano !== plano.descricao_tipo_plano ? (
                  <TableRow sx={{ backgroundColor: "#E3F2FD" }}>
                    <TableCell colSpan={8} sx={{ fontWeight: "bold", color: "#2F3A48" }}>
                      {plano.descricao_tipo_plano}
                    </TableCell>
                  </TableRow>
                ) : null}
                {/* Linhas de Dados */}
                <TableRow sx={{ "&:hover": { backgroundColor: "#E8F5E9" } }}>
                  <TableCell>{plano.descricao_plano}</TableCell>
                  <TableCell>{plano.data_inicio}</TableCell>
                  <TableCell>{plano.data_fim}</TableCell>
                  <TableCell>{plano.dias_totais}</TableCell>
                  <TableCell>{plano.producao}</TableCell>
                  <TableCell>{plano.producao_dia}</TableCell>
                  <TableCell>{plano.responsavel || "N/A"}</TableCell>
                  <TableCell>
                    <IconButton color="default">
                      <Visibility />
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
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default CadastroPlano;
