import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { QueryClient, QueryClientProvider, useQuery, useMutation } from '@tanstack/react-query';
import { PlanejamentoProvider } from './planejamento/PlanejamentoContext'; // Importa o PlanejamentoContext

// Cria uma instância do QueryClient para o React Query
const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* Provedor do React Query */}
    <QueryClientProvider client={queryClient}>
      {/* Provedor do Contexto Geral do Planejamento */}
      <PlanejamentoProvider>
        <App />
      </PlanejamentoProvider>
    </QueryClientProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
