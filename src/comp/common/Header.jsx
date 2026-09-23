// src/comp/common/Header.jsx
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import TemplateSelector from './TemplateSelector';

// Icono SVG oficial de GitHub
const GithubIcon = ({ className = "w-3.5 h-3.5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

export default function Header({
  activeTab,
  setActiveTab,
  showInspector,
  setShowInspector,
  onSelectTemplate,
  onOpenGithubModal,
}) {
  return (
    <header className="bg-slate-950 border-b border-slate-800 px-4 py-2.5 flex items-center justify-between shrink-0 h-14">
      {/* Lado Izquierdo */}
      <div className="flex items-center gap-4">
        {activeTab === 'dashboard' ? (
          <h1 className="font-bold text-sm tracking-tight text-blue-500">
            Project Visualizer & Manager
          </h1>
        ) : (
          <div className="flex items-center gap-3">
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

      {/* Lado Derecho */}
      {activeTab === 'inspector' && (
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenGithubModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer shadow-sm active:scale-95"
            title="Importar un repositorio público de GitHub"
          >
            <GithubIcon className="w-3.5 h-3.5 text-slate-400" />
            <span>Clonar GitHub</span>
          </button>

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