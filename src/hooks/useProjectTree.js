// src/hooks/useProjectTree.js
import { useState, useEffect } from 'react';
import { defaultTemplateFileSystem, emptyProjectFileSystem } from '../data/Templates';
import { fetchFileContent } from '../services/githubServices'; // Importamos el servicio

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

export function useProjectTree(setCode) {
  const [projects, setProjects] = useState(INITIAL_PROJECT_INSTANCES);
  const [activeProjectId, setActiveProjectId] = useState(INITIAL_PROJECT_INSTANCES[0].id);
  const [selectedNode, setSelectedNode] = useState(null);

  const activeProject = projects.find((p) => p.id === activeProjectId) || projects[0];

  // Callback al importar un repositorio desde GitHub
  const handleGithubImportSuccess = (newProject) => {
    setProjects((prev) => [...prev, newProject]);
    setActiveProjectId(newProject.id);
  };

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
      handleSelectNode(targetNode);
    }
  }, [activeProjectId]);

  const updateFileContentInTree = (nodes, targetId, newContent) => {
    return nodes.map((node) => {
      if (node.id === targetId) return { ...node, content: newContent };
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

  // Al seleccionar un archivo (con soporte para descarga desde GitHub si aún no se descargó)
  const handleSelectNode = async (node) => {
    setSelectedNode(node);

    if (node.type === 'file') {
      // Si el archivo es de GitHub y su contenido no ha sido bajado todavía
      if (node.rawUrl && node.content === null) {
        setCode('// Cargando contenido desde GitHub...');
        try {
          const fetchedContent = await fetchFileContent(node.rawUrl);
          
          // Guardamos el contenido en el estado del proyecto
          const updatedFiles = updateFileContentInTree(
            activeProject.files,
            node.id,
            fetchedContent
          );

          setProjects((prev) =>
            prev.map((proj) =>
              proj.id === activeProjectId ? { ...proj, files: updatedFiles } : proj
            )
          );

          setSelectedNode((prev) => (prev?.id === node.id ? { ...prev, content: fetchedContent } : prev));
          setCode(fetchedContent);
        } catch (err) {
          setCode('// Error al descargar el archivo desde GitHub');
        }
      } else {
        setCode(node.content || '');
      }

      setProjects((prev) =>
        prev.map((proj) =>
          proj.id === activeProjectId ? { ...proj, selectedFileId: node.id } : proj
        )
      );
    }
  };

  const handleToggleFolder = (folderId) => {
    const toggleInNodes = (nodes) =>
      nodes.map((node) => {
        if (node.id === folderId) {
          return { ...node, isOpen: node.isOpen === false };
        }
        if (node.children) {
          return { ...node, children: toggleInNodes(node.children) };
        }
        return node;
      });

    setProjects((prev) =>
      prev.map((proj) =>
        proj.id === activeProjectId ? { ...proj, files: toggleInNodes(proj.files) } : proj
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
        proj.id === activeProjectId ? { ...proj, files: insertNode(proj.files) } : proj
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
        proj.id === activeProjectId ? { ...proj, files: insertNode(proj.files) } : proj
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
      handleSelectNode(firstAvailable);
    } else {
      setSelectedNode(null);
      setCode('');
    }
  };

  return {
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
    handleGithubImportSuccess, // Exportamos el handler
  };
}