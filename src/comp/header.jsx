// src/components/Header.jsx
import React from 'react';
import { TemplateSelector } from './templateSelector';

export default function Header({ showInspector, setShowInspector, onSelectTemplate }) {
  return (
    <header className="border-b border-slate-800 px-4 py-2.5 flex justify-between items-center bg-slate-900 shrink-0">
      <h1 className="text-base font-bold text-blue-500">Tailwind & React Lab</h1>
      
      {/* Grupo de Controles a la Derecha */}
      <div className="flex items-center gap-4">
        <label className="flex items-center space-x-2 text-xs cursor-pointer select-none">
          <input
            type="checkbox"
            checked={showInspector}
            onChange={(e) => setShowInspector(e.target.checked)}
            className="rounded bg-slate-800 border-slate-700 text-blue-600 focus:ring-0 cursor-pointer"
          />
          <span>Modo Inspección (Todos los bordes)</span>
        </label>

        {/* Selector de Plantillas */}
        <TemplateSelector onSelectTemplate={onSelectTemplate} />
      </div>
    </header>
  );
}