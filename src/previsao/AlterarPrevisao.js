// src/previsao/AlterarPrevisao.js

import React from 'react';
import { Dialog } from '@mui/material';
import AlterarDepartamentoDialog from './AlterarDepartamentoDialog';
import AlterarFuncaoDialog from './AlterarFuncaoDialog';

const AlterarPrevisao = ({
  openDialogDepartamento,
  openDialogFuncao,
  handleCloseDialogDepartamento,
  handleCloseDialogFuncao,
  selectedRow,
  fetchData,
  empresaFilter,
  departamentos,
  funcoes
}) => {
  return (
    <>
      {/* Diálogo para alterar o departamento */}
      <Dialog open={openDialogDepartamento} onClose={handleCloseDialogDepartamento}>
        <AlterarDepartamentoDialog
          open={openDialogDepartamento}
          onClose={handleCloseDialogDepartamento}
          selectedRow={selectedRow}
          fetchData={fetchData}
          empresaFilter={empresaFilter}
          departamentos={departamentos} // Passa os departamentos carregados
        />
      </Dialog>

      {/* Diálogo para alterar a função */}
      <Dialog open={openDialogFuncao} onClose={handleCloseDialogFuncao}>
        <AlterarFuncaoDialog
          open={openDialogFuncao}
          onClose={handleCloseDialogFuncao}
          selectedRow={selectedRow}
          fetchData={fetchData}
          empresaFilter={empresaFilter}
          funcoes={funcoes} // Passa as funções carregadas
        />
      </Dialog>
    </>
  );
};

export default AlterarPrevisao;
