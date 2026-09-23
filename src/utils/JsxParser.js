export const BORDER_COLORS = [
  '#3b82f6', // blue-500
  '#10b981', // emerald-500
  '#f59e0b', // amber-500
  '#8b5cf6', // purple-500
  '#f43f5e', // rose-500
  '#06b6d4', // cyan-500
  '#ec4899', // pink-500
  '#84cc16', // lime-500
];

export function parseJSXToHTML(code, showInspector, activeNodeIds = []) {
  if (!code) return '';

  let html = code;

  // Limpiar export/import o envoltorios React
  html = html.replace(/export\s+default\s+function\s+\w+\s*\(\)\s*\{/g, '');
  html = html.replace(/export\s+function\s+\w+\s*\(\)\s*\{/g, '');
  html = html.replace(/return\s*\(/g, '');
  html = html.replace(/\);\s*\}\s*$/g, '');
  html = html.replace(/\{\/\*[\s\S]*?\*\/\}/g, ''); // Remover comentarios JSX

  let nodeIndex = 0;

  // Reemplazar tags con atributo inspector-id y bordes según visibilidad
  html = html.replace(/<([a-zA-Z0-9]+)([^>]*)/g, (match, tagName, rest) => {
    // Si es una etiqueta de cierre o autosostenida sin atributos principales, continuar
    if (tagName.startsWith('/') || tagName === 'script' || tagName === 'style') {
      return match;
    }

    const currentId = nodeIndex;
    nodeIndex++;

    const color = BORDER_COLORS[currentId % BORDER_COLORS.length];
    const isNodeVisible = showInspector || activeNodeIds.includes(currentId);

    const outlineStyle = isNodeVisible 
      ? `outline: 2px dashed ${color}; outline-offset: -2px;` 
      : '';

    if (rest.includes('className="')) {
      return `<${tagName} style="${outlineStyle}" data-inspector-id="${currentId}" ${rest}`;
    } else {
      return `<${tagName} style="${outlineStyle}" data-inspector-id="${currentId}" className="" ${rest}`;
    }
  });

  // Reemplazar className={...} por class="..."
  html = html.replace(/className="([^"]*)"/g, 'class="$1"');

  return html;
}

// Helper para extraer la lista estructurada de nodos del código JSX
export function extractNodesFromJSX(code) {
  if (!code) return [];

  // Limpiar comentarios JSX
  const cleanCode = code.replace(/\{\/\*[\s\S]*?\*\/\}/g, '');
  const matches = [...cleanCode.matchAll(/<([a-zA-Z0-9]+)([^>]*class(?:Name)?="([^"]+)")?/g)];

  const nodes = [];
  let id = 0;

  for (const match of matches) {
    const tagName = match[1];
    if (tagName.startsWith('/')) continue;

    const classString = match[3] || '';
    const classes = classString.split(/\s+/).filter(Boolean);

    nodes.push({
      id: id,
      tagName: tagName,
      label: `${tagName} #${id + 1}`,
      classes: classes,
      color: BORDER_COLORS[id % BORDER_COLORS.length],
    });

    id++;
  }

  return nodes;
}