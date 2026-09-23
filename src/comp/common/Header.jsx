// src/components/common/Header.jsx
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import TemplateSelector from './TemplateSelector';

export default function Header({
  activeTab,
  setActiveTab,
  showInspector,
  setShowInspector,
  onSelectTemplate,
}) {
  return (
    <header className="bg-slate-950 border-b border-slate-800 px-4 py-2.5 flex items-center justify-between shrink-0 h-14">
      {/* Lado Izquierdo: Título y Navegación según contexto */}
      <div className="flex items-center gap-4">
        {activeTab === 'dashboard' ? (
          <h1 className="font-bold text-sm tracking-tight text-blue-500">
            Project Visualizer & Manager
          </h1>
        ) : (
          <div className="flex items-center gap-3">
            {/* Botón para volver al menú principal */}
            <button
              onClick={() => setActiveTab('dashboard')}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs text-slate-400 hover:text-white transition-all cursor-pointer"
              title="Volver al Panel Principal"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Menú</span>
            </button>

            <div className="h-4 w-[1px] bg-slate-800" />

            <span className="text-xs font-semibold text-slate-200">
              Lector CSS / Inspector
            </span>
          </div>
        )}
      </div>

      {/* Lado Derecho: Herramientas exclusivas del Lector CSS */}
      {activeTab === 'inspector' && (
        <div className="flex items-center gap-3">
          <TemplateSelector onSelectTemplate={onSelectTemplate} />

          <button
            onClick={() => setShowInspector(!showInspector)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
              showInspector
                ? 'bg-blue-600/20 text-blue-400 border-blue-500/40 shadow-sm'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            {showInspector ? (
              <>
                <Eye className="w-3.5 h-3.5" />
                <span>Recuadros Visibles</span>
              </>
            ) : (
              <>
                <EyeOff className="w-3.5 h-3.5" />
                <span>Recuadros Ocultos</span>
              </>
            )}
          </button>
        </div>
      )}
    </header>
  );
}