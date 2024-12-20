import React from 'react';
import { Grid, TextField, Autocomplete } from '@mui/material';

const Filtros = ({
  filters,
  setFilters,
  uniqueFuncoesAtuais = [],
  uniqueFuncoesPrevistas = [],
  uniqueDepartamentosAtuais = [],
  uniqueDepartamentosPrevistos = [],
  uniqueTiposContrato = [],
  uniqueGestores = [],
  uniqueAgrupamentos = [],
  uniqueDiferenca = ['COM VAGAS', 'EXCEDENTE', 'SEM DIFERENÇA'],
  uniquePrevDemissao = ['DEMISSÃO PREVISTA', 'VERIFICAR DEMISSÃO', 'VERIFICAR EFETIVAÇÃO'],
  showNomeOuMatricula = true,
  showFuncaoAtual = true,
  showFuncaoPrevista = true,
  showDepartamentoAtual = true,
  showDepartamentoPrevisto = true,
  showTipoContrato = true,
  showGestor = true,
  showAgrupamento = true,
  showDiferenca = true,
  showPrevDemissao = true,
  showConfPrev = true, // Controle para exibir o filtro de confirmação de previsão
}) => {

  const inputStyle = {
    height: '35px',
    padding: '0 0px',
    fontSize: '0.75rem',
  };

  const labelStyle = {
    fontSize: '0.75rem',
    transition: 'all 0.2s ease-out',
  };

  const shrinkLabelStyle = {
    fontSize: '0.75rem',
    transform: 'translate(0, -100%) scale(0.75)',
    transition: 'all 0.2s ease-out',
  };

  const autocompleteStyle = {
    '& .MuiInputBase-root': {
      fontSize: '0.75rem',
      height: '35px',
    },
    '& .MuiAutocomplete-listbox': {
      fontSize: '0.75rem',
    },
    '& .MuiOutlinedInput-root': {
      height: '35px',
    },
  };

  const gridItemStyle = {
    paddingBottom: '5px',
  };

  // Função para converter a seleção visual em valor booleano (1 ou 0)
  const handleConfPrevChange = (event, newValue) => {
    const confPrevValue = newValue === 'Confirmado' ? 1 : newValue === 'Não Confirmado' ? 0 : '';
    setFilters(prev => ({ ...prev, confPrev: confPrevValue }));
  };

  return (
    <Grid container spacing={1} style={{ marginTop: '6px', marginBottom: '6px' }}>
      
      {showNomeOuMatricula && (
        <Grid item xs={12} sm={2} style={gridItemStyle}>
          <TextField
            label="Matrícula ou Nome"
            variant="outlined"
            fullWidth
            value={filters.nomeOuMatricula || ''}
            onChange={(e) => setFilters(prev => ({ ...prev, nomeOuMatricula: e.target.value }))}
            InputProps={{
              style: inputStyle,
            }}
            InputLabelProps={{
              style: filters.nomeOuMatricula ? shrinkLabelStyle : labelStyle,
            }}
          />
        </Grid>
      )}

      {showFuncaoAtual && (
        <Grid item xs={12} sm={2} style={gridItemStyle}>
          <Autocomplete
            options={uniqueFuncoesAtuais}
            value={filters.funcaoAtual || ''}
            onChange={(event, newValue) => setFilters(prev => ({ ...prev, funcaoAtual: newValue || '' }))}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Função Atual"
                variant="outlined"
                fullWidth
                InputProps={{ ...params.InputProps, style: inputStyle }}
                InputLabelProps={{ style: filters.funcaoAtual ? shrinkLabelStyle : labelStyle }}
              />
            )}
            ListboxProps={{ style: autocompleteStyle['& .MuiAutocomplete-listbox'] }}
          />
        </Grid>
      )}

      {showFuncaoPrevista && (
        <Grid item xs={12} sm={2} style={gridItemStyle}>
          <Autocomplete
            options={uniqueFuncoesPrevistas}
            value={filters.funcaoPrevista || ''}
            onChange={(event, newValue) => setFilters(prev => ({ ...prev, funcaoPrevista: newValue || '' }))}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Função Prevista"
                variant="outlined"
                fullWidth
                InputProps={{ ...params.InputProps, style: inputStyle }}
                InputLabelProps={{ style: filters.funcaoPrevista ? shrinkLabelStyle : labelStyle }}
              />
            )}
            ListboxProps={{ style: autocompleteStyle['& .MuiAutocomplete-listbox'] }}
          />
        </Grid>
      )}

      {showDepartamentoAtual && (
        <Grid item xs={12} sm={2} style={gridItemStyle}>
          <Autocomplete
            options={uniqueDepartamentosAtuais}
            value={filters.departamentoAtual || ''}
            onChange={(event, newValue) => setFilters(prev => ({ ...prev, departamentoAtual: newValue || '' }))}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Departamento Atual"
                variant="outlined"
                fullWidth
                InputProps={{ ...params.InputProps, style: inputStyle }}
                InputLabelProps={{ style: filters.departamentoAtual ? shrinkLabelStyle : labelStyle }}
              />
            )}
            ListboxProps={{ style: autocompleteStyle['& .MuiAutocomplete-listbox'] }}
          />
        </Grid>
      )}

      {showDepartamentoPrevisto && (
        <Grid item xs={12} sm={2} style={gridItemStyle}>
          <Autocomplete
            options={uniqueDepartamentosPrevistos}
            value={filters.departamentoPrevisto || ''}
            onChange={(event, newValue) => setFilters(prev => ({ ...prev, departamentoPrevisto: newValue || '' }))}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Departamento Previsto"
                variant="outlined"
                fullWidth
                InputProps={{ ...params.InputProps, style: inputStyle }}
                InputLabelProps={{ style: filters.departamentoPrevisto ? shrinkLabelStyle : labelStyle }}
              />
            )}
            ListboxProps={{ style: autocompleteStyle['& .MuiAutocomplete-listbox'] }}
          />
        </Grid>
      )}

      {showTipoContrato && (
        <Grid item xs={12} sm={2} style={gridItemStyle}>
          <Autocomplete
            options={uniqueTiposContrato}
            value={filters.tipoContrato || ''}
            onChange={(event, newValue) => setFilters(prev => ({ ...prev, tipoContrato: newValue || '' }))}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Tipo de Contrato"
                variant="outlined"
                fullWidth
                InputProps={{ ...params.InputProps, style: inputStyle }}
                InputLabelProps={{ style: filters.tipoContrato ? shrinkLabelStyle : labelStyle }}
              />
            )}
            ListboxProps={{ style: autocompleteStyle['& .MuiAutocomplete-listbox'] }}
          />
        </Grid>
      )}

      {/* Filtro de Gestor */}
      {showGestor && (
        <Grid item xs={12} sm={2} style={gridItemStyle}>
          <Autocomplete
            options={uniqueGestores}  // Removida a opção "Sem Gestor"
            value={filters.gestor || ''}  // Valor selecionado no dropdown
            onChange={(event, newValue) => setFilters(prev => ({ ...prev, gestor: newValue || '' }))}  // Atualiza o valor do filtro de gestor
            renderInput={(params) => (
              <TextField
                {...params}
                label="Gestor"
                variant="outlined"
                fullWidth
                InputProps={{ ...params.InputProps, style: inputStyle }}
                InputLabelProps={{ style: filters.gestor ? shrinkLabelStyle : labelStyle }}
              />
            )}
            ListboxProps={{ style: autocompleteStyle['& .MuiAutocomplete-listbox'] }}
          />
        </Grid>
      )}

      {/* Filtro de Agrupamento */}
      {showAgrupamento && (
        <Grid item xs={12} sm={2} style={gridItemStyle}>
          <Autocomplete
            options={uniqueAgrupamentos}
            value={filters.agrupamento || ''}
            onChange={(event, newValue) => setFilters(prev => ({ ...prev, agrupamento: newValue || '' }))}  // Atualiza o valor do filtro de agrupamento
            renderInput={(params) => (
              <TextField
                {...params}
                label="Agrupamento"
                variant="outlined"
                fullWidth
                InputProps={{ ...params.InputProps, style: inputStyle }}
                InputLabelProps={{ style: filters.agrupamento ? shrinkLabelStyle : labelStyle }}
              />
            )}
            ListboxProps={{ style: autocompleteStyle['& .MuiAutocomplete-listbox'] }}
          />
        </Grid>
      )}

      {/* Filtro de Diferença */}
      {showDiferenca && (
        <Grid item xs={12} sm={2} style={gridItemStyle}>
          <Autocomplete
            options={uniqueDiferenca}
            value={filters.diferenca || ''}
            onChange={(event, newValue) => setFilters(prev => ({ ...prev, diferenca: newValue || '' }))}  // Atualiza o valor do filtro de Diferença
            renderInput={(params) => (
              <TextField
                {...params}
                label="Diferença"
                variant="outlined"
                fullWidth
                InputProps={{ ...params.InputProps, style: inputStyle }}
                InputLabelProps={{ style: filters.diferenca ? shrinkLabelStyle : labelStyle }}
              />
            )}
            ListboxProps={{ style: autocompleteStyle['& .MuiAutocomplete-listbox'] }}
          />
        </Grid>
      )}

      {/* Filtro de Previsão de Demissão */}
      {showPrevDemissao && (
        <Grid item xs={12} sm={2} style={gridItemStyle}>
          <Autocomplete
            options={uniquePrevDemissao}
            value={filters.prevDemissao || ''}
            onChange={(event, newValue) => setFilters(prev => ({ ...prev, prevDemissao: newValue || '' }))}  // Atualiza o valor do filtro de Previsão de Demissão
            renderInput={(params) => (
              <TextField
                {...params}
                label="Previsão de Demissão"
                variant="outlined"
                fullWidth
                InputProps={{ ...params.InputProps, style: inputStyle }}
                InputLabelProps={{ style: filters.prevDemissao ? shrinkLabelStyle : labelStyle }}
              />
            )}
            ListboxProps={{ style: autocompleteStyle['& .MuiAutocomplete-listbox'] }}
          />
        </Grid>
      )}

      {/* Filtro de Confirmação de Previsão */}
      {showConfPrev && (
        <Grid item xs={12} sm={2} style={gridItemStyle}>
          <Autocomplete
            options={['Confirmado', 'Não Confirmado']}
            value={filters.confPrev === 1 ? 'Confirmado' : filters.confPrev === 0 ? 'Não Confirmado' : ''}  // Valor selecionado no dropdown
            onChange={handleConfPrevChange}  // Atualiza o valor do filtro de Confirmação de Previsão
            renderInput={(params) => (
              <TextField
                {...params}
                label="Confirmação de Previsão"
                variant="outlined"
                fullWidth
                InputProps={{ ...params.InputProps, style: inputStyle }}
                InputLabelProps={{ style: filters.confPrev ? shrinkLabelStyle : labelStyle }}
              />
            )}
            ListboxProps={{ style: autocompleteStyle['& .MuiAutocomplete-listbox'] }}
          />
        </Grid>
      )}
    </Grid>
  );
};

export default Filtros;
