import React from 'react';
import SyntaxInspector from '../Inspector/SyntaxInspector';

export default function CodeEditor({
  code,
  setCode,
  selectedClass,
  onSelectClass,
  activeNodeIds,
  onToggleNode,
  showInspector,
}) {
  return (
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

      {/* Inspector Dinámico de Sintaxis */}
      <SyntaxInspector
        code={code}
        selectedClass={selectedClass}
        onSelectClass={onSelectClass}
        activeNodeIds={activeNodeIds}
        onToggleNode={onToggleNode}
        showInspector={showInspector}
      />
    </div>
  );
}