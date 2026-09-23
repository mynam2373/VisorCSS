// src/components/TemplateSelector.jsx
import { useState, useRef, useEffect } from 'react';
import { TEMPLATES } from '../../data/Templates';

export function TemplateSelector({ onSelectTemplate }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  // Cerrar el menú desplegable si se hace clic afuera
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (templateCode) => {
    onSelectTemplate(templateCode);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium px-3 py-2 rounded-lg border border-slate-700 transition-colors"
      >
        <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
        </svg>
        <span>Plantillas</span>
        <svg className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl z-50 overflow-hidden">
          <div className="px-3 py-2 border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Plantillas Disponibles
          </div>
          <div className="py-1 max-h-60 overflow-y-auto">
            {TEMPLATES.map((tmpl) => (
              <button
                key={tmpl.id}
                onClick={() => handleSelect(tmpl.code)}
                className="w-full text-left px-3 py-2.5 hover:bg-slate-800 transition-colors flex flex-col gap-0.5 group"
              >
                <span className="text-xs font-medium text-slate-200 group-hover:text-emerald-400">
                  {tmpl.name}
                </span>
                <span className="text-[10px] text-slate-500">
                  {tmpl.category}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
export default TemplateSelector;