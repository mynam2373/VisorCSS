// src/views/CssReaderView.jsx
import { useState } from 'react';
import FileTree from '../comp/explorer/filetree';
import CodeEditor from '../comp/editor_temp/CodeEditor';
import PreviewPanel from '../comp/editor_temp/PreviewPanel';
import EditorTopBar from '../comp/editor_temp/editorTopBar';
import GithubImportModal from '../comp/github/GithubImportModal'; // Modal
import { useProjectTree } from '../hooks/useProjectTree';

export default function CssReaderView({
  code,
  setCode,
  showInspector,
  selectedClass,
  setSelectedClass,
  isGithubModalOpen,
  setIsGithubModalOpen,
}) {
  const [isFileTreeOpen, setIsFileTreeOpen] = useState(false);
  const [activeNodeIds, setActiveNodeIds] = useState([]);

  const {
    projects,
    activeProject,
    activeProjectId,
    setActiveProjectId,
    selectedNode,
    handleCodeChange,
    handleSelectNode,
    handleToggleFolder,
    handleCreateFolder,
    handleCreateFile,
    handleDeleteItem,
    handleGithubImportSuccess,
  } = useProjectTree(setCode);

  return (
    <div className="h-full w-full flex overflow-hidden">
      {/* COLUMNA IZQUIERDA */}
      <div className="w-1/2 h-full overflow-hidden relative flex flex-col pr-2 space-y-3">
        {/* Menu Flotante FileTree */}
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
        <EditorTopBar
          isFileTreeOpen={isFileTreeOpen}
          setIsFileTreeOpen={setIsFileTreeOpen}
          activeProjectName={activeProject.name}
          selectedFileName={selectedNode?.name}
        />

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

      {/* Modal de Importación de GitHub */}
      <GithubImportModal
        isOpen={isGithubModalOpen}
        onClose={() => setIsGithubModalOpen(false)}
        onImportSuccess={handleGithubImportSuccess}
      />
    </div>
  );
}