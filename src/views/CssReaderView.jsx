// src/views/CssReaderView.jsx
import { useState, useEffect } from 'react';
import { FolderTree } from 'lucide-react';
import FileTree from '../comp/explorer/filetree';
import CodeEditor from '../comp/editor_temp/CodeEditor';
import PreviewPanel from '../comp/editor_temp/PreviewPanel';
import { defaultTemplateFileSystem, emptyProjectFileSystem } from '../data/Templates';

const INITIAL_PROJECT_INSTANCES = [
  {
    id: 'proj_template',
    name: 'Plantilla Base',
    files: defaultTemplateFileSystem,
    selectedFileId: 'App.jsx',
  },
  {
    id: 'proj_empty',
    name: 'Proyecto Limpio',
    files: emptyProjectFileSystem,
    selectedFileId: 'App.jsx',
  },
];

export default function CssReaderView({
  code,
  setCode,
  showInspector,
  selectedClass,
  setSelectedClass,
}) {
  const [projects, setProjects] = useState(INITIAL_PROJECT_INSTANCES);
  const [activeProjectId, setActiveProjectId] = useState(INITIAL_PROJECT_INSTANCES[0].id);

  const activeProject = projects.find((p) => p.id === activeProjectId) || projects[0];

  const [selectedNode, setSelectedNode] = useState(null);
  const [isFileTreeOpen, setIsFileTreeOpen] = useState(false);
  const [activeNodeIds, setActiveNodeIds] = useState([]);

  const findNodeById = (nodes, id) => {
    if (!nodes) return null;
    for (const node of nodes) {
      if (node.id === id) return node;
      if (node.children) {
        const found = findNodeById(node.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  const findFirstFile = (nodes) => {
    if (!nodes) return null;
    for (const node of nodes) {
      if (node.type === 'file') return node;
      if (node.children) {
        const found = findFirstFile(node.children);
        if (found) return found;
      }
    }
    return null;
  };

  useEffect(() => {
    const targetNode =
      findNodeById(activeProject.files, activeProject.selectedFileId) ||
      findFirstFile(activeProject.files);

    if (targetNode) {
      setSelectedNode(targetNode);
      setCode(targetNode.content || '');
    }
  }, [activeProjectId]);

  const updateFileContentInTree = (nodes, targetId, newContent) => {
    return nodes.map((node) => {
      if (node.id === targetId) {
        return { ...node, content: newContent };
      }
      if (node.children) {
        return {
          ...node,
          children: updateFileContentInTree(node.children, targetId, newContent),
        };
      }
      return node;
    });
  };

  const handleCodeChange = (newCode) => {
    setCode(newCode);

    if (selectedNode && selectedNode.type === 'file') {
      const updatedFiles = updateFileContentInTree(
        activeProject.files,
        selectedNode.id,
        newCode
      );

      setProjects((prev) =>
        prev.map((proj) =>
          proj.id === activeProjectId ? { ...proj, files: updatedFiles } : proj
        )
      );

      setSelectedNode((prev) => (prev ? { ...prev, content: newCode } : null));
    }
  };

  const handleSelectNode = (node) => {
    setSelectedNode(node);

    if (node.type === 'file') {
      setCode(node.content || '');

      setProjects((prev) =>
        prev.map((proj) =>
          proj.id === activeProjectId
            ? { ...proj, selectedFileId: node.id }
            : proj
        )
      );
    }
  };

  const handleToggleFolder = (folderId) => {
    const toggleInNodes = (nodes) =>
      nodes.map((node) => {
        if (node.id === folderId) {
          return { ...node, isOpen: node.isOpen === false ? true : false };
        }
        if (node.children) {
          return { ...node, children: toggleInNodes(node.children) };
        }
        return node;
      });

    setProjects((prev) =>
      prev.map((proj) =>
        proj.id === activeProjectId
          ? { ...proj, files: toggleInNodes(proj.files) }
          : proj
      )
    );
  };

  const handleCreateFolder = () => {
    const name = prompt('Nombre de la nueva carpeta:');
    if (!name) return;

    const targetFolderId = selectedNode
      ? selectedNode.type === 'folder'
        ? selectedNode.id
        : 'src'
      : 'src';

    const newFolder = {
      id: `folder_${Date.now()}`,
      name,
      type: 'folder',
      depth: selectedNode && selectedNode.type === 'folder' ? selectedNode.depth + 1 : 1,
      isOpen: true,
      children: [],
    };

    const insertNode = (nodes) =>
      nodes.map((node) => {
        if (node.id === targetFolderId) {
          return { ...node, isOpen: true, children: [...(node.children || []), newFolder] };
        }
        if (node.children) {
          return { ...node, children: insertNode(node.children) };
        }
        return node;
      });

    setProjects((prev) =>
      prev.map((proj) =>
        proj.id === activeProjectId
          ? { ...proj, files: insertNode(proj.files) }
          : proj
      )
    );
  };

  const handleCreateFile = () => {
    const name = prompt('Nombre del nuevo archivo (ej: Boton.jsx):');
    if (!name) return;

    const targetFolderId = selectedNode
      ? selectedNode.type === 'folder'
        ? selectedNode.id
        : 'src'
      : 'src';

    const newFile = {
      id: `file_${Date.now()}`,
      name,
      type: 'file',
      depth: selectedNode && selectedNode.type === 'folder' ? selectedNode.depth + 1 : 1,
      content: `// Archivo: ${name}\nexport default function Componente() {\n  return <div>${name}</div>;\n}`,
    };

    const insertNode = (nodes) =>
      nodes.map((node) => {
        if (node.id === targetFolderId) {
          return { ...node, isOpen: true, children: [...(node.children || []), newFile] };
        }
        if (node.children) {
          return { ...node, children: insertNode(node.children) };
        }
        return node;
      });

    setProjects((prev) =>
      prev.map((proj) =>
        proj.id === activeProjectId
          ? { ...proj, files: insertNode(proj.files) }
          : proj
      )
    );
  };

  const handleDeleteItem = () => {
    if (!selectedNode || selectedNode.isProtected) return;

    const deleteNode = (nodes) =>
      nodes
        .filter((node) => node.id !== selectedNode.id)
        .map((node) => {
          if (node.children) {
            return { ...node, children: deleteNode(node.children) };
          }
          return node;
        });

    const updatedFiles = deleteNode(activeProject.files);
    const firstAvailable = findFirstFile(updatedFiles);

    setProjects((prev) =>
      prev.map((proj) =>
        proj.id === activeProjectId
          ? {
              ...proj,
              files: updatedFiles,
              selectedFileId: firstAvailable ? firstAvailable.id : null,
            }
          : proj
      )
    );

    if (firstAvailable) {
      setSelectedNode(firstAvailable);
      setCode(firstAvailable.content || '');
    } else {
      setSelectedNode(null);
      setCode('');
    }
  };

  return (
    <div className="h-full w-full flex overflow-hidden">
      {/* COLUMNA IZQUIERDA */}
      <div className="w-1/2 h-full overflow-hidden relative flex flex-col pr-2 space-y-3">
        
        {/* Menu Flotante FileTree con Solapa de Pestañas */}
        <FileTree
          files={activeProject.files}
          selectedNode={selectedNode}
          onSelectNode={handleSelectNode}
          onToggleFolder={handleToggleFolder}
          onCreateFolder={handleCreateFolder}
          onDeleteFolder={handleDeleteItem}
          onCreateFile={handleCreateFile}
          onDeleteFile={handleDeleteItem}
          isOpen={isFileTreeOpen}
          onToggleOpen={() => setIsFileTreeOpen(!isFileTreeOpen)}
          projects={projects}
          activeProjectId={activeProjectId}
          onSelectProject={setActiveProjectId}
        />

        {/* Barra Superior */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl px-3 py-2 text-xs flex items-center justify-between shrink-0">
          <button
            onClick={() => setIsFileTreeOpen(!isFileTreeOpen)}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 transition-colors flex items-center gap-1.5 text-xs font-medium"
          >
            <FolderTree className="w-3.5 h-3.5 text-blue-400" />
            <span>{isFileTreeOpen ? 'Ocultar menú' : 'Abrir directorio'}</span>
          </button>
          <div className="flex items-center gap-2">
            <span className="text-slate-500 text-[11px]">[{activeProject.name}]</span>
            <span className="text-slate-400 font-mono">
              Archivo: <strong className="text-blue-400">{selectedNode?.name || 'Ninguno'}</strong>
            </span>
          </div>
        </div>

        {/* Editor de Código */}
        <div className="flex-1 overflow-y-auto no-scrollbar">
          <CodeEditor
            code={code}
            setCode={handleCodeChange}
            selectedClass={selectedClass}
            onSelectClass={setSelectedClass}
            activeNodeIds={activeNodeIds}
            onToggleNode={(id) =>
              setActiveNodeIds((prev) =>
                prev.includes(id) ? prev.filter((nodeId) => nodeId !== id) : [...prev, id]
              )
            }
            showInspector={showInspector}
          />
        </div>
      </div>

      <div className="w-[1px] bg-slate-800 my-1 mx-2 shrink-0" />

      {/* COLUMNA DERECHA */}
      <div className="w-1/2 h-full flex flex-col min-h-0">
        <PreviewPanel
          code={code}
          showInspector={showInspector}
          activeNodeIds={activeNodeIds}
        />
      </div>
    </div>
  );
}