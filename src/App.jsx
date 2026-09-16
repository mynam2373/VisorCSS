// src/App.jsx
import { useState, useRef, useEffect } from 'react';
import { parseJSXToHTML } from './utils/jsxParser';
import SyntaxInspector from './comp/syntaxInspector';
import { TemplateSelector } from './comp/templateSelector';

export default function App() {
  const [code, setCode] = useState(
`<section className="bg-slate-950 text-slate-100 min-h-screen p-8">
  <div className="max-w-7xl mx-auto mb-16 text-center space-y-4">
    <span className="text-emerald-400 text-xs font-semibold tracking-[0.3em] uppercase bg-emerald-950/60 px-4 py-1.5 rounded-full border border-emerald-500/30">
      Colección de Temporada 2026
    </span>
    <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-rose-400">
      El Renacer de la Primavera
    </h1>
    <p className="text-slate-400 text-sm max-w-xl mx-auto">
      Explora la frescura de nuestra selección botánica artesanal.
    </p>
  </div>
</section>`
  );

  const [showInspector, setShowInspector] = useState(true);
  const [activeNodeIds, setActiveNodeIds] = useState([]);
  const [selectedClass, setSelectedClass] = useState('max-w-7xl');
  const [resolution, setResolution] = useState({ width: 1366, height: 768 });
  const [zoom, setZoom] = useState(0.5);

  const iframeRef = useRef(null);

  const handleToggleNode = (nodeId) => {
    setActiveNodeIds((prev) =>
      prev.includes(nodeId) ? prev.filter((id) => id !== nodeId) : [...prev, nodeId]
    );
  };

  useEffect(() => {
    if (!iframeRef.current) return;
    const doc = iframeRef.current.contentDocument;
    if (!doc) return;

    const bodyHtml = parseJSXToHTML(code, showInspector, activeNodeIds);

    doc.open();
    doc.write(`
      <!DOCTYPE html>
      <html style="height: 100%; overflow-y: auto;">
        <head>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            ::-webkit-scrollbar { width: 8px; }
            ::-webkit-scrollbar-track { background: #020617; }
            ::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 4px; }
            ::-webkit-scrollbar-thumb:hover { background: #334155; }
          </style>
        </head>
        <body class="bg-slate-950 text-slate-100 min-h-screen m-0 p-0 overflow-y-auto">
          ${bodyHtml}
        </body>
      </html>
    `);
    doc.close();
  }, [code, showInspector, activeNodeIds]);
return (
    <div className="h-screen flex flex-col bg-slate-900 text-slate-100 overflow-hidden">
      {/* Header Compacto */}
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
          <TemplateSelector onSelectTemplate={(templateCode) => setCode(templateCode)} />
        </div>
      </header>

      <main className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-3 p-3 overflow-hidden min-h-0">
        {/* Panel Izquierdo: Editor Apretado + Espacio Máximo para la Lista */}
        <div className="flex flex-col bg-slate-800 border border-slate-700 rounded-xl p-3 overflow-hidden space-y-2 min-h-0">
          <div className="font-mono text-[11px] text-slate-400 shrink-0">Editor JSX / React</div>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="h-28 shrink-0 bg-slate-900 p-2.5 font-mono text-xs text-slate-200 resize-none focus:outline-none rounded-lg border border-slate-700"
          />

          <SyntaxInspector
            code={code}
            selectedClass={selectedClass}
            onSelectClass={(cls) => setSelectedClass(cls)}
            activeNodeIds={activeNodeIds}
            onToggleNode={handleToggleNode}
            showInspector={showInspector}
          />
        </div>

        {/* Panel Derecho: Previsualización */}
        <div className="flex flex-col bg-slate-800 border border-slate-700 rounded-xl overflow-hidden min-h-0">
          <div className="bg-slate-850 p-2 border-b border-slate-700 flex flex-wrap justify-between items-center text-xs text-slate-400 font-mono gap-2 shrink-0">
            <div className="flex items-center gap-2">
              <span>Pantalla:</span>
              <button
                onClick={() => { setResolution({ width: 1366, height: 768 }); setZoom(0.5); }}
                className={`px-2 py-0.5 rounded ${resolution.width === 1366 ? 'bg-blue-600 text-white' : 'bg-slate-700'}`}
              >
                Desktop (1366x768)
              </button>
              <button
                onClick={() => { setResolution({ width: 768, height: 1024 }); setZoom(0.5); }}
                className={`px-2 py-0.5 rounded ${resolution.width === 768 ? 'bg-blue-600 text-white' : 'bg-slate-700'}`}
              >
                Tablet (768x1024)
              </button>
              <button
                onClick={() => { setResolution({ width: 375, height: 667 }); setZoom(0.65); }}
                className={`px-2 py-0.5 rounded ${resolution.width === 375 ? 'bg-blue-600 text-white' : 'bg-slate-700'}`}
              >
                Mobile (375x667)
              </button>
            </div>

            <div className="flex items-center gap-2 bg-slate-900 px-2 py-1 rounded border border-slate-700">
              <span>Zoom: {Math.round(zoom * 100)}%</span>
              <input
                type="range"
                min="0.2"
                max="1"
                step="0.05"
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="w-20 accent-blue-500 cursor-pointer"
              />
            </div>
          </div>

          <div className="flex-1 p-3 bg-slate-950 overflow-auto flex justify-center items-start min-h-0">
            <div
              style={{
                width: `${resolution.width * zoom}px`,
                height: `${resolution.height * zoom}px`,
              }}
              className="relative transition-all duration-200"
            >
              <div
                style={{
                  width: `${resolution.width}px`,
                  height: `${resolution.height}px`,
                  transform: `scale(${zoom})`,
                  transformOrigin: 'top left',
                }}
                className="bg-slate-900 rounded-lg shadow-2xl border border-slate-700 flex flex-col overflow-hidden"
              >
                <div className="bg-slate-800 px-3 py-1.5 border-b border-slate-700 flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></div>
                  </div>
                  <div className="flex-1 bg-slate-900/80 text-[10px] font-mono text-slate-400 px-3 py-0.5 rounded border border-slate-700 text-center">
                    localhost:5173 ({resolution.width}px × {resolution.height}px)
                  </div>
                </div>

                <iframe
                  ref={iframeRef}
                  title="preview"
                  className="w-full flex-1 border-0 bg-slate-950"
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}