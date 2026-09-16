// src/components/SyntaxInspector.jsx
import { useState } from 'react';
import { parseTailwindClass } from '../../utils/classParser';
import { extractNodesFromJSX } from '../../utils/jsxParser';

export default function SyntaxInspector({
  code,
  selectedClass,
  onSelectClass,
  activeNodeIds = [],
  onToggleNode,
  showInspector,
}) {
  const nodes = extractNodesFromJSX(code);
  const info = selectedClass ? parseTailwindClass(selectedClass) : null;

  return (
    <div className="flex flex-col space-y-2.5 font-mono text-xs overflow-hidden flex-1 min-h-0">
      {/* 1. Lista de Nodos */}
      <div className="flex flex-col flex-1 min-h-0 space-y-1.5 overflow-hidden">
        <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
          Estructura de Nodos y Clases:
        </span>

        <div className="space-y-2 overflow-y-auto pr-1 flex-1">
          {nodes.map((node) => {
            const isActive = showInspector || activeNodeIds.includes(node.id);

            return (
              <div
                key={node.id}
                className="p-2 bg-slate-900/90 border border-slate-700/60 rounded-lg flex flex-col space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => onToggleNode(node.id)}
                    style={{ borderColor: node.color, color: node.color }}
                    className={`px-2 py-0.5 border rounded font-bold text-[11px] transition-all flex items-center gap-1.5 cursor-pointer ${
                      isActive ? 'bg-slate-800 shadow-sm' : 'opacity-50 hover:opacity-100'
                    }`}
                  >
                    <span
                      className="w-2 h-2 rounded-full inline-block"
                      style={{ backgroundColor: node.color }}
                    ></span>
                    {node.label}
                  </button>

                  <span className="text-[10px] text-slate-500 font-mono">
                    {node.classes.length} clases
                  </span>
                </div>

                <div className="flex flex-wrap gap-1 pl-1">
                  {node.classes.length === 0 ? (
                    <span className="text-slate-600 text-[10px] italic">sin clases</span>
                  ) : (
                    node.classes.map((cls, idx) => (
                      <button
                        key={`${node.id}-${cls}-${idx}`}
                        onClick={() => onSelectClass(cls)}
                        className={`px-1.5 py-0.5 rounded text-[11px] transition-colors cursor-pointer ${
                          selectedClass === cls
                            ? 'bg-blue-600 text-white font-semibold'
                            : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        {cls}
                      </button>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Anatomía de Clase (Limpia sin duplicar etiquetas) */}
      <div className="p-2.5 bg-slate-900 border border-slate-700/80 rounded-lg space-y-1.5 text-slate-200 shrink-0">
        <div className="flex justify-between items-center border-b border-slate-800 pb-1">
          <span className="text-xs font-bold text-blue-400 font-mono">
            {selectedClass || 'Ninguna clase seleccionada'}
          </span>
          <span className="text-[9px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
            Anatomía de Clase
          </span>
        </div>

        {info ? (
          <div className="space-y-1 text-[11px]">
            {info.variants && info.variants.length > 0 && (
              <div className="bg-slate-950/80 p-1.5 rounded border border-slate-800 mb-1 space-y-1">
                <span className="text-[10px] text-purple-400 font-bold block">
                  CONDICIÓN / VARIANTE:
                </span>
                {info.variants.map((v, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 text-[10px]">
                    <span className="px-1.5 py-0.2 bg-purple-950 text-purple-300 border border-purple-500/40 rounded font-bold font-mono">
                      {v.prefix}:
                    </span>
                    <span className="text-slate-300">{v.description}</span>
                  </div>
                ))}
              </div>
            )}

            <p>
              <span className="text-blue-400 font-bold">└─► PROPIEDAD:</span>{' '}
              {info.prefixMeaning}
            </p>
            {info.axisMeaning && (
              <p>
                <span className="text-emerald-400 font-bold">└─► EJE / ÁMBITO:</span>{' '}
                {info.axisMeaning}
              </p>
            )}
            {info.valueMeaning && (
              <p>
                <span className="text-amber-400 font-bold">└─► VALOR:</span>{' '}
                {info.valueMeaning}
              </p>
            )}
            <div className="pt-0.5 text-[10px] text-slate-400">
              <span className="text-slate-500">CSS:</span> {info.cssEquivalent}
            </div>
          </div>
        ) : (
          <p className="text-[10px] text-slate-500 italic">
            Seleccioná una clase arriba para analizar su estructura.
          </p>
        )}
      </div>
    </div>
  );
}