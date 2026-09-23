// src/comp/github/GithubImportModal.jsx
import React, { useState } from 'react';
import { Github, X, Loader2, AlertCircle } from 'lucide-react';
import { fetchGithubRepository } from '../../services/githubServices';

export default function GithubImportModal({ isOpen, onClose, onImportSuccess }) {
  const [repoUrl, setRepoUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!repoUrl.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const projectData = await fetchGithubRepository(repoUrl);
      onImportSuccess(projectData);
      setRepoUrl('');
      onClose();
    } catch (err) {
      setError(err.message || 'Ocurrió un error al importar el repositorio.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#0b101b] border border-slate-700/80 w-full max-w-md rounded-2xl shadow-2xl p-6 select-none relative">
        {/* Botón cerrar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Encabezado */}
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 bg-slate-800/80 rounded-xl border border-slate-700 text-white">
            <Github className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-100">
              Clonar repositorio de GitHub
            </h3>
            <p className="text-xs text-slate-400">
              Ingresa el enlace de un repositorio público
            </p>
          </div>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              URL del repositorio
            </label>
            <input
              type="text"
              placeholder="https://github.com/usuario/repositorio"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              disabled={loading}
              className="w-full px-3 py-2 bg-[#050810] border border-slate-700/80 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500/80 focus:ring-1 focus:ring-blue-500/80 transition-all"
            />
          </div>

          {error && (
            <div className="flex items-start gap-2 p-3 bg-rose-950/40 border border-rose-800/60 rounded-xl text-rose-300 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 rounded-xl transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || !repoUrl.trim()}
              className="flex items-center gap-2 px-4 py-2 text-xs font-medium bg-blue-600 hover:bg-blue-500 disabled:bg-blue-900/50 disabled:text-slate-500 text-white rounded-xl transition-colors shadow-lg shadow-blue-950/50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Cargando...</span>
                </>
              ) : (
                <span>Importar</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}