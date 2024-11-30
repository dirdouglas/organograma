import React from "react";
import { usePlanejamentoContext } from "./PlanejamentoContext";

const VisualizarContexto = () => {
  const { dadosSelecionados } = usePlanejamentoContext();

  return (
    <div>
      <h3>Dados Gravados no Context API:</h3>
      <p><strong>ID Plano:</strong> {dadosSelecionados.id_plano || "Não definido"}</p>
      <p><strong>ID Atividade:</strong> {dadosSelecionados.id_atividade || "Não definido"}</p>
      <p><strong>ID Frente:</strong> {dadosSelecionados.id_frente || "Não definido"}</p>
    </div>
  );
};

export default VisualizarContexto;
