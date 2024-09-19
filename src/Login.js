import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { TextField, Button, Container, Typography, Box, Alert, CircularProgress } from '@mui/material';
import { listarEmpresas } from './previsao/Api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Função de validação de email
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Função para carregar as empresas e salvar a primeira no localStorage
  const fetchEmpresas = async () => {
    try {
      const empresasData = await listarEmpresas();
      
      // Seleciona a primeira empresa e armazena no localStorage
      if (empresasData.length > 0) {
        const primeiraEmpresa = empresasData[0];
        localStorage.setItem('id_empresa', primeiraEmpresa.id_empresa);
        localStorage.setItem('empresa_nome', primeiraEmpresa.label); // Adicione o nome da empresa, se necessário
      }
    } catch (error) {
      console.error('Erro ao carregar empresas:', error);
    }
  };

  // Função para fazer o login (POST)
  const handleLogin = async () => {
    setErrorMessage('');  // Limpa a mensagem de erro anterior

    // Validação de campos
    if (!email) {
      setErrorMessage("Por favor, preencha o campo de email.");
      return;
    }

    if (!validateEmail(email)) {
      setErrorMessage("Por favor, insira um email válido.");
      return;
    }

    if (!password) {
      setErrorMessage("Por favor, preencha o campo de senha.");
      return;
    }

    setLoading(true); // Ativa o loading enquanto a requisição é processada


    try {
      const payload = {
        body: JSON.stringify({
          action: "login",
          email: email,
          password: password
        })
      };

      // Fazendo a requisição POST para login
      const response = await axios.post("https://oxben1wvjj.execute-api.us-east-1.amazonaws.com/dev/login", payload, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      // Verifica se o status da resposta é 200 e se contém um email válido
      if (response.status === 200 && response.data.body) {
        const responseBody = JSON.parse(response.data.body); // Verifica se já é um objeto JSON

        if (responseBody.email) {
          // Armazenando os dados no localStorage
          localStorage.setItem('email', responseBody.email || '');
          localStorage.setItem('gestor', responseBody.gestor ? responseBody.gestor.toString() : '0');
          localStorage.setItem('adm', responseBody.adm ? responseBody.adm.toString() : '0');
          localStorage.setItem('id_gestor', responseBody.id_gestor ? responseBody.id_gestor.toString() : '0');
          
          await fetchEmpresas(); // Carrega as empresas e salva a primeira no localStorage
          
          // Redireciona para a página home
          navigate('/home');
        } else {
          setErrorMessage("Erro ao fazer login. O servidor não retornou informações válidas.");
        }
      } else {
        setErrorMessage("Erro ao fazer login. Por favor, verifique suas credenciais.");
      }
    } catch (error) {
      console.log("Erro na requisição:", error);

      if (error.response && error.response.status === 401) {
        setErrorMessage("Email ou senha inválidos.");
      } else if (error.response && error.response.status) {
        setErrorMessage(`Erro ao fazer login: Código de status ${error.response.status}`);
      } else {
        setErrorMessage("Erro ao fazer login: Não foi possível conectar ao servidor.");
      }
    } finally {
      setLoading(false); // Desativa o loading após a requisição
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Login
        </Typography>
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="Senha"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {errorMessage && <Alert severity="error" sx={{ mt: 2 }}>{errorMessage}</Alert>}
        {loading ? (
          <CircularProgress sx={{ mt: 2 }} />
        ) : (
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleLogin}
            sx={{ mt: 2 }}
          >
            Login
          </Button>
        )}
      </Box>
    </Container>
  );
};

export default Login;
