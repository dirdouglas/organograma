import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './Layout'; // Componente Layout
import Home from './Home'; // Componente Home
import Login from './Login'; // Componente Login
import ResumoQuadroPrevisto from './ResumoQuadroPrevisto';
import FuncionariosAtivos from './FuncionariosAtivos';
import FuncionariosPrevistos from './FuncionariosPrevistos';
import { EmpresaProvider } from './EmpresaContext'; // Contexto da empresa
import HistoricoFuncionarios from './HistoricoFuncionarios';
import Escala from './Escala';
import MindMap from './MindMap';
import CadastroSafra from './planejamento/cadastros/CadastroSafra';
import GerenciarAreas from './planejamento/cadastros/GerenciarAreas';
import CadastroPlano from './planejamento/cadastros/CadastroPlano';
import CadastroAtividade from './planejamento/cadastros/CadastroAtividade';
import GerenciarPlanos from './planejamento/cadastros/GerenciarPlanos.js';
import GerenciarAtividades from './planejamento/cadastros/GerenciarAtividades.js';
import GerenciarOperacoes from './planejamento/cadastros/GerenciarOperacoes.js';
import VisualizarContexto from './planejamento/VisualizarContexto.js';

const App = () => {
  return (
    <EmpresaProvider>
      <Router>
        <Routes>
          {/* Rotas públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Login />} />

          {/* Rotas protegidas (com Layout) */}
          <Route element={<Layout />}>
            {/* Rotas principais */}
            <Route path="/home" element={<Home />} />
            <Route path="/funcionarios-ativos" element={<FuncionariosAtivos />} />
            <Route path="/funcionarios-previstos" element={<FuncionariosPrevistos />} />
            <Route path="/resumo-quadro-previsto" element={<ResumoQuadroPrevisto />} />
            <Route path="/historico" element={<HistoricoFuncionarios />} />
            <Route path="/escala" element={<Escala />} />
            <Route path="/mindmap" element={<MindMap />} />

            {/* Rotas do planejamento agrícola */}
            <Route path="/planejamento/cadastros/safra" element={<CadastroSafra />} />
            <Route path="/planejamento/cadastros/plano" element={<CadastroPlano />} />
            <Route path="/planejamento/cadastros/atividade" element={<CadastroAtividade />} />
            <Route path="/planejamento/areas/:safraId" element={<GerenciarAreas />} />
            <Route path="/planejamento/cadastros/gerenciarplanos" element={<GerenciarPlanos />} />
            <Route path="/planejamento/cadastros/gerenciaratividades" element={<GerenciarAtividades />} />
            <Route path="/planejamento/cadastros/gerenciaroperacoes" element={<GerenciarOperacoes />} />
            <Route path="/planejamento/visualizarcontexto" element={<VisualizarContexto />} />
            {/* Rotas dinâmicas */}
            <Route path="/plano/:idPlanejamento" element={<CadastroPlano />} />
            <Route path="/atividades/:idPlano" element={<CadastroAtividade />} />
          </Route>
        </Routes>
      </Router>
    </EmpresaProvider>
  );
};

export default App;
