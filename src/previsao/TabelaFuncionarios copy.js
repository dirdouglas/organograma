import React, { useContext } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import CheckIcon from '@mui/icons-material/Check';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import Delete from '@mui/icons-material/Delete';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import { EmpresaContext } from '../EmpresaContext';  // Importando o contexto da empresa

const TabelaFuncionarios = ({
  filteredData,
  handleClickOpenDialogDepartamento,
  handleClickOpenDialogFuncao,
  handleClickOpenJustificativaDialog,
  confirmarPrevisao,
  handleClickOpenDemissaoDialog,
  handleDeletePrevisao,  // Função de deletar
  duplicarPrevisao,      // Função para duplicar
  getRowColor  // Função para definir a cor do texto
}) => {
  const { empresaId } = useContext(EmpresaContext);  // Obtendo o id_empresa do contexto

  return (
    <TableContainer component={Paper} style={{ marginTop: '5px', overflow: 'visible' }}>
      <Table stickyHeader>
        <TableHead style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor: '#1976d2' }}>
          <TableRow>
            <TableCell style={headStyle}>Matrícula</TableCell>
            <TableCell style={headStyle}>Nome do Colaborador</TableCell>
            <TableCell style={headStyle}>Função Atual</TableCell>
            <TableCell style={headStyle}>Função Prevista</TableCell>
            <TableCell style={headStyle}>Departamento</TableCell>
            <TableCell style={headStyle}>Contratação</TableCell>
            <TableCell style={headStyle}>Demissão</TableCell>
            <TableCell style={headStyle}>Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredData.map((row, index) => (
            <TableRow key={index} style={{ height: '15px' }}>
              <TableCell style={{ ...rowStyle, color: getRowColor(row) }}>{row.matricula}</TableCell>
              <TableCell style={{ ...rowStyle, color: getRowColor(row) }}>{row.nome_colaborador}</TableCell>
              <TableCell style={{ ...rowStyle, color: getRowColor(row) }}>{row.descricao_funcao_atual}</TableCell>
              <TableCell
                style={{ ...rowClickableStyle, color: getRowColor(row) }}
                onClick={() => handleClickOpenDialogFuncao(row)}
              >
                {row.descricao_funcao_prevista}
              </TableCell>
              <TableCell
                style={{ ...rowClickableStyle, color: getRowColor(row) }}
                onClick={() => handleClickOpenDialogDepartamento(row)}
              >
                {row.descricao_departamento}
              </TableCell>
              <TableCell style={{ ...rowStyle, color: getRowColor(row) }}>
                {new Date(row.data_contratacao).toLocaleDateString()}
              </TableCell>
              <TableCell style={{ ...rowStyle, color: getRowColor(row) }}>
                {row.data_demissao ? new Date(row.data_demissao).toLocaleDateString() : ''}
              </TableCell>
              <TableCell style={rowStyle}>
                <IconButton onClick={() => handleClickOpenJustificativaDialog(row)}><InfoIcon /></IconButton>
                <IconButton onClick={() => confirmarPrevisao(row)}><CheckIcon /></IconButton>
                <IconButton onClick={() => handleClickOpenDemissaoDialog(row)}><PersonRemoveIcon /></IconButton>
                <IconButton onClick={() => handleDeletePrevisao(row)}><Delete /></IconButton> {/* Função de deletar */}
                <IconButton onClick={() => duplicarPrevisao(row)}><GroupAddIcon /></IconButton> {/* Função de duplicar */}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

// Estilos ajustados para manter a formatação igual ao componente ResumoQuadroPrevisto
const headStyle = {
  backgroundColor: '#1976d2',
  color: '#fff',
  fontWeight: 'bold',
  textTransform: 'uppercase',
  padding: '5px',
  height: '20px'
};

const rowStyle = {
  color: 'inherit',
  fontSize: '0.8rem',
  padding: '5px 10px',
  height: '20px'
};

const rowClickableStyle = {
  ...rowStyle,
  cursor: 'pointer'
};

export default TabelaFuncionarios;
