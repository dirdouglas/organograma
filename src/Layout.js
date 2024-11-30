import React, { useState, useEffect, useContext } from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemText,
  CssBaseline,
  Divider,
  Collapse,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  Menu as MenuIcon,
  AccountCircle,
  Logout as LogoutIcon,
  Settings as SettingsIcon,
  Home as HomeIcon,
  ExpandLess,
  ExpandMore,
} from '@mui/icons-material';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import SelecaoEmpresa from './home/SelecaoEmpresa';
import { EmpresaContext } from './EmpresaContext';

const drawerWidth = 240;

const Layout = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState({});
  const { empresaId, changeEmpresaId } = useContext(EmpresaContext);
  const [userEmail, setUserEmail] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    setOpenMenu({
      planejamento: false,
      planejamentoCadastros: false,
      planejamentoRelatorios: false,
      organograma: false,
      organogramaLancamentos: false,
      organogramaRelatorios: false,
    });
  }, []);

  const handleToggleMenu = (menu) => {
    setOpenMenu((prevState) => ({
      ...prevState,
      [menu]: !prevState[menu],
    }));
  };

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

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
        {/* Planejamento */}
        <ListItem button onClick={() => handleToggleMenu('planejamento')}>
          <ListItemText primary="Planejamento" />
          {openMenu.planejamento ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={openMenu.planejamento} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {/* Nível 2: Cadastros */}
            <ListItem button onClick={() => handleToggleMenu('planejamentoCadastros')} sx={{ pl: 4 }}>
              <ListItemText primary="Cadastros" />
              {openMenu.planejamentoCadastros ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={openMenu.planejamentoCadastros} timeout="auto" unmountOnExit>
              {/* Nível 3: Itens em Cadastros */}
              <ListItem button sx={{ pl: 8 }} component={Link} to="planejamento/cadastros/safra">
                <ListItemText primary="Safra" />
              </ListItem>
              <ListItem button sx={{ pl: 8 }} component={Link} to="planejamento/cadastros/plano">
                <ListItemText primary="Plano" />
              </ListItem>
              <ListItem button sx={{ pl: 8 }} component={Link} to="planejamento/cadastros/atividade">
                <ListItemText primary="Atividade" />
              </ListItem>
              <ListItem button sx={{ pl: 8 }} component={Link} to="/frente">
                <ListItemText primary="Frente" />
              </ListItem>
            </Collapse>
            {/* Nível 2: Relatórios */}
            <ListItem button onClick={() => handleToggleMenu('planejamentoRelatorios')} sx={{ pl: 4 }}>
              <ListItemText primary="Relatórios" />
              {openMenu.planejamentoRelatorios ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={openMenu.planejamentoRelatorios} timeout="auto" unmountOnExit>
              {/* Nível 3: Itens em Relatórios */}
              <ListItem button sx={{ pl: 8 }} component={Link} to="/desempenho">
                <ListItemText primary="Desempenho" />
              </ListItem>
            </Collapse>
          </List>
        </Collapse>
        <Divider />
        {/* Organograma */}
        <ListItem button onClick={() => handleToggleMenu('organograma')}>
          <ListItemText primary="Organograma" />
          {openMenu.organograma ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={openMenu.organograma} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {/* Nível 2: Lançamentos */}
            <ListItem button onClick={() => handleToggleMenu('organogramaLancamentos')} sx={{ pl: 4 }}>
              <ListItemText primary="Lançamentos" />
              {openMenu.organogramaLancamentos ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={openMenu.organogramaLancamentos} timeout="auto" unmountOnExit>
              {/* Nível 3: Itens em Lançamentos */}
              <ListItem button sx={{ pl: 8 }} component={Link} to="/funcionarios-ativos">
                <ListItemText primary="Funcionários Ativos" />
              </ListItem>
              <ListItem button sx={{ pl: 8 }} component={Link} to="/funcionarios-previstos">
                <ListItemText primary="Funcionários Previstos" />
              </ListItem>
            </Collapse>
            {/* Nível 2: Relatórios */}
            <ListItem button onClick={() => handleToggleMenu('organogramaRelatorios')} sx={{ pl: 4 }}>
              <ListItemText primary="Relatórios" />
              {openMenu.organogramaRelatorios ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={openMenu.organogramaRelatorios} timeout="auto" unmountOnExit>
              {/* Nível 3: Itens em Relatórios */}
              <ListItem button sx={{ pl: 8 }} component={Link} to="/resumo-quadro-previsto">
                <ListItemText primary="Resumo de Previstos" />
              </ListItem>
            </Collapse>
          </List>
        </Collapse>
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />

      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {userEmail ? `Bem-vindo, ${userEmail}` : 'Sistema de Gestão'}
          </Typography>

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
        <Toolbar />
        <Outlet />
      </Box>

      {renderProfileMenu}
    </Box>
  );
};

export default Layout;
