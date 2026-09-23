import { Code2, FolderKanban, ArrowRight } from 'lucide-react';

export default function Dashboard({ onNavigate }) {
  return (
    <div className="h-full flex flex-col items-center justify-center p-6 bg-slate-950">
      {/* Titulo principal */}
      <div className="text-center max-w-xl mb-10 space-y-2">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
          Panel Principal
        </h2>
        <p className="text-sm text-slate-400">
          Seleccioná una herramienta para comenzar a explorar o gestionar tus proyectos.
        </p>
      </div>

      {/* Grilla de 2 Cards Centradas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl w-full">
        
        {/* Card 1: Lector CSS */}
        <button
          onClick={() => onNavigate('inspector')}
          className="group relative bg-slate-900 hover:bg-slate-800/80 border border-slate-800 hover:border-blue-500/50 p-6 rounded-2xl text-left transition-all duration-200 shadow-xl flex flex-col justify-between space-y-6 cursor-pointer"
        >
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <Code2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-100 group-hover:text-blue-400 transition-colors">
                Lector CSS / Inspector
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Inspeccioná código JSX/React, previsualizá en tiempo real y analizá recuadros de estructura y clases CSS.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 group-hover:translate-x-1 transition-transform">
            <span>Abrir herramienta</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </button>

        {/* Card 2: Segunda herramienta (Pendiente de configuración) */}
        <button
          onClick={() => onNavigate('templates')}
          className="group relative bg-slate-900 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 p-6 rounded-2xl text-left transition-all duration-200 shadow-xl flex flex-col justify-between space-y-6 cursor-pointer opacity-80 hover:opacity-100"
        >
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-600/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <FolderKanban className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-100 group-hover:text-emerald-400 transition-colors">
                Segunda Herramienta
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Módulo pendiente de configuración. Próximamente definiremos su funcionalidad.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all">
            <span>Configurar más adelante</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </button>

      </div>
    </div>
  );
}