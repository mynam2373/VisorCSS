// DICCIONARIOS BASE
const DIRECT_CLASSES = {
  flex: { action: 'Display', meaning: 'Activa el modelo de caja flexible (Flexbox)', css: 'display: flex;' },
  grid: { action: 'Display', meaning: 'Activa la cuadrícula (CSS Grid)', css: 'display: grid;' },
  block: { action: 'Display', meaning: 'Ocupa todo el ancho disponible (Bloque)', css: 'display: block;' },
  hidden: { action: 'Visibilidad', meaning: 'Oculta completamente el elemento', css: 'display: none;' },
  truncate: { action: 'Texto', meaning: 'Corta el texto largo con puntos suspensivos (...)', css: 'overflow: hidden; text-overflow: ellipsis;' },
};

const PROPERTIES = {
  p: 'Padding (Relleno interno)',
  m: 'Margin (Margen externo)',
  w: 'Width (Ancho)',
  h: 'Height (Alto)',
  bg: 'Background (Fondo)',
  text: 'Texto',
  border: 'Borde',
  space: 'Espaciado entre hijos',
  gap: 'Separación Flex/Grid',
  rounded: 'Borde redondeado',
};

const DIRECTIONS = {
  x: 'Eje Horizontal (Izquierda + Derecha)',
  y: 'Eje Vertical (Arriba + Abajo)',
  t: 'Superior (Top)',
  b: 'Inferior (Bottom)',
  l: 'Izquierda (Left)',
  r: 'Derecha (Right)',
};

const UNIVERSAL_VALUES = {
  full: '100% del contenedor',
  screen: '100% de la pantalla (100vw / 100vh)',
  auto: 'Calculado automáticamente por el navegador',
  fit: 'Se ajusta exactamente al contenido interno',
};

export const parseTailwindClass = (rawClass) => {
  if (!rawClass) return null;

  let className = rawClass.trim();
  let isNegative = false;

  // 1. Manejo de valores negativos (ej: -mt-4)
  if (className.startsWith('-')) {
    isNegative = true;
    className = className.substring(1);
  }

  // 2. Caso 1: Palabras clave de 1 solo componente (ej: flex, hidden)
  if (DIRECT_CLASSES[className]) {
    return {
      raw: rawClass,
      prefixMeaning: `ACCIÓN: ${DIRECT_CLASSES[className].action}`,
      axisMeaning: null,
      valueMeaning: DIRECT_CLASSES[className].meaning,
      cssEquivalent: DIRECT_CLASSES[className].css,
    };
  }

  const parts = className.split('-');

  // 3. Detectar si usa valores arbitrarios entre corchetes [ ]
  const bracketMatch = className.match(/\[(.*?)\]/);
  if (bracketMatch) {
    const customValue = bracketMatch[1];
    const property = parts[0];
    return {
      raw: rawClass,
      prefixMeaning: `ACCIÓN: ${PROPERTIES[property] || property}`,
      axisMeaning: 'VALOR PERSONALIZADO',
      valueMeaning: `Exacto: ${customValue}`,
      cssEquivalent: `${property}: ${isNegative ? '-' : ''}${customValue};`,
    };
  }

  // 4. Caso de 2 o 3 componentes (ej: p-4, bg-red-500, space-y-4, w-1/2, m-1.5)
  let prop = parts[0];
  let axis = null;
  let value = parts[1];

  // Si tiene 3 partes (ej: border-y-4)
  if (parts.length >= 3 && DIRECTIONS[parts[1]]) {
    axis = parts[1];
    value = parts.slice(2).join('-'); // Soporta nombres de color como red-500
  }

  // Traducción de valores especiales (Decimales, Fracciones, Universales)
  let translatedValue = UNIVERSAL_VALUES[value] || value;
  
  if (!isNaN(parseFloat(value))) {
    const num = parseFloat(value);
    const px = num * 4;
    const rem = num * 0.25;
    translatedValue = `${rem}rem (${px}px)`;
  } else if (value && value.includes('/')) {
    const [num, den] = value.split('/').map(Number);
    translatedValue = `${((num / den) * 100).toFixed(1)}%`;
  }

  return {
    raw: rawClass,
    prefixMeaning: `PROPIEDAD: ${PROPERTIES[prop] || prop}`,
    axisMeaning: axis ? `EJE: ${DIRECTIONS[axis]}` : 'EJE: Todos los lados',
    valueMeaning: `VALOR: ${isNegative ? '-' : ''}${translatedValue}`,
    cssEquivalent: `Procesado dinámicamente por Tailwind CSS`,
  };
};