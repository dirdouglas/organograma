import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { TextField, Button, Container, Typography, Box, Alert, CircularProgress, Link } from '@mui/material';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState(''); // Campo para senha atual ao alterar senha
  const [newPassword, setNewPassword] = useState(''); // Campo para nova senha ao alterar senha
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState(''); // Adicionado estado para mensagens de sucesso
  const [loading, setLoading] = useState(false);
  const [isResetPassword, setIsResetPassword] = useState(false); // Alternar entre login e alteração de senha
  const navigate = useNavigate();

  // Função de validação de email
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Função para fazer o login (POST)
  const handleLogin = async () => {
    setErrorMessage('');  // Limpa a mensagem de erro anterior
    setSuccessMessage('');

    // Eliminar espaços em branco no email e senha
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    // Validação de campos
    if (!trimmedEmail) {
      setErrorMessage("Por favor, preencha o campo de email.");
      return;
    }

    if (!validateEmail(trimmedEmail)) {
      setErrorMessage("Por favor, insira um email válido.");
      return;
    }

    if (!trimmedPassword) {
      setErrorMessage("Por favor, preencha o campo de senha.");
      return;
    }

    setLoading(true); // Ativa o loading enquanto a requisição é processada

    try {
      const payload = {
        body: JSON.stringify({
          action: "login",
          email: trimmedEmail,
          password: trimmedPassword
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
        const responseBody = JSON.parse(response.data.body);

        if (responseBody.email) {
          // Armazenando os dados no localStorage
          localStorage.setItem('email', responseBody.email || '');
          localStorage.setItem('gestor', responseBody.gestor ? responseBody.gestor.toString() : '0');
          localStorage.setItem('adm', responseBody.adm ? responseBody.adm.toString() : '0');
          localStorage.setItem('id_gestor', responseBody.id_gestor ? responseBody.id_gestor.toString() : '0');
          
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

  // Função para alterar a senha
  const handleChangePassword = async () => {
    setErrorMessage('');  // Limpa a mensagem de erro anterior
    setSuccessMessage('');

    // Eliminar espaços em branco no email e senhas
    const trimmedEmail = email.trim();
    const trimmedCurrentPassword = currentPassword.trim();
    const trimmedNewPassword = newPassword.trim();

    // Validação de campos
    if (!trimmedEmail) {
      setErrorMessage("Por favor, preencha o campo de email.");
      return;
    }

    if (!validateEmail(trimmedEmail)) {
      setErrorMessage("Por favor, insira um email válido.");
      return;
    }

    if (!trimmedCurrentPassword) {
      setErrorMessage("Por favor, preencha o campo de senha atual.");
      return;
    }

    if (!trimmedNewPassword) {
      setErrorMessage("Por favor, preencha o campo de nova senha.");
      return;
    }

    setLoading(true); // Ativa o loading enquanto a requisição é processada

    try {
      const payload = {
        body: JSON.stringify({
          action: "alterar_senha",
          email: trimmedEmail,
          password: trimmedCurrentPassword,
          new_password: trimmedNewPassword
        })
      };

      // Fazendo a requisição POST para alterar senha
      const response = await axios.post("https://oxben1wvjj.execute-api.us-east-1.amazonaws.com/dev/login", payload, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 200 && response.data.body) {
        setSuccessMessage("Senha alterada com sucesso! Você pode agora fazer login."); // Mensagem de sucesso
        setIsResetPassword(false); // Volta ao estado de login após alteração de senha
      } else {
        setErrorMessage("Erro ao alterar a senha. Verifique os dados e tente novamente.");
      }
    } catch (error) {
      console.log("Erro na requisição:", error);
      setErrorMessage("Erro ao alterar a senha.");
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
          {isResetPassword ? "Alterar Senha" : "Login"}
        </Typography>

        {/* Formulário de Login */}
        {!isResetPassword && (
          <>
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
            {successMessage && <Alert severity="success" sx={{ mt: 2 }}>{successMessage}</Alert>} {/* Mensagem de sucesso */}
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
            <Link
              component="button"
              variant="body2"
              onClick={() => setIsResetPassword(true)} // Troca para o formulário de alteração de senha
              sx={{ mt: 2 }}
            >
              Alterar Senha
            </Link>
          </>
        )}

        {/* Formulário de Alteração de Senha */}
        {isResetPassword && (
          <>
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              label="Senha Atual"
              type="password"
              variant="outlined"
              fullWidth
              margin="normal"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <TextField
              label="Nova Senha"
              type="password"
              variant="outlined"
              fullWidth
              margin="normal"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            {errorMessage && <Alert severity="error" sx={{ mt: 2 }}>{errorMessage}</Alert>}
            {successMessage && <Alert severity="success" sx={{ mt: 2 }}>{successMessage}</Alert>} {/* Mensagem de sucesso */}
            {loading ? (
              <CircularProgress sx={{ mt: 2 }} />
            ) : (
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleChangePassword}
                sx={{ mt: 2 }}
              >
                Alterar Senha
              </Button>
            )}
            <Button onClick={() => setIsResetPassword(false)} sx={{ mt: 2 }}>
              Voltar ao Login
            </Button>
          </>
        )}
      </Box>
    </Container>
  );
};

export default Login;
