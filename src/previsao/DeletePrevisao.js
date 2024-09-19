import React from 'react';
import { Dialog, DialogTitle, DialogActions, Button } from '@mui/material';

const DeletePrevisao = ({ open, onClose, onDelete }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        style: {
          width: '30vw', // Ajusta a largura do Dialog para 30vw
          padding: '10px',
        },
      }}
    >
      <DialogTitle>Confirmar Exclusão</DialogTitle>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancelar
        </Button>
        <Button onClick={onDelete} color="secondary">
          Excluir
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeletePrevisao;
