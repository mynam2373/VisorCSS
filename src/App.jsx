import { useState } from 'react';
import Header from './comp/Header/Header';
import CodeEditor from './comp/editor_temp/CodeEditor';
import PreviewPanel from './comp/editor_temp/PreviewPanel';
import { TEMPLATES } from './data/Templates';

export default function App() {
  const [code, setCode] = useState('');
  const [selectedClass, setSelectedClass] = useState(null);
  const [activeNodeIds, setActiveNodeIds] = useState([]);
  const [showInspector, setShowInspector] = useState(false);

  const handleToggleNode = (id) => {
    setActiveNodeIds((prev) =>
      prev.includes(id) ? prev.filter((nodeId) => nodeId !== id) : [...prev, id]
    );
  };

  return (
    <div className="h-screen flex flex-col bg-slate-900 text-slate-100 overflow-hidden">
      {/* Navbar Superior */}
      <Header
        showInspector={showInspector}
        setShowInspector={setShowInspector}
        onSelectTemplate={(templateCode) => {
          setCode(templateCode);
          setSelectedClass(null);
        }}
      />

      {/* Cuerpo Principal */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-3 p-3 overflow-hidden min-h-0">
        <CodeEditor
          code={code}
          setCode={setCode}
          selectedClass={selectedClass}
          onSelectClass={setSelectedClass}
          activeNodeIds={activeNodeIds}
          onToggleNode={handleToggleNode}
          showInspector={showInspector}
        />

      <PreviewPanel code={code} />
      </main>
    </div>
  );
}