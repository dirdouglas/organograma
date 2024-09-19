// src/resumo/FiltrosResumo.js

import React from 'react';
import { Grid, TextField, Autocomplete } from '@mui/material';
import Filtros from '../previsao/Filtros'; // Reaproveitar o componente já salvo

const FiltrosResumo = ({ filtros, setFiltros, uniqueDepartamentos, uniqueNiveis1, uniqueNiveis2, uniqueGestores }) => {
  return (
    <Filtros
      filters={filtros}
      setFilters={setFiltros}
      uniqueDepartamentosAtuais={uniqueDepartamentos}
      uniqueFuncoesAtuais={uniqueNiveis1}
      uniqueFuncoesPrevistas={uniqueNiveis2}
      uniqueTiposContrato={uniqueGestores} // Aproveita estrutura existente
      showFuncaoPrevista={false} // Oculta filtros que não serão usados
      showFuncaoAtual={false}
    />
  );
};

export default FiltrosResumo;
