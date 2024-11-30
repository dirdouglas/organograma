import React, { useState, useCallback } from "react";
import ReactFlow, {
  addEdge,
  MiniMap,
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  Handle,
} from "react-flow-renderer";

// Nó personalizado
const CustomNode = ({ data, id, isConnectable }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [nodeText, setNodeText] = useState(data.label);

  const handleDoubleClick = () => {
    setIsEditing(true); // Ativa modo de edição
  };

  const handleBlur = () => {
    setIsEditing(false);
    data.onUpdateNodeText(id, nodeText); // Atualiza o texto no estado principal
  };

  const handleTextChange = (e) => {
    setNodeText(e.target.value);
  };

  return (
    <div
      onDoubleClick={handleDoubleClick}
      style={{
        position: "relative",
        padding: "5px 10px",
        backgroundColor: "#fff",
        borderRadius: "8px",
        boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.1)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        whiteSpace: "nowrap",
        fontSize: 12,
        cursor: "pointer",
      }}
    >
      <Handle
        type="target"
        position="left"
        style={{
          background: "#F44336",
          width: 6,
          height: 6,
          borderRadius: "50%",
        }}
        onClick={(e) => {
          e.stopPropagation();
          data.onDeleteNode(id); // Excluir nó e conexões ao clicar
        }}
        isConnectable={isConnectable}
      />
      {isEditing ? (
        <input
          type="text"
          value={nodeText}
          onChange={handleTextChange}
          onBlur={handleBlur}
          autoFocus
          style={{
            border: "none",
            borderBottom: "1px solid #ccc",
            fontSize: "12px",
            textAlign: "center",
            outline: "none",
          }}
        />
      ) : (
        nodeText
      )}
      <Handle
        type="source"
        position="right"
        style={{
          background: "#4CAF50",
          width: 6,
          height: 6,
          borderRadius: "50%",
        }}
        onClick={(e) => {
          e.stopPropagation();
          data.onHandleClick(id); // Adicionar novo nó ao clicar
        }}
        isConnectable={isConnectable}
      />
    </div>
  );
};

// Definir nodeTypes após CustomNode ser declarado
const nodeTypes = { custom: CustomNode };

const initialNodes = [
  {
    id: "1",
    type: "custom",
    data: { label: "Tema Principal" },
    position: { x: 100, y: 100 },
  },
];

const initialEdges = [];

const MindMap = () => {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const [nodeIdCounter, setNodeIdCounter] = useState(2);

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onConnect = useCallback(
    (connection) => setEdges((eds) => addEdge(connection, eds)),
    []
  );

  const handleAddNode = (parentId) => {
    const parentNode = nodes.find((node) => node.id === parentId);
    if (!parentNode) {
      console.error("Nó pai não encontrado!");
      return;
    }

    const childNodes = nodes.filter((node) => node.parentId === parentId);

    const newNodeId = `${nodeIdCounter}`;
    const newPosition = {
      x: parentNode.position.x + 200,
      y: parentNode.position.y + 50 * childNodes.length,
    };

    const newNode = {
      id: newNodeId,
      data: {
        label: `Novo Nó ${nodeIdCounter}`,
        onHandleClick: handleAddNode,
        onDeleteNode: handleDeleteNode,
        onUpdateNodeText: handleUpdateNodeText,
      },
      position: newPosition,
      type: "custom",
      parentId,
    };

    setNodes((nds) => [...nds, newNode]);
    setEdges((eds) => [
      ...eds,
      { id: `e${parentId}-${newNodeId}`, source: parentId, target: newNodeId },
    ]);
    setNodeIdCounter((count) => count + 1);
  };

  const handleDeleteNode = (nodeId) => {
    // Filtrar nós e conexões relacionadas
    const nodesToKeep = nodes.filter((node) => node.id !== nodeId);
    const edgesToKeep = edges.filter(
      (edge) => edge.source !== nodeId && edge.target !== nodeId
    );

    setNodes(nodesToKeep);
    setEdges(edgesToKeep);
  };

  const handleUpdateNodeText = (nodeId, newText) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId ? { ...node, data: { ...node.data, label: newText } } : node
      )
    );
  };

  const handleReset = () => {
    setNodes(initialNodes);
    setEdges(initialEdges);
    setNodeIdCounter(2);
  };

  return (
    <div style={{ height: "100vh", position: "relative" }}>
      {nodes.length === 0 && (
        <button
          onClick={handleReset}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            padding: "10px 20px",
            fontSize: "16px",
            cursor: "pointer",
          }}
        >
          Recriar Nó Principal
        </button>
      )}
      <ReactFlow
        nodes={nodes.map((node) => ({
          ...node,
          data: {
            ...node.data,
            onHandleClick: handleAddNode,
            onDeleteNode: handleDeleteNode,
            onUpdateNodeText: handleUpdateNodeText,
          },
        }))}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
        style={{ background: "#F3F4F6" }}
      >
        <MiniMap />
        <Controls />
        <Background color="#aaa" gap={16} />
      </ReactFlow>
    </div>
  );
};

export default MindMap;
