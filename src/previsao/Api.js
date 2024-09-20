import axios from 'axios';

// Função genérica para chamadas GET
const getData = async (url, params = {}) => {
  try {
    const response = await axios.get(url, { params });
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar dados da URL ${url}:`, error);
    throw new Error('Erro ao buscar dados da API.');
  }
};

// Função para listar funcionários previstos
export const listarFuncionariosPrevistos = (id_empresa, id_usuario = null) => {
  const url = 'https://i2vtho4ifl.execute-api.us-east-1.amazonaws.com/dev/listar-previstos';
  const params = { id_empresa };
  
  if (id_usuario) {
    params.id_usuario = id_usuario;
  }

  console.log('Payload enviado:', params);  // Verifique o payload
  return getData(url, params);
};

// Função para listar departamentos
export const listarDepartamentos = (id_empresa) => {
  const url = 'https://jra0np42jc.execute-api.us-east-1.amazonaws.com/dev/departamentos';
  const params = { id_empresa };
  return getData(url, params);
};

// Função para listar funções
export const listarFuncoes = (id_empresa) => {
  const url = 'https://44d5uoizbg.execute-api.us-east-1.amazonaws.com/dev/listar-funcoes';
  const params = { id_empresa };
  return getData(url, params);
};

// Função para alterar previsão (post para novas vagas, duplicar ou alterar justificativa)
export const alterarPrevisao = async (body) => {
  try {
    const response = await axios.post(
      'https://2gfpdxjv31.execute-api.us-east-1.amazonaws.com/dev/altera-previsao',
      JSON.stringify(body), // Payload sendo enviado diretamente
      { headers: { 'Content-Type': 'application/json' } }
    );
    return response.data;
  } catch (error) {
    console.error('Erro ao alterar previsão:', error);
    throw new Error('Erro ao realizar alteração.');
  }
};

// Função para excluir previsão
export const excluirPrevisao = async (id) => {
  try {
    const response = await axios.delete(
      'https://2gfpdxjv31.execute-api.us-east-1.amazonaws.com/dev/altera-previsao', 
      {
        headers: { 'Content-Type': 'application/json' },
        data: JSON.stringify({ action: 'excluir_previsao', id }) // Remove duplicidade no body
      }
    );
    return response.data;
  } catch (error) {
    console.error('Erro ao excluir previsão:', error);
    throw new Error('Erro ao excluir previsão.');
  }
};

// Função para confirmar previsão
export const confirmarPrevisaoApi = async (id, prev_confirmada = 1) => {
  try {
    const response = await axios.post(
      'https://2gfpdxjv31.execute-api.us-east-1.amazonaws.com/dev/altera-previsao',
      {
        body: JSON.stringify({
          action: 'confirmar_previsao',
          id: String(id),
          prev_confirmada: prev_confirmada
        })
      }, // Envolver a estrutura JSON dentro de `body`
      { headers: { 'Content-Type': 'application/json' } }
    );
    return response.data;
  } catch (error) {
    console.error('Erro ao confirmar previsão:', error);
    throw new Error('Erro ao confirmar previsão');
  }
};



// Função para alterar justificativa
export const alterarJustificativaApi = async (id, justificativa) => {
  try {
    const response = await axios.post(
      'https://2gfpdxjv31.execute-api.us-east-1.amazonaws.com/dev/altera-previsao',
      {
        body: JSON.stringify({
          action: 'alterar_justificativa',
          id: String(id),
          justificativa: justificativa
        })
      }, // Envolver a estrutura JSON dentro de `body`
      { headers: { 'Content-Type': 'application/json' } }
    );
    return response.data;
  } catch (error) {
    console.error('Erro ao alterar justificativa:', error);
    throw new Error('Erro ao alterar justificativa');
  }
};

// Função para alterar justificativa
export const preverDemissaoApi = async (id, dataDemissao, prevDemissao) => {
  try {
    const response = await axios.post(
      'https://2gfpdxjv31.execute-api.us-east-1.amazonaws.com/dev/altera-previsao',
      {
        body: JSON.stringify({
        action: 'prever_demissao',
        id: String(id),
        data_demissao: dataDemissao,
        prev_demissao: prevDemissao
        })
      }, // Envolver a estrutura JSON dentro de `body`
      { headers: { 'Content-Type': 'application/json' } }
    );
    return response.data;
  } catch (error) {
    console.error('Erro ao alterar justificativa:', error);
    throw new Error('Erro ao alterar justificativa');
  }
};

export const deletePrevisaoApi = async (id) => {
  try {
    const response = await axios({
      method: 'delete',
      url: 'https://2gfpdxjv31.execute-api.us-east-1.amazonaws.com/dev/altera-previsao',
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        body: JSON.stringify({
          action: 'excluir_previsao',
          id: id, // ID da previsão para excluir
        }),
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(`Erro ao excluir a previsão: ${error.message}`);
  }
};


// Função para prever uma vaga (nova vaga)
export const preverVagaApi = async (vagaData) => {
  try {
    const response = await axios.post(
      'https://2gfpdxjv31.execute-api.us-east-1.amazonaws.com/dev/altera-previsao',
      {body: JSON.stringify(vagaData)
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return response;
  } catch (error) {
    throw new Error('Erro ao prever vaga: ' + error.message);
  }
};


// Função para listar empresas
export const listarEmpresas = async () => {
  const url = 'https://wesa751bfk.execute-api.us-east-1.amazonaws.com/dev/empresa';
  
  try {
    const response = await axios.get(url);
    
    // Mapeia os dados retornados para extrair id_empresa e descricao
    const empresas = response.data.map((empresa) => ({
      id_empresa: empresa.id_empresa,
      label: empresa.descricao,
    }));
    
    return empresas;
  } catch (error) {
    console.error('Erro ao carregar empresas:', error);
    throw new Error('Erro ao carregar lista de empresas.');
  }
};


// Função para buscar os funcionários ativos
export const fetchFuncionariosAtivos = async (id_empresa, adm, id_gestor) => {
  try {
    const params = {
      id_empresa,
    };

    // Se o usuário não for administrador, adicionar id_gestor aos parâmetros
    if (adm === '0' && id_gestor) {
      params.id_gestor = id_gestor;
    }

    const response = await axios.get(
      'https://egihhyuk4c.execute-api.us-east-1.amazonaws.com/dev/funcionarios-ativos',
      { params }
    );

    let responseData = response.data;
    if (typeof responseData === 'string') {
      responseData = JSON.parse(responseData);
    }

    return responseData;
  } catch (error) {
    console.error('Erro ao buscar funcionários ativos:', error);
    throw new Error('Erro ao buscar funcionários ativos');
  }
};

export const saveFuncionariosAtivos = async (dataToSend) => {
  try {
    // Construir o corpo da requisição no formato stringificado
    const requestBody = {
      body: JSON.stringify({
        action: "gravar_funcionarios",
        funcionarios: dataToSend
      })
    };

    // Enviar a requisição com o corpo stringificado
    const response = await axios.post(
      'https://2gfpdxjv31.execute-api.us-east-1.amazonaws.com/dev/altera-previsao',
      JSON.stringify(requestBody),  // Stringifica todo o objeto de request
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    return response;
  } catch (error) {
    console.error('Erro ao gravar os dados dos funcionários ativos:', error);
    throw new Error('Erro ao gravar os dados dos funcionários ativos');
  }
};




// src/resumo/api.js

export const carregarResumo = async (dataSelecionada, empresaId, idGestor, adm) => {
  try {
    const params = {
      data_referencia: dataSelecionada,
      id_empresa: empresaId,
    };

    if (adm === '0') {
      params.id_usuario = idGestor || undefined;
    }

    const response = await axios.get(
      `https://jlwb9ldard.execute-api.us-east-1.amazonaws.com/dev/resumo-previsto`,
      { params }
    );

    return response.data; // Retorna os dados da API
  } catch (error) {
    console.error('Erro ao carregar os dados:', error);
    throw error; // Lança o erro para ser tratado pelo componente
  }
};


// Função para alterar o departamento previsto
export const alterarDepartamento = async (id, id_departamento_previsto) => {
  try {
    // Montar o corpo da requisição, incluindo `httpMethod`
    const requestBody = {
      httpMethod: 'POST',  // Explicitamente informando que é um POST
      body: JSON.stringify({
        id: String(id),  // ID que será enviado
        id_departamento_previsto: String(id_departamento_previsto)  // ID do novo departamento previsto
      })
    };

    // Fazer a chamada POST para o endpoint
    const response = await axios.post(
      'https://jra0np42jc.execute-api.us-east-1.amazonaws.com/dev/departamentos',
      requestBody, // Enviar o corpo da requisição com `httpMethod` e `body`
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );

    return response.data; // Retornar os dados da resposta da API
  } catch (error) {
    console.error('Erro ao alterar o departamento previsto:', error);
    throw new Error('Erro ao alterar o departamento previsto.');
  }
};



// Função para alterar a função prevista
export const alterarFuncao = async (id, id_funcao_prevista) => {
  try {
    // Montar o corpo da requisição
    const requestBody = {
      httpMethod: 'POST',  // Explicitamente informando que é um POST
      body: JSON.stringify({
        id: String(id),  // ID que será enviado
        id_funcao_prevista: String(id_funcao_prevista)  // ID da nova função prevista
      })
    };

    // Fazer a chamada POST para o endpoint da função
    const response = await axios.post(
      'https://44d5uoizbg.execute-api.us-east-1.amazonaws.com/dev/listar-funcoes',  // Substitua pela URL correta do endpoint
      requestBody, // Enviar o corpo da requisição com `httpMethod` e `body`
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );

    return response.data; // Retornar os dados da resposta da API
  } catch (error) {
    console.error('Erro ao alterar a função prevista:', error);
    throw new Error('Erro ao alterar a função prevista.');
  }
};



