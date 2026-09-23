// src/data/templates.js

export const TEMPLATES = [
  {
    id: 'primavera-flores',
    name: 'Flores de Primavera',
    category: 'Showcase / Landing',
    code: `<section className="bg-slate-950 text-slate-100 min-h-screen p-8">
  {/* Encabezado Principal */}
  <div className="max-w-7xl mx-auto mb-16 text-center space-y-4">
    <span className="text-emerald-400 text-xs font-semibold tracking-[0.3em] uppercase bg-emerald-950/60 px-4 py-1.5 rounded-full border border-emerald-500/30">
      Colección de Temporada 2026
    </span>
    <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-rose-100">
      El Renacer de la <span className="text-rose-400 underline decoration-pink-500/50 underline-offset-8">Primavera</span>
    </h1>
    <p className="text-slate-400 max-w-2xl mx-auto text-sm md:text-base font-light leading-relaxed">
      Explora la frescura de nuestra selección botánica artesanal. Arreglos vivos, paletas vibrantes y aromas diseñados para transformar cualquier espacio.
    </p>
  </div>

  {/* Grilla Principal de Catálogo (Asimétrica) */}
  <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
    
    {/* Tarjeta 1: Destacada */}
    <div className="md:col-span-2 bg-gradient-to-br from-rose-950/40 via-slate-900 to-slate-900 p-8 rounded-2xl border border-rose-500/20 shadow-xl flex flex-col justify-between space-y-6">
      <div className="flex justify-between items-start">
        <span className="bg-rose-500/20 text-rose-300 text-xs px-3 py-1 rounded-md border border-rose-500/30 font-mono">
          Más Vendido
        </span>
        <span className="text-2xl font-bold text-rose-200">$24.500</span>
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-slate-100">Ramo Tulipanes Silvestres & Peonías</h2>
        <p className="text-slate-400 text-xs leading-relaxed">
          Combinación armónica de tonos fucsia, coral y crema. Cosechados al amanecer para garantizar la máxima durabilidad del pétalo.
        </p>
      </div>
      <div className="flex flex-wrap gap-2 pt-2">
        <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-1 rounded border border-slate-700">Edición Limitada</span>
        <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-1 rounded border border-slate-700">Aroma Intenso</span>
        <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-1 rounded border border-slate-700">Incluye Florero</span>
      </div>
      <button className="w-full bg-rose-600 hover:bg-rose-500 text-white font-medium py-2.5 rounded-lg transition-colors text-xs tracking-wider uppercase">
        Reservar Ramo
      </button>
    </div>

    {/* Tarjeta 2 */}
    <div className="bg-slate-900 p-6 rounded-2xl border border-amber-500/20 flex flex-col justify-between space-y-6">
      <div className="space-y-3">
        <div className="w-10 h-10 bg-amber-500/10 rounded-lg border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold">
          🌻
        </div>
        <h3 className="text-lg font-bold text-slate-100">Girasoles & Mimosas</h3>
        <p className="text-slate-400 text-xs leading-relaxed">
          Energía pura en tonos amarillos cálidos. Ideal para iluminar escritorios y espacios de trabajo.
        </p>
      </div>
      <div className="border-t border-slate-800 pt-4 flex items-center justify-between">
        <span className="text-lg font-bold text-amber-400">$18.200</span>
        <button className="bg-slate-800 hover:bg-amber-500/20 text-amber-300 text-xs px-3 py-1.5 rounded border border-amber-500/30 transition-colors">
          Ver Detalle
        </button>
      </div>
    </div>

  </div>

  {/* Panel de Características (3 Columnas con Border Top) */}
  <div className="max-w-7xl mx-auto border-t border-slate-800 pt-16 grid grid-cols-1 md:grid-cols-3 gap-12">
    <div className="space-y-3 p-4 bg-slate-900/40 rounded-xl border border-slate-800/80">
      <div className="text-emerald-400 font-mono text-xs tracking-widest uppercase font-semibold">01. Cultivo Local</div>
      <h4 className="text-base font-bold text-slate-200">Campos Sustentables</h4>
      <p className="text-slate-400 text-xs leading-relaxed">
        Nuestras flores crecen libres de pesticidas agresivos, respetando los ciclos naturales de la tierra.
      </p>
    </div>

    <div className="space-y-3 p-4 bg-slate-900/40 rounded-xl border border-slate-800/80">
      <div className="text-pink-400 font-mono text-xs tracking-widest uppercase font-semibold">02. Envíos Express</div>
      <h4 className="text-base font-bold text-slate-200">Logística Refrigerada</h4>
      <p className="text-slate-400 text-xs leading-relaxed">
        Entregas en vehículos acondicionados para que cada botón abra directamente en tu mesa.
      </p>
    </div>

    <div className="space-y-3 p-4 bg-slate-900/40 rounded-xl border border-slate-800/80">
      <div className="text-cyan-400 font-mono text-xs tracking-widest uppercase font-semibold">03. Garantía Viva</div>
      <h4 className="text-base font-bold text-slate-200">10 Días Frescura</h4>
      <p className="text-slate-400 text-xs leading-relaxed">
        Si tus flores pierden vitalidad antes del décimo día, reemplazamos el arreglo sin costo adicional.
      </p>
    </div>
  </div>
</section>`,
  },
];

// Árbol de carpetas y archivos creado dinámicamente desde el template de Primavera
export const defaultTemplateFileSystem = [
  {
    id: 'src',
    name: 'src',
    type: 'folder',
    depth: 0,
    isOpen: true,
    isProtected: true,
    children: [
      {
        id: 'components',
        name: 'components',
        type: 'folder',
        depth: 1,
        isOpen: true,
        children: [
          {
            id: 'HeroHeader.jsx',
            name: 'HeroHeader.jsx',
            type: 'file',
            depth: 2,
            content: `{/* Encabezado Principal */}
<div className="max-w-7xl mx-auto mb-16 text-center space-y-4">
  <span className="text-emerald-400 text-xs font-semibold tracking-[0.3em] uppercase bg-emerald-950/60 px-4 py-1.5 rounded-full border border-emerald-500/30">
    Colección de Temporada 2026
  </span>
  <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-rose-100">
    El Renacer de la <span className="text-rose-400 underline decoration-pink-500/50 underline-offset-8">Primavera</span>
  </h1>
  <p className="text-slate-400 max-w-2xl mx-auto text-sm md:text-base font-light leading-relaxed">
    Explora la frescura de nuestra selección botánica artesanal. Arreglos vivos, paletas vibrantes y aromas diseñados para transformar cualquier espacio.
  </p>
</div>`,
          },
          {
            id: 'ProductCard.jsx',
            name: 'ProductCard.jsx',
            type: 'file',
            depth: 2,
            content: `{/* Tarjeta de Producto */}
<div className="bg-slate-900 p-6 rounded-2xl border border-amber-500/20 flex flex-col justify-between space-y-6">
  <div className="space-y-3">
    <div className="w-10 h-10 bg-amber-500/10 rounded-lg border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold">
      🌻
    </div>
    <h3 className="text-lg font-bold text-slate-100">Girasoles & Mimosas</h3>
    <p className="text-slate-400 text-xs leading-relaxed">
      Energía pura en tonos amarillos cálidos. Ideal para iluminar escritorios y espacios de trabajo.
    </p>
  </div>
  <div className="border-t border-slate-800 pt-4 flex items-center justify-between">
    <span className="text-lg font-bold text-amber-400">$18.200</span>
    <button className="bg-slate-800 hover:bg-amber-500/20 text-amber-300 text-xs px-3 py-1.5 rounded border border-amber-500/30 transition-colors">
      Ver Detalle
    </button>
  </div>
</div>`,
          },
        ],
      },
      {
        id: 'styles',
        name: 'styles',
        type: 'folder',
        depth: 1,
        isOpen: false,
        children: [
          {
            id: 'theme.css',
            name: 'theme.css',
            type: 'file',
            depth: 2,
            content: `/* Paleta de colores de la plantilla Primavera */\n:root {\n  --primary-rose: #fb7185;\n  --bg-dark: #020617;\n}`,
          },
        ],
      },
      {
        id: 'App.jsx',
        name: 'App.jsx',
        type: 'file',
        depth: 1,
        isProtected: true,
        content: TEMPLATES[0].code,
      },
    ],
  },
];

export const emptyProjectFileSystem = [
  {
    id: 'src',
    name: 'src',
    type: 'folder',
    depth: 0,
    isOpen: true,
    isProtected: true,
    children: [
      {
        id: 'App.jsx',
        name: 'App.jsx',
        type: 'file',
        depth: 1,
        isProtected: true,
        content: `// Proyecto Limpio\nexport default function App() {\n  return <div className="p-8 text-slate-200">Comienza a escribir código aquí...</div>;\n}`,
      },
    ],
  },
];