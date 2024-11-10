import React, { useState } from 'react';
import { TextField, Button, Grid, Typography, Container, MenuItem } from '@mui/material';
import dayjs from 'dayjs';

const Comparativo = () => {
  // Estado para o próximo valor de ID
  const [nextId, setNextId] = useState(1);

  // Estado para o número sequencial por tipo de agregado
  const [sequences, setSequences] = useState({
    motor: 1,
    cambio: 1,
    diferencial: 1,
    embreagem: 1
  });

  // Estado inicial para os campos do formulário
  const [agregado, setAgregado] = useState({
    id: nextId,
    tipo: 'motor', // Tipo de agregado (motor, cambio, diferencial, embreagem)
    codigo: '',
    descricao: '',
    dataCadastro: dayjs().format('YYYY-MM-DD'),
    valorAquisicao: '',
    vidaUtilEstimada: ''
  });

  // Função para lidar com as mudanças nos inputs
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'valorAquisicao') {
      // Remove tudo que não for número para formatação
      const onlyNums = value.replace(/[^\d]/g, '');
      const formattedValue = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(onlyNums / 100); // Divide por 100 para ajustar casas decimais
      setAgregado((prevAgregado) => ({
        ...prevAgregado,
        [name]: formattedValue,
      }));
    } else {
      setAgregado((prevAgregado) => ({
        ...prevAgregado,
        [name]: value,
      }));
    }
  };

  // Gerar código concatenado automaticamente ao mudar o tipo ou descrição
  const generateCodigo = (tipo) => {
    const sequence = sequences[tipo];
    const codigoGerado = `${tipo.toUpperCase()}-${String(sequence).padStart(5, '0')}`;
    setAgregado((prevAgregado) => ({
      ...prevAgregado,
      codigo: codigoGerado
    }));
  };

  // Atualiza a sequência e gera o código quando o tipo for alterado
  const handleTipoChange = (e) => {
    const { value } = e.target;
    setAgregado((prevAgregado) => ({
      ...prevAgregado,
      tipo: value
    }));
    generateCodigo(value);
  };

  // Função para impedir datas futuras
  const handleDateChange = (e) => {
    const { value } = e.target;
    const currentDate = dayjs().format('YYYY-MM-DD');
    if (value <= currentDate) {
      setAgregado((prevAgregado) => ({
        ...prevAgregado,
        dataCadastro: value
      }));
    } else {
      alert('Data não pode ser futura.');
    }
  };

  // Função para lidar com o envio do formulário
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Lógica para envio dos dados do agregado (pode ser ajustada para envio à API)
    console.log('Agregado cadastrado:', agregado);

    // Incrementar a sequência para o tipo de agregado atual
    setSequences((prevSequences) => ({
      ...prevSequences,
      [agregado.tipo]: prevSequences[agregado.tipo] + 1
    }));

    // Incrementar o ID para o próximo cadastro
    setNextId(nextId + 1);
    
    // Resetar os campos do formulário com o novo ID
    setAgregado({
      id: nextId + 1,
      tipo: 'motor',
      codigo: '',
      descricao: '',
      dataCadastro: dayjs().format('YYYY-MM-DD'),
      valorAquisicao: '',
      vidaUtilEstimada: ''
    });
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Cadastro de Agregados
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="ID"
              name="id"
              value={agregado.id}
              fullWidth
              disabled
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              select
              label="Tipo de Agregado"
              name="tipo"
              value={agregado.tipo}
              onChange={handleTipoChange}
              fullWidth
              required
            >
              <MenuItem value="motor">Motor</MenuItem>
              <MenuItem value="cambio">Câmbio</MenuItem>
              <MenuItem value="diferencial">Diferencial</MenuItem>
              <MenuItem value="embreagem">Embreagem</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Código"
              name="codigo"
              value={agregado.codigo}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Descrição"
              name="descricao"
              value={agregado.descricao}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Data de Cadastro"
              name="dataCadastro"
              value={agregado.dataCadastro}
              onChange={handleDateChange}
              type="date"
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Valor de Aquisição"
              name="valorAquisicao"
              value={agregado.valorAquisicao}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Vida Útil Estimada (em anos)"
              name="vidaUtilEstimada"
              value={agregado.vidaUtilEstimada}
              onChange={handleChange}
              type="number"
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Cadastrar Agregado
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default Comparativo;
