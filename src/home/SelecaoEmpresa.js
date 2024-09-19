import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Paper, Autocomplete } from '@mui/material';
import { listarEmpresas } from '../previsao/Api'; // Importando a função de listagem de empresas

const SelecaoEmpresa = ({ onChangeEmpresa }) => {
  const [open, setOpen] = useState(false);
  const [empresas, setEmpresas] = useState([]); // Lista de empresas
  const [selectedEmpresa, setSelectedEmpresa] = useState({ label: '', id_empresa: null });

  // Função para carregar as empresas e definir a empresa selecionada a partir do localStorage
  const carregarEmpresas = async () => {
    try {
      const empresasData = await listarEmpresas();
      setEmpresas(empresasData);

      // Carrega a empresa do localStorage e define como selecionada
      const idEmpresa = localStorage.getItem('id_empresa');
      const nomeEmpresa = localStorage.getItem('empresa_nome');
      if (idEmpresa && nomeEmpresa) {
        setSelectedEmpresa({ label: nomeEmpresa, id_empresa: idEmpresa });
      } else if (empresasData.length > 0) {
        // Se não houver empresa no localStorage, selecione a primeira da lista
        setSelectedEmpresa(empresasData[0]);
        localStorage.setItem('id_empresa', empresasData[0].id_empresa);
        localStorage.setItem('empresa_nome', empresasData[0].label);
      }
    } catch (error) {
      console.error('Erro ao carregar empresas:', error);
    }
  };

  // Carrega as empresas quando o componente é montado
  useEffect(() => {
    carregarEmpresas();
  }, []);

  // Função para abrir o dialog
  const handleClickOpen = () => {
    setOpen(true);
  };

  // Função para fechar o dialog
  const handleClose = () => {
    setOpen(false);
  };

  // Função para salvar a empresa selecionada e notificar a mudança
  const handleSave = () => {
    onChangeEmpresa(selectedEmpresa); // Notifica o componente pai (Layout) sobre a mudança
    localStorage.setItem('id_empresa', selectedEmpresa.id_empresa);
    localStorage.setItem('empresa_nome', selectedEmpresa.label); // Salva o nome da empresa, se necessário
    setOpen(false);
  };

  return (
    <div>
      {/* Botão que abre o Dialog */}
      <Button variant="outlined" onClick={handleClickOpen} style={{ color: '#fff' }}>
        {selectedEmpresa.label || 'Selecionar Empresa'}
      </Button>

      {/* Dialog com a lista de empresas */}
      <Dialog
        open={open}
        onClose={handleClose}
        PaperComponent={Paper} // Componente arrastável
        PaperProps={{
          style: {
            width: '30vw', // Ajusta a largura do Dialog para 30vw
            padding: '5px', // Define padding de 5px
          },
        }}
        aria-labelledby="draggable-dialog-title"
      >
        <DialogTitle style={{ cursor: 'move', color: '#fff', backgroundColor: '#1976d2' }} id="draggable-dialog-title">
          Selecione uma Empresa
        </DialogTitle>

        <DialogContent dividers>
          <Autocomplete
            options={empresas}
            getOptionLabel={(option) => option.label}
            isOptionEqualToValue={(option, value) => option.id_empresa === value.id_empresa}
            renderInput={(params) => <TextField {...params} label="Empresas" variant="outlined" fullWidth />}
            value={selectedEmpresa}
            onChange={(event, newValue) => setSelectedEmpresa(newValue || { label: '', id_empresa: null })}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} color="secondary">Cancelar</Button>
          <Button onClick={handleSave} color="primary">Selecionar</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default SelecaoEmpresa;
