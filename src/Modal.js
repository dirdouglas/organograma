import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Modal, Box, IconButton } from '@mui/material';
import Quantidades from './Quantidades'; // Importando o Popup Quantidades.js
import CloseIcon from '@mui/icons-material/Close';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import VisibilityIcon from '@mui/icons-material/Visibility';

const ModalComponent = ({ data, onClose }) => {
  const [openPopup, setOpenPopup] = useState(false);
  const [selectedItem, setSelectedItem] = useState([]);
  const [sortDirection, setSortDirection] = useState('asc');
  const [sortColumn, setSortColumn] = useState(null);
  const [sortedItems, setSortedItems] = useState([]);

  // Função para abrir o popup com os detalhes do item
  const handleOpenPopup = (group) => {
    const allDetails = group.flatMap(item => item.detalhes || []); // Ajuste conforme sua estrutura de dados
    setSelectedItem(allDetails);
    setOpenPopup(true);
  };

  // Função para ordenar os itens
  const handleSort = (column) => {
    const sorted = [...sortedItems].sort((a, b) => {
      const valueA = a.reduce((sum, item) => sum + (item[column] || 0), 0);
      const valueB = b.reduce((sum, item) => sum + (item[column] || 0), 0);
      if (sortDirection === 'asc') {
        return valueA > valueB ? 1 : -1;
      }
      return valueA < valueB ? 1 : -1;
    });
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    setSortColumn(column);
    setSortedItems(sorted);
  };

  // Função para agrupar os itens
  const groupByKeys = (data, keys) => {
    const grouped = data.reduce((acc, item) => {
      const groupKey = keys.map((key) => item[key]).join('-');
      if (!acc[groupKey]) {
        acc[groupKey] = [];
      }
      acc[groupKey].push(item);
      return acc;
    }, {});
    return Object.values(grouped);
  };

  // Agrupar os itens com base nas colunas
  const groupedItems = groupByKeys(data, ['desc_produto', 'desc_grupo_produto', 'desc_fornecedor']);
  
  // Inicializar a tabela com os itens agrupados
  useState(() => {
    setSortedItems(groupedItems);
  }, [data]);

  return (
    <Modal open={true} onClose={onClose} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Box style={{ backgroundColor: 'white', padding: '20px', width: '80%', maxHeight: '80vh', overflowY: 'auto', borderRadius: '8px' }}>
        <IconButton onClick={onClose} style={{ float: 'right' }}>
          <CloseIcon />
        </IconButton>

        <TableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>
                  <IconButton onClick={() => handleSort('desc_produto')}>
                    Produto {sortColumn === 'desc_produto' && (sortDirection === 'asc' ? <ArrowDownwardIcon /> : <ArrowUpwardIcon />)}
                  </IconButton>
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleSort('desc_grupo_produto')}>
                    Grupo Produto {sortColumn === 'desc_grupo_produto' && (sortDirection === 'asc' ? <ArrowDownwardIcon /> : <ArrowUpwardIcon />)}
                  </IconButton>
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleSort('desc_fornecedor')}>
                    Fornecedor {sortColumn === 'desc_fornecedor' && (sortDirection === 'asc' ? <ArrowDownwardIcon /> : <ArrowUpwardIcon />)}
                  </IconButton>
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleSort('valor_total')}>
                    Valor Total (R$) {sortColumn === 'valor_total' && (sortDirection === 'asc' ? <ArrowDownwardIcon /> : <ArrowUpwardIcon />)}
                  </IconButton>
                </TableCell>
                <TableCell>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedItems.map((group, index) => {
                const totalValue = group.reduce((sum, item) => sum + (item.valor_total || 0), 0);
                return (
                  <TableRow key={index}>
                    <TableCell>{group[0].desc_produto}</TableCell>
                    <TableCell>{group[0].desc_grupo_produto}</TableCell>
                    <TableCell>{group[0].desc_fornecedor}</TableCell>
                    <TableCell>R$ {totalValue.toFixed(2).replace('.', ',')}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleOpenPopup(group)}>
                        <VisibilityIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>

        <Modal open={openPopup} onClose={() => setOpenPopup(false)} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Box style={{ backgroundColor: 'white', padding: '20px', width: '50%', borderRadius: '8px' }}>
            {selectedItem.length > 0 && <Quantidades item={selectedItem} onClose={() => setOpenPopup(false)} />}
          </Box>
        </Modal>
      </Box>
    </Modal>
  );
};

export default ModalComponent;
