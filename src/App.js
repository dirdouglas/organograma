import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './Layout';   // Componente Layout
import Home from './Home';       // Componente Home
import Login from './Login';     // Componente Login
import ResumoQuadroPrevisto from './ResumoQuadroPrevisto';
import FuncionariosAtivos from './FuncionariosAtivos';
import FuncionariosPrevistos from './FuncionariosPrevistos';
import Comparativo from './Comparativo';
import { EmpresaProvider } from './EmpresaContext';  // Importa o EmpresaProvider

const App = () => {
  return (
    <EmpresaProvider> {/* Envolva o app inteiro com o EmpresaProvider */}
    <Router>
      <Routes>
        {/* Rota de login sem layout */}
        <Route path="/login" element={<Login />} />

        {/* Rotas com layout */}
        <Route element={<Layout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/funcionarios-ativos" element={<FuncionariosAtivos />} />
          <Route path="/funcionarios-previstos" element={<FuncionariosPrevistos />} />
          <Route path="/resumo-quadro-previsto" element={<ResumoQuadroPrevisto />} />
          <Route path="/comparativo" element={<Comparativo />} />
        </Route>

        {/* Rota padrão redirecionando para o login */}
        <Route path="/" element={<Login />} />
      </Routes>
    </Router>
    </EmpresaProvider>
  );
};

export default App;
