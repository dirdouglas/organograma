import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Card,
  CardContent,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack'; // Ícone de voltar
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'https://l7ncax7c86.execute-api.us-east-1.amazonaws.com/dev/areas_safra';

const GerenciarAreas = () => {
  const { safraId } = useParams(); // ID da safra recebido via URL
  const navigate = useNavigate(); // Hook para navegação
  const [linkedAreas, setLinkedAreas] = useState([]); // Áreas já vinculadas
  const [newArea, setNewArea] = useState(''); // ID da nova parte a ser vinculada
  const [open, setOpen] = useState(false); // Controle de modal para adicionar nova área
  const [totalAreaTalhoes, setTotalAreaTalhoes] = useState(0); // Total área talhões
  const [totalAreaPartes, setTotalAreaPartes] = useState(0); // Total área partes

  useEffect(() => {
    fetchLinkedAreas();
  }, [safraId]);

  const fetchLinkedAreas = async () => {
    try {
      const response = await axios.get(`${API_URL}?id_safra=${safraId}`);
      const parsedData = JSON.parse(response.data.body);
      setLinkedAreas(Array.isArray(parsedData) ? parsedData : []);
      calculateTotals(parsedData);
    } catch (error) {
      console.error('Erro ao buscar áreas vinculadas:', error);
      setLinkedAreas([]);
      setTotalAreaTalhoes(0);
      setTotalAreaPartes(0);
    }
  };

  const calculateTotals = (areas) => {
    if (!areas || !Array.isArray(areas)) return;

    // Total área talhões sem duplicação
    const uniqueTalhoes = new Set(areas.map((area) => area.codigo_talhao));
    const totalTalhoes = Array.from(uniqueTalhoes)
      .map((codigo) => {
        const talhao = areas.find((area) => area.codigo_talhao === codigo);
        return talhao?.area_talhao || 0;
      })
      .reduce((acc, curr) => acc + curr, 0);

    // Total área partes
    const totalPartes = areas
      .map((area) => area.area_parte || 0)
      .reduce((acc, curr) => acc + curr, 0);

    setTotalAreaTalhoes(totalTalhoes);
    setTotalAreaPartes(totalPartes);
  };

  const handleAddArea = async () => {
    try {
      if (!newArea) {
        alert('Informe o ID da parte para vincular.');
        return;
      }
      await axios.post(API_URL, { id_safra: safraId, id_parte: newArea });
      fetchLinkedAreas();
      setOpen(false);
      setNewArea('');
    } catch (error) {
      console.error('Erro ao adicionar área:', error.response?.data || error.message);
      alert('Erro ao adicionar a área. Verifique se o ID da parte é válido.');
    }
  };

  const handleRemoveArea = async (idParte, idSafra) => {
    try {
      if (!idParte || !idSafra) {
        alert('Erro: Parâmetros id_parte ou id_safra estão ausentes.');
        return;
      }

      await axios.delete(`${API_URL}?id_parte=${idParte}&id_safra=${idSafra}`);
      fetchLinkedAreas();
    } catch (error) {
      console.error('Erro ao remover área:', error.response?.data || error.message);
      alert('Erro ao remover a área.');
    }
  };

  return (
    <Box p={3}>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Typography variant="h4">Gerenciar Áreas da Safra {safraId}</Typography>

        <Box display="flex" gap={2}>
          {/* Card Total Área Talhões */}
          <Card>
            <CardContent>
              <Typography variant="h6" align="center">
                Total Área Talhões
              </Typography>
              <Typography variant="body1" align="center">
                {totalAreaTalhoes.toFixed(2)} ha
              </Typography>
            </CardContent>
          </Card>

          {/* Card Total Área Partes */}
          <Card>
            <CardContent>
              <Typography variant="h6" align="center">
                Total Área Partes
              </Typography>
              <Typography variant="body1" align="center">
                {totalAreaPartes.toFixed(2)} ha
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>

      <Box display="flex" alignItems="center" mt={2}>
        <IconButton onClick={() => navigate('/planejamento/cadastros/safra')}>
          <ArrowBackIcon />
        </IconButton>
        <Button variant="contained" color="primary" onClick={() => setOpen(true)} sx={{ ml: 2 }}>
          Adicionar Nova Área
        </Button>
      </Box>

      <Typography variant="h6" mt={3}>
        Áreas Vinculadas
      </Typography>
      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Código Talhão</TableCell>
              <TableCell>Propriedade</TableCell>
              <TableCell>Talhão</TableCell>
              <TableCell>Parte</TableCell>
              <TableCell>Área Talhão</TableCell>
              <TableCell>Área Parte</TableCell>
              <TableCell>% Área</TableCell>
              <TableCell>Data Plantio</TableCell>
              <TableCell>Data Colheita</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {linkedAreas.map((area) => (
              <TableRow key={area.id_parte}>
                <TableCell>{area.codigo_talhao}</TableCell>
                <TableCell>{area.propriedade}</TableCell>
                <TableCell>{area.codigo_talhao}</TableCell>
                <TableCell>{area.numero_corte}</TableCell>
                <TableCell>{area.area_talhao}</TableCell>
                <TableCell>{area.area_parte}</TableCell>
                <TableCell>{area.percentual_area}%</TableCell>
                <TableCell>{new Date(area.data_plantio).toLocaleDateString()}</TableCell>
                <TableCell>{new Date(area.data_colheita).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Button
                    size="small"
                    color="error"
                    onClick={() => handleRemoveArea(area.id_parte, area.id_safra)}
                  >
                    Remover
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Adicionar Nova Área</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="ID da Parte"
            fullWidth
            value={newArea}
            onChange={(e) => setNewArea(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="secondary">
            Cancelar
          </Button>
          <Button onClick={handleAddArea} color="primary">
            Adicionar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default GerenciarAreas;
