import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Box, Typography } from '@mui/material';

const Quantidades = ({ item, onClose }) => {
  console.log("Dados recebidos no Quantidades.js:", item);

  const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

  const [editState, setEditState] = useState({
    quantities: [],
    unitValue: 0,
    editable: {
      quantities: [],
      unitValue: false,
    },
  });

  useEffect(() => {
    if (item && item.length > 0) {
      const uniqueCentrosDeCusto = [...new Set(item.map(i => i.desc_centro_custo))];
      setEditState({
        quantities: uniqueCentrosDeCusto.map(() => Array(12).fill(0)),
        unitValue: 0,
        editable: {
          quantities: uniqueCentrosDeCusto.map(() => Array(12).fill(false)),
          unitValue: false,
        },
      });

      item.forEach(detalhe => {
        const centroIndex = uniqueCentrosDeCusto.indexOf(detalhe.desc_centro_custo);
        if (centroIndex !== -1) {
          detalhe.quantidades.forEach((quantidade, monthIndex) => {
            editState.quantities[centroIndex][monthIndex] += quantidade;
          });
        }
      });
    } else {
      console.error("Item não é um array ou está indefinido:", item);
    }
  }, [item, editState.quantities]); // Adicione editState.quantities aqui

  if (!item || !item.length) {
    return <Typography variant="h6">Nenhum dado disponível</Typography>;
  }

  const handleQuantityChange = (centroIndex, monthIndex, value) => {
    const updatedQuantities = [...editState.quantities];
    updatedQuantities[centroIndex][monthIndex] = value === '' ? 0 : parseFloat(value);
    setEditState({ ...editState, quantities: updatedQuantities });
  };

  const handleSave = () => {
    console.log('Quantidades Salvas:', editState.quantities);
    console.log('Valor Unitário Salvo:', editState.unitValue);
    onClose();
  };

  return (
    <Box style={{ padding: '20px', backgroundColor: 'white', borderRadius: '8px' }}>
      <Typography variant="h6" gutterBottom>
        Quantidades por Centro de Custo
      </Typography>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Centro de Custo</TableCell>
              {months.map((month, index) => (
                <TableCell key={index}>{month}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {editState.quantities.map((quantities, centroIndex) => (
              <TableRow key={centroIndex}>
                <TableCell>{item[centroIndex]?.desc_centro_custo || 'Desconhecido'}</TableCell>
                {quantities.map((quantity, monthIndex) => (
                  <TableCell key={monthIndex}>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => handleQuantityChange(centroIndex, monthIndex, e.target.value)}
                      style={{ width: '100%' }}
                    />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box display="flex" justifyContent="space-between" marginTop={2}>
        <Button variant="contained" color="primary" onClick={handleSave}>
          Salvar
        </Button>
        <Button variant="outlined" color="secondary" onClick={onClose}>
          Fechar
        </Button>
      </Box>
    </Box>
  );
};

export default Quantidades;
