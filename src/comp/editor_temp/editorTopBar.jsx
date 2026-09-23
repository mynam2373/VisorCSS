// src/comp/editor_temp/EditorTopBar.jsx
import { FolderTree } from 'lucide-react';

export default function EditorTopBar({
  isFileTreeOpen,
  setIsFileTreeOpen,
  activeProjectName,
  selectedFileName,
}) {
  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-xl px-3 py-2 text-xs flex items-center justify-between shrink-0">
      <button
        onClick={() => setIsFileTreeOpen(!isFileTreeOpen)}
        className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 transition-colors flex items-center gap-1.5 text-xs font-medium cursor-pointer"
      >
        <FolderTree className="w-3.5 h-3.5 text-blue-400" />
        <span>{isFileTreeOpen ? 'Ocultar menú' : 'Abrir directorio'}</span>
      </button>
      <div className="flex items-center gap-2">
        <span className="text-slate-500 text-[11px]">[{activeProjectName}]</span>
        <span className="text-slate-400 font-mono">
          Archivo: <strong className="text-blue-400">{selectedFileName || 'Ninguno'}</strong>
        </span>
      </div>
    </div>
  );
}