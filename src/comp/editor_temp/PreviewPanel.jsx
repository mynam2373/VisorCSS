// src/comp/editor/PreviewPanel.jsx
import { useState } from 'react';
import { extractNodesFromJSX } from '../../utils/jasxparser';

export default function PreviewPanel({ 
  code = '', 
  showInspector = true, 
  activeNodeIds = [] 
}) {
  const [device, setDevice] = useState('desktop');
  const [zoom, setZoom] = useState(40);

  const dimensions = {
    desktop: { width: 1366, height: 768, label: 'Desktop (1366x768)' },
    tablet: { width: 768, height: 1024, label: 'Tablet (768x1024)' },
    mobile: { width: 375, height: 667, label: 'Mobile (375x667)' },
  };

  const activeDim = dimensions[device];

  const buildSrcDoc = (jsxCode) => {
    // Extraemos los nodos con sus colores desde el parser
    const nodes = extractNodesFromJSX(jsxCode);

    // Creamos las reglas CSS para los bordes
    const dynamicStyles = nodes
      .map((node) => {
        const isVisible = showInspector || activeNodeIds.includes(node.id);
        if (!isVisible) return '';

        return `
          [data-node-id="${node.id}"] {
            outline: 2px dashed ${node.color} !important;
            outline-offset: -2px !important;
          }
        `;
      })
      .join('\n');

    // Inyectamos el identificador data-node-id en cada etiqueta
    let elementIndex = 0;
    const cleanHtml = jsxCode
      .replace(/className=/g, 'class=')
      .replace(/\{\/\*[\s\S]*?\*\/\}/g, '')
      .replace(/<([a-z0-9]+)([^>]*)/gi, (match, p1, p2) => {
        if (['br', 'hr', 'img', 'input'].includes(p1.toLowerCase()) && match.endsWith('/>')) {
          return match;
        }
        const nodeId = nodes[elementIndex]?.id || `node-${elementIndex}`;
        elementIndex++;
        return `<${p1} data-node-id="${nodeId}"${p2}`;
      });

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            html, body { 
              margin: 0; 
              padding: 0; 
              width: 100%; 
              min-height: 100%; 
              overflow-x: hidden; 
              overflow-y: auto; 
              background-color: #020617; 
              color: #f8fafc; 
            }
            ${dynamicStyles}
          </style>
        </head>
        <body>
          ${cleanHtml}
        </body>
      </html>
    `;
  };

  return (
    <div className="flex flex-col bg-slate-800 border border-slate-700 rounded-xl p-3 overflow-hidden min-h-0 h-full">
      {/* Selector de Pantallas y Slider */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3 shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">Pantalla:</span>
          <div className="flex bg-slate-900/80 p-1 rounded-lg border border-slate-700/60 text-xs">
            {Object.keys(dimensions).map((key) => (
              <button
                key={key}
                onClick={() => setDevice(key)}
                className={`px-3 py-1 rounded-md font-medium transition-all ${
                  device === key
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {dimensions[key].label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-700/60 text-xs">
          <span className="text-slate-400 font-mono text-[11px]">Zoom: {zoom}%</span>
          <input
            type="range"
            min="20"
            max="100"
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="w-24 accent-blue-500 cursor-pointer"
          />
        </div>
      </div>

      {/* Árbol de Renderizado Principal */}
      <div className="flex-1 bg-slate-950 rounded-lg border border-slate-700/80 overflow-hidden flex justify-center items-center relative p-2">
        <div
          style={{
            width: `${activeDim.width}px`,
            height: `${activeDim.height}px`,
            transform: `scale(${zoom / 100})`,
            transformOrigin: 'center center',
            transition: 'transform 0.15s ease, width 0.2s ease, height 0.2s ease',
          }}
          className="bg-slate-900 border border-slate-700 rounded-lg shadow-2xl overflow-hidden flex flex-col shrink-0 relative"
        >
          {/* Mockup Header del Browser */}
          <div className="bg-slate-800/90 border-b border-slate-700/80 px-3 py-1.5 flex items-center gap-2 shrink-0">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
            </div>
            <div className="flex-1 bg-slate-950/60 rounded px-3 py-0.5 text-[10px] font-mono text-slate-500 text-center truncate mx-4 border border-slate-800">
              localhost:5173 ({activeDim.width}px x {activeDim.height}px)
            </div>
          </div>

          {/* Iframe */}
          <div className="flex-1 relative bg-slate-950 overflow-hidden">
            <div className="absolute inset-0 z-10 pointer-events-none" />
            <iframe
              srcDoc={buildSrcDoc(code)}
              title="Preview UI"
              className="w-full h-full border-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}