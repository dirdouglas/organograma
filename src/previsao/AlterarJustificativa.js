import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Paper, PaperProps } from '@mui/material';
import { alterarJustificativaApi } from './Api'; // Importa a função da API

// Componente Paper para permitir o arraste
function PaperComponent(props: PaperProps) {
  const [mouseDown, setMouseDown] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseDown = (event: React.MouseEvent) => {
    setMouseDown(true);
    setOffset({
      x: event.clientX - position.x,
      y: event.clientY - position.y,
    });
  };

  const handleMouseMove = (event: MouseEvent) => {
    if (mouseDown) {
      setPosition({
        x: event.clientX - offset.x,
        y: event.clientY - offset.y,
      });
    }
  };

  const handleMouseUp = () => {
    setMouseDown(false);
  };

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [mouseDown,handleMouseMove, offset]);

  return (
    <Paper
      {...props}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        cursor: mouseDown ? 'grabbing' : 'grab',
        ...props.style,
      }}
      onMouseDown={handleMouseDown}
    />
  );
}

const AlterarJustificativa = ({ open, onClose, row, setRow }) => {
  const [justificativa, setJustificativa] = useState('');

  // Carregar a justificativa do row quando o modal abrir
  useEffect(() => {
    if (row && row.justificativa) {
      setJustificativa(row.justificativa);
    } else {
      setJustificativa('');
    }
  }, [row]);

  const handleSave = async () => {
    try {
      // Chama a API para alterar a justificativa no banco
      await alterarJustificativaApi(row.id, justificativa);

      // Atualiza localmente a justificativa no objeto sem fazer novo fetch
      setRow({ ...row, justificativa });
      
      onClose(); // Fecha o modal
    } catch (error) {
      console.error('Erro ao alterar justificativa:', error);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      PaperComponent={PaperComponent}
      PaperProps={{
        style: {
          width: '30vw',   
          padding: '5px',  
        },
      }}
    >
      <DialogTitle style={{ cursor: 'move' }}>
        Alterar Justificativa
      </DialogTitle>
      <DialogContent>
        <TextField
          label="Justificativa"
          fullWidth
          multiline
          value={justificativa}
          onChange={(e) => setJustificativa(e.target.value)}
          style={{ width: '100%' }} 
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">Cancelar</Button>
        <Button onClick={handleSave} color="primary">Salvar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AlterarJustificativa;
