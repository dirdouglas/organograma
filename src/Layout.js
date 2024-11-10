import React, { useState, useEffect, useContext } from 'react';
import {
  AppBar, Box, Toolbar, IconButton, Typography, Drawer, List, ListItem, ListItemText, CssBaseline, Divider, Menu, MenuItem,
} from '@mui/material';
import { Menu as MenuIcon, AccountCircle, Logout as LogoutIcon, Settings as SettingsIcon, Home as HomeIcon } from '@mui/icons-material';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import SelecaoEmpresa from './home/SelecaoEmpresa';
import { EmpresaContext } from './EmpresaContext';
import RefreshIcon from '@mui/icons-material/Refresh';
import { fetchFuncionariosAtivos } from './FuncionariosAtivos'; // Ajuste o caminho conforme necessário
import { fetchFuncionariosPrevistos } from './FuncionariosPrevistos'; // Ajuste o caminho conforme necessário
import Comparativo from './Comparativo';



const drawerWidth = 240;

const Layout = () => {
  //const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { empresaId, changeEmpresaId } = useContext(EmpresaContext);
  const [userEmail, setUserEmail] = useState('');
  const navigate = useNavigate();


  // Dentro do componente Layout
const location = useLocation();

const handleRefresh = () => {
  console.log('O botão de refresh foi clicado!');
  if (location.pathname === '/funcionarios-ativos') {
    // Chama a API de Funcionários Ativos
    console.log('Atualizando Funcionários Ativos');
    // Aqui você deve acionar a função de atualização dos Funcionários Ativos
    fetchFuncionariosAtivos();
  } else if (location.pathname === '/funcionarios-previstos') {
    // Chama a API de Funcionários Previstos
    console.log('Atualizando Funcionários Previstos');
    // Aqui você deve acionar a função de atualização dos Funcionários Previstos
    fetchFuncionariosPrevistos();
  }
};



  // Pega dados do localStorage e ajusta o estado da empresa e do email
  useEffect(() => {
    const email = localStorage.getItem('email');
    if (email) {
      setUserEmail(email);
    }

    const storedEmpresa = localStorage.getItem('id_empresa');
    if (storedEmpresa) {
      changeEmpresaId(storedEmpresa);
    }
  }, [changeEmpresaId]);

  // Lida com a alternância do drawer (menu lateral)
  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  // Lida com o menu do perfil do usuário
  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.clear();
    changeEmpresaId(null);
    handleMenuClose();
    navigate('/login');
  };

  // Lida com a alteração da empresa selecionada
  const handleEmpresaChange = (novaEmpresa) => {
    if (novaEmpresa && novaEmpresa.id_empresa) {
      changeEmpresaId(novaEmpresa.id_empresa);
      localStorage.setItem('id_empresa', novaEmpresa.id_empresa);
    } else {
      changeEmpresaId(null);
    }
  };

  const menuId = 'primary-profile-menu';
  const renderProfileMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={menuId}
      keepMounted
      open={Boolean(anchorEl)}
      onClose={handleMenuClose}
    >
      <MenuItem component={Link} to="/preferences" onClick={handleMenuClose}>
        <SettingsIcon sx={{ mr: 1 }} /> Preferências
      </MenuItem>
      <MenuItem onClick={handleLogout}>
        <LogoutIcon sx={{ mr: 1 }} /> Logout
      </MenuItem>
    </Menu>
  );

  const drawer = (
    <div>
      <Toolbar />
      <Divider />
      <List>
        <ListItem button component={Link} to="/home">
          <ListItemText primary="Home" />
        </ListItem>
        <ListItem button component={Link} to="/funcionarios-ativos">
          <ListItemText primary="Funcionários Ativos" />
        </ListItem>
        <ListItem button component={Link} to="/funcionarios-previstos">
          <ListItemText primary="Funcionários Previstos" />
        </ListItem>
        <ListItem button component={Link} to="/resumo-quadro-previsto">
          <ListItemText primary="Resumo Quadro Previsto" />
        </ListItem>
        <ListItem button component={Link} to="/comparativo">
          <ListItemText primary="Comparativo" />
        </ListItem>
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />

      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar sx={{ minHeight: '10px !important', height: '35px !important' }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>

          <IconButton
            color="inherit"
            aria-label="go home"
            edge="start"
            component={Link}
            to="/home"
            sx={{ mr: 2 }}
          >
            <HomeIcon />
          </IconButton>

          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {userEmail ? `Bem-vindo, ${userEmail}` : 'Sistema de Gestão'}
          </Typography>

          <IconButton color="inherit" onClick={handleRefresh}>
            <RefreshIcon />
          </IconButton>

          <SelecaoEmpresa
            empresaSelecionada={{ label: empresaId, id_empresa: empresaId }}
            onChangeEmpresa={handleEmpresaChange}
          />

          <IconButton
            size="large"
            edge="end"
            aria-label="account of current user"
            aria-controls={menuId}
            aria-haspopup="true"
            onClick={handleProfileMenuOpen}
            color="inherit"
          >
            <AccountCircle />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        open={drawerOpen}
        sx={{
          width: drawerOpen ? drawerWidth : 0,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerOpen ? drawerWidth : 0,
            transition: 'width 0.3s',
          },
        }}
      >
        {drawer}
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 0,
          ml: drawerOpen ? '15px' : '1px',
          transition: 'margin-left 0.3s',
        }}
      >
        <Toolbar sx={{ minHeight: '10px !important', height: '35px !important' }}></Toolbar>

        {/* Passa o Outlet para carregar componentes filhos */}
        <Outlet />
      </Box>

      {renderProfileMenu}
    </Box>
  );
};

export default Layout;
