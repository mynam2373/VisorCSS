// src/App.jsx
import { useState } from 'react';
import Header from './comp/common/Header';
import Dashboard from './views/dashboard';
import CssReaderView from './views/CssReaderView';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [code, setCode] = useState('');
  const [selectedClass, setSelectedClass] = useState(null);
  const [showInspector, setShowInspector] = useState(true);

  // Estado para controlar la apertura del modal de GitHub
  const [isGithubModalOpen, setIsGithubModalOpen] = useState(false);

  return (
    <div className="h-screen flex flex-col bg-slate-900 text-slate-100 overflow-hidden">
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        showInspector={showInspector}
        setShowInspector={setShowInspector}
        onSelectTemplate={(templateCode) => {
          setCode(templateCode);
          setSelectedClass(null);
        }}
        onOpenGithubModal={() => setIsGithubModalOpen(true)}
      />

      <main className="flex-1 overflow-hidden min-h-0 p-3">
        {activeTab === 'dashboard' && (
          <Dashboard onNavigate={setActiveTab} />
        )}

        {activeTab === 'inspector' && (
          <CssReaderView
            code={code}
            setCode={setCode}
            showInspector={showInspector}
            setShowInspector={setShowInspector}
            selectedClass={selectedClass}
            setSelectedClass={setSelectedClass}
            isGithubModalOpen={isGithubModalOpen}
            setIsGithubModalOpen={setIsGithubModalOpen}
          />
        )}
      </main>
    </div>
  );
}