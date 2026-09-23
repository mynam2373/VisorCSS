// src/data/initialFileSystem.js

export const initialFileSystem = [
  {
    id: 'src',
    name: 'src',
    type: 'folder',
    depth: 0,
    isOpen: true,
    isProtected: true,
    children: [
      {
        id: 'comp',
        name: 'comp',
        type: 'folder',
        depth: 1,
        isOpen: false,
        isProtected: true,
        children: [],
      },
      {
        id: 'App.jsx',
        name: 'App.jsx',
        type: 'file',
        depth: 1,
        isProtected: true,
        content: `<section className="bg-slate-950 text-slate-100 min-h-screen p-8">
  <div className="max-w-7xl mx-auto text-center space-y-4">
    <h1 className="text-4xl font-bold text-rose-100">Hola desde App.jsx</h1>
    <p className="text-slate-400">Edita este archivo desde el menú lateral.</p>
  </div>
</section>`,
      },
      {
        id: 'index.css',
        name: 'index.css',
        type: 'file',
        depth: 1,
        isProtected: true,
        content: `/* Estilos globales */\nbody {\n  margin: 0;\n}`,
      },
      {
        id: 'main.jsx',
        name: 'main.jsx',
        type: 'file',
        depth: 1,
        isProtected: true,
        content: `// Entrada principal\nimport App from './App';`,
      },
    ],
  },
];