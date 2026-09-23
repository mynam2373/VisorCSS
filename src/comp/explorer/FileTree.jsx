// src/comp/explorer/FileTree.jsx
import {
  Folder,
  FolderOpen,
  FileCode,
  ChevronRight,
  ChevronDown,
  FolderPlus,
  FolderMinus,
  FilePlus,
  FileMinus,
  X,
  FolderTree,
  Sparkles,
  FileText,
} from 'lucide-react';

function TreeNode({ node, selectedNodeId, onSelectNode, onToggleFolder }) {
  const isFolder = node.type === 'folder';
  const isSelected = selectedNodeId === node.id;

  return (
    <div className="select-none">
      <div
        onClick={() => {
          onSelectNode(node);
          if (isFolder) {
            onToggleFolder(node.id);
          }
        }}
        style={{ paddingLeft: `${node.depth * 12 + 8}px` }}
        className={`flex items-center gap-2 py-1.5 px-2 text-xs rounded-lg cursor-pointer transition-colors ${
          isSelected
            ? 'bg-blue-600/30 text-blue-300 font-medium border border-blue-500/40'
            : 'text-slate-300 hover:bg-slate-800/60 hover:text-white border border-transparent'
        }`}
      >
        {isFolder ? (
          <>
            <span className="text-slate-500">
              {node.isOpen !== false ? (
                <ChevronDown className="w-3.5 h-3.5" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5" />
              )}
            </span>
            {node.isOpen !== false ? (
              <FolderOpen className="w-4 h-4 text-amber-400 shrink-0" />
            ) : (
              <Folder className="w-4 h-4 text-amber-400/80 shrink-0" />
            )}
          </>
        ) : (
          <FileCode className="w-4 h-4 text-blue-400/80 shrink-0 ml-3.5" />
        )}

        <span className="truncate">{node.name}</span>
      </div>

      {isFolder && node.isOpen !== false && node.children && node.children.length > 0 && (
        <div className="space-y-0.5">
          {node.children.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              selectedNodeId={selectedNodeId}
              onSelectNode={onSelectNode}
              onToggleFolder={onToggleFolder}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function FileTree({
  files = [],
  selectedNode,
  onSelectNode,
  onToggleFolder,
  onCreateFolder,
  onDeleteFolder,
  onCreateFile,
  onDeleteFile,
  isOpen,
  onToggleOpen,
  projects = [],
  activeProjectId,
  onSelectProject,
}) {

    console.log('--> FileTree Render | isOpen:', isOpen, '| projects:', projects)
  const isSelectedFolder = selectedNode?.type === 'folder';
  const isSelectedFile = selectedNode?.type === 'file';
  const isProtected = selectedNode?.isProtected;

  const canCreateFolder = true;
  const canDeleteFolder = isSelectedFolder && !isProtected;
  const canCreateFile = true;
  const canDeleteFile = isSelectedFile && !isProtected;

  if (!isOpen) return null;

  return (
    <>
      <div
        onClick={onToggleOpen}
        className="absolute inset-0 bg-black/50 backdrop-blur-[2px] z-40 transition-opacity"
      />

      <div className="absolute top-0 bottom-0 left-0 z-50 w-80 bg-[#090d16] backdrop-blur-md border-r border-slate-800 shadow-2xl flex flex-col transition-all duration-300">
        
        {/* Cabecera con título y botón cerrar */}
        <div className="px-4 pt-3 pb-2 border-b border-slate-800/80 bg-[#0b101b]">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-2">
              <FolderTree className="w-4 h-4 text-blue-400" />
              <span className="text-[11px] font-bold tracking-wider uppercase text-slate-300">
                DIRECTORIO DE PROYECTO
              </span>
            </div>
            <button
              onClick={onToggleOpen}
              className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* SOLAPA / PESTAÑAS (Intercambiador de FileTree) */}
          <div className="grid grid-cols-2 gap-1.5 p-1 bg-[#050810] rounded-lg border border-slate-800/80">
            {projects.map((proj) => {
              const isActive = proj.id === activeProjectId;
              const isTemplate = proj.id === 'proj_template';
              console.log('Proyectos recibidos en FileTree:', projects);

              return (
                <button
                  key={proj.id}
                  onClick={() => onSelectProject(proj.id)}
                  className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-md text-[11px] font-medium transition-all ${
                    isActive
                      ? 'bg-blue-600/30 text-blue-300 border border-blue-500/50 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'
                  }`}
                >
                  {isTemplate ? (
                    <Sparkles className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-400' : 'text-slate-500'}`} />
                  ) : (
                    <FileText className={`w-3.5 h-3.5 ${isActive ? 'text-blue-400' : 'text-slate-500'}`} />
                  )}
                  <span className="truncate">{proj.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Arbol de Archivos de la pestaña activa */}
        <div className="flex-1 p-2 overflow-y-auto space-y-0.5 custom-scrollbar">
          {files && files.length > 0 ? (
            files.map((node) => (
              <TreeNode
                key={node.id}
                node={node}
                selectedNodeId={selectedNode?.id}
                onSelectNode={onSelectNode}
                onToggleFolder={onToggleFolder}
              />
            ))
          ) : (
            <div className="p-4 text-center text-slate-500 text-xs">
              Sin archivos en este directorio
            </div>
          )}
        </div>

        {/* Acciones Inferiores */}
        <div className="p-3 bg-[#070a12] border-t border-slate-800/80 flex items-center justify-around gap-2">
          <button
            onClick={onCreateFolder}
            disabled={!canCreateFolder}
            className={`p-2 rounded-lg border transition-all ${
              canCreateFolder
                ? 'bg-slate-900 border-slate-700/80 text-amber-400 hover:bg-slate-800 hover:border-amber-500/40'
                : 'bg-slate-950/40 border-slate-900 text-slate-700 cursor-not-allowed'
            }`}
            title="Crear Carpeta"
          >
            <FolderPlus className="w-4 h-4" />
          </button>

          <button
            onClick={onDeleteFolder}
            disabled={!canDeleteFolder}
            className={`p-2 rounded-lg border transition-all ${
              canDeleteFolder
                ? 'bg-slate-900 border-slate-700/80 text-rose-400 hover:bg-slate-800 hover:border-rose-500/40'
                : 'bg-slate-950/40 border-slate-900 text-slate-700 cursor-not-allowed'
            }`}
            title="Eliminar Carpeta"
          >
            <FolderMinus className="w-4 h-4" />
          </button>

          <button
            onClick={onCreateFile}
            disabled={!canCreateFile}
            className={`p-2 rounded-lg border transition-all ${
              canCreateFile
                ? 'bg-slate-900 border-slate-700/80 text-blue-400 hover:bg-slate-800 hover:border-blue-500/40'
                : 'bg-slate-950/40 border-slate-900 text-slate-700 cursor-not-allowed'
            }`}
            title="Crear Archivo"
          >
            <FilePlus className="w-4 h-4" />
          </button>

          <button
            onClick={onDeleteFile}
            disabled={!canDeleteFile}
            className={`p-2 rounded-lg border transition-all ${
              canDeleteFile
                ? 'bg-slate-900 border-slate-700/80 text-rose-400 hover:bg-slate-800 hover:border-rose-500/40'
                : 'bg-slate-950/40 border-slate-900 text-slate-700 cursor-not-allowed'
            }`}
            title="Eliminar Archivo"
          >
            <FileMinus className="w-4 h-4" />
          </button>
        </div>
      </div>
    </>
  );
}