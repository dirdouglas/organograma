import React, { createContext, useContext, useState } from "react";

const PlanejamentoContext = createContext();

export const PlanejamentoProvider = ({ children }) => {
  const [dadosSelecionados, setDadosSelecionados] = useState({
    id_plano: null,
    id_atividade: null,
    id_frente: null,
  });

  const salvarDadosSelecionados = (dados) => {
    setDadosSelecionados(dados);
  };

  return (
    <PlanejamentoContext.Provider
      value={{
        dadosSelecionados,
        salvarDadosSelecionados,
      }}
    >
      {children}
    </PlanejamentoContext.Provider>
  );
};

export const usePlanejamentoContext = () => useContext(PlanejamentoContext);
