import React, { createContext, useState, useEffect } from 'react';

// Criação do contexto
export const EmpresaContext = createContext();

// Provedor do contexto
export const EmpresaProvider = ({ children }) => {
  const [empresaId, setEmpresaId] = useState(localStorage.getItem('id_empresa') || null);
  const [idGestor, setIdGestor] = useState(localStorage.getItem('id_gestor') || null);
  const [adm, setAdm] = useState(localStorage.getItem('adm') || null);

  // Função para atualizar empresaId, idGestor e adm
  const changeEmpresaId = (novaEmpresaId) => {
    setEmpresaId(novaEmpresaId);
    if (novaEmpresaId) {
      localStorage.setItem('id_empresa', novaEmpresaId);
    } else {
      localStorage.removeItem('id_empresa');
    }
  };

  const changeIdGestor = (novoIdGestor) => {
    setIdGestor(novoIdGestor);
    if (novoIdGestor) {
      localStorage.setItem('id_gestor', novoIdGestor);
    } else {
      localStorage.removeItem('id_gestor');
    }
  };

  const changeAdm = (novoAdm) => {
    setAdm(novoAdm);
    if (novoAdm !== null) {
      localStorage.setItem('adm', novoAdm);
    } else {
      localStorage.removeItem('adm');
    }
  };

  // Monitorar alterações diretamente do localStorage
  useEffect(() => {
    const checkLocalStorageChange = () => {
      const newEmpresaId = localStorage.getItem('id_empresa') || null;
      const newIdGestor = localStorage.getItem('id_gestor') || null;
      const newAdm = localStorage.getItem('adm') || null;

      if (newEmpresaId !== empresaId) setEmpresaId(newEmpresaId);
      if (newIdGestor !== idGestor) setIdGestor(newIdGestor);
      if (newAdm !== adm) setAdm(newAdm);
    };

    // Executa a função a cada renderização
    checkLocalStorageChange();

   // Fica verificando o localStorage a cada 1 segundo
   const intervalId = setInterval(checkLocalStorageChange, 1000);

    //Limpa o intervalo ao desmontar o componente
   return () => clearInterval(intervalId);
  }, [empresaId, idGestor, adm]);

  return (
    <EmpresaContext.Provider value={{ empresaId, idGestor, adm, changeEmpresaId, changeIdGestor, changeAdm }}>
      {children}
    </EmpresaContext.Provider>
  );
};
