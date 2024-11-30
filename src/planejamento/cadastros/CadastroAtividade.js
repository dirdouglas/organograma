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
} from "@mui/material";
import { ArrowBack, Edit, Delete } from "@mui/icons-material";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = "https://mrw3jl4pgh.execute-api.us-east-1.amazonaws.com/dev/GerenciaPlanejamento";

const CadastroAtividade = () => {
  const { idPlano } = useParams();
  const navigate = useNavigate();
  const [atividades, setAtividades] = useState([]);

  useEffect(() => {
    fetchAtividades();
  }, [idPlano]);

  const fetchAtividades = async () => {
    try {
      const response = await axios.get(`${API_URL}?table=cons_atividade&id_plano=${idPlano}`);
      setAtividades(response.data.result || []);
    } catch (error) {
      console.error("Erro ao buscar atividades:", error);
    }
  };

  return (
    <Box display="flex" height="100vh">
      {/* Sidebar */}
      <Box
        sx={{
          width: "80px",
          backgroundColor: "#2F3A48",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: "20px",
        }}
      >
        <IconButton sx={{ color: "#fff", marginBottom: "20px" }}>
          <i className="fa-solid fa-seedling" style={{ fontSize: "24px" }}></i>
        </IconButton>
        <IconButton sx={{ color: "#fff", marginBottom: "20px" }}>
          <i className="fa-solid fa-building" style={{ fontSize: "24px" }}></i>
        </IconButton>
        <IconButton sx={{ color: "#fff", marginBottom: "20px" }}>
          <i className="fa-solid fa-dollar-sign" style={{ fontSize: "24px" }}></i>
        </IconButton>
      </Box>

      {/* Main Content */}
      <Box flex={1} p={4} sx={{ backgroundColor: "#f5f5f5" }}>
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h5" sx={{ fontWeight: "bold", color: "#2F3A48" }}>
            Plantio de Cana - Ano / 01/10/2022 a 20/12/2022
          </Typography>
          <Button
            startIcon={<ArrowBack />}
            variant="contained"
            sx={{
              backgroundColor: "#3C8DBC",
              ":hover": { backgroundColor: "#367FA9" },
              color: "#fff",
            }}
            onClick={() => navigate(-1)}
          >
            Voltar
          </Button>
        </Box>

        {/* Tabela de Atividades */}
        <TableContainer component={Paper} sx={{ borderRadius: "8px", boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)" }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#2F3A48" }}>
                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>ATIVIDADE</TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>DATA INÍCIO</TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>DATA FIM</TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>DIAS TOTAIS</TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>DISPON.</TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>PRODUÇÃO/DIA</TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>AÇÕES</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {atividades.map((atividade, index) => (
                <TableRow
                  key={index}
                  sx={{
                    "&:nth-of-type(even)": { backgroundColor: "#f9f9f9" },
                    "&:hover": { backgroundColor: "#dff0d8" },
                  }}
                >
                  <TableCell>{atividade.descricao_atividade}</TableCell>
                  <TableCell>{atividade.data_inicio}</TableCell>
                  <TableCell>{atividade.data_fim}</TableCell>
                  <TableCell>{atividade.dias_totais}</TableCell>
                  <TableCell>{atividade.disponibilidade}</TableCell>
                  <TableCell>{atividade.producao_dia}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => console.log("Edit")} color="primary">
                      <Edit />
                    </IconButton>
                    <IconButton onClick={() => console.log("Delete")} color="secondary">
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default CadastroAtividade;
