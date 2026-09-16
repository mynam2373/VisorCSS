// src/App.jsx
import { useState } from 'react';
import Header from './components/header';
import SyntaxInspector from './components/SyntaxInspector';
import { TEMPLATES } from './data/templates';

export default function App() {
  // Estado para el código JSX (inicia con la primera plantilla por defecto)
  const [code, setCode] = useState(TEMPLATES[0].code);
  const [selectedClass, setSelectedClass] = useState(null);
  const [activeNodeIds, setActiveNodeIds] = useState([]);
  const [showInspector, setShowInspector] = useState(false);

  const handleToggleNode = (id) => {
    setActiveNodeIds((prev) =>
      prev.includes(id) ? prev.filter((nodeId) => nodeId !== id) : [...prev, id]
    );
  };

  return (
    <div className="h-screen flex flex-col bg-slate-900 text-slate-100 overflow-hidden">
      {/* Header Limpio */}
      <Header
        showInspector={showInspector}
        setShowInspector={setShowInspector}
        onSelectTemplate={(templateCode) => {
          setCode(templateCode);
          setSelectedClass(null);
        }}
      />

      <main className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-3 p-3 overflow-hidden min-h-0">
        {/* Panel Izquierdo: Editor + Inspector de Sintaxis */}
        <div className="flex flex-col bg-slate-800 border border-slate-700 rounded-xl p-3 overflow-hidden space-y-2 min-h-0">
          <div className="font-mono text-[11px] text-slate-400 shrink-0 flex justify-between items-center">
            <span>Editor JSX / React</span>
          </div>

          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full h-44 bg-slate-950 text-slate-200 font-mono text-xs p-3 rounded-lg border border-slate-700/80 focus:outline-none focus:border-blue-500 resize-none shrink-0"
            placeholder="Pegá tu código JSX aquí..."
          />

          {/* Inspector Dinámico de Estructura y Clases */}
          <SyntaxInspector
            code={code}
            selectedClass={selectedClass}
            onSelectClass={setSelectedClass}
            activeNodeIds={activeNodeIds}
            onToggleNode={handleToggleNode}
            showInspector={showInspector}
          />
        </div>

        {/* Panel Derecho: Vista Previa */}
        <div className="flex flex-col bg-slate-800 border border-slate-700 rounded-xl p-3 overflow-hidden min-h-0">
          <div className="font-mono text-[11px] text-slate-400 mb-2 shrink-0">Vista Previa</div>
          <div className="flex-1 bg-slate-950 rounded-lg border border-slate-700/80 overflow-auto p-4">
            {/* Componente o Evaluador de Previsualización */}
          </div>
        </div>
      </main>
    </div>
  );
}