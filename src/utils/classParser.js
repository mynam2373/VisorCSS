// src/utils/classParser.js

const VARIANT_MAP = {
  sm: { type: 'Pantalla Pequeña', description: 'Dispositivos móviles grandes o tablets en vertical (desde 640px)' },
  md: { type: 'Pantalla Mediana', description: 'Tablets horizontales y laptops pequeñas (desde 768px)' },
  lg: { type: 'Pantalla Grande', description: 'Monitores de escritorio y laptops estándar (desde 1024px)' },
  xl: { type: 'Pantalla Extra Grande', description: 'Monitores de alta resolución (desde 1280px)' },
  '2xl': { type: 'Pantalla Gigante', description: 'Monitores ultra anchos o TVs (desde 1536px)' },
  
  hover: { type: 'Interacción', description: 'Aplica el estilo solo cuando el usuario pasa el puntero por encima' },
  focus: { type: 'Interacción', description: 'Aplica cuando el elemento es seleccionado (al hacer clic o usar Tab)' },
  active: { type: 'Interacción', description: 'Aplica mientras el usuario mantiene presionado el botón del mouse' },
  'focus-within': { type: 'Interacción', description: 'Aplica si el elemento o cualquiera de sus hijos está enfocado' },
  'group-hover': { type: 'Interacción', description: 'Aplica cuando el elemento padre (marcado como .group) recibe hover' },
  dark: { type: 'Tema', description: 'Aplica únicamente cuando la interfaz del usuario está en Modo Oscuro' },
};

const PREFIX_MAP = {
  // Margen (Espacio exterior)
  m: { property: 'Margin (Margen Exterior)', axis: 'Todos los lados' },
  mx: { property: 'Margin Horizontal (Eje X)', axis: 'Izquierda y Derecha' },
  my: { property: 'Margin Vertical (Eje Y)', axis: 'Arriba y Abajo' },
  mt: { property: 'Margin Top (Margen Superior)', axis: 'Borde Superior' },
  mb: { property: 'Margin Bottom (Margen Inferior)', axis: 'Borde Inferior' },
  ml: { property: 'Margin Left (Margen Izquierdo)', axis: 'Borde Izquierdo' },
  mr: { property: 'Margin Right (Margen Derecho)', axis: 'Borde Derecho' },

  // Padding (Espacio interior)
  p: { property: 'Padding (Relleno Interior)', axis: 'Todos los lados' },
  px: { property: 'Padding Horizontal (Eje X)', axis: 'Izquierda y Derecha' },
  py: { property: 'Padding Vertical (Eje Y)', axis: 'Arriba y Abajo' },
  pt: { property: 'Padding Top (Relleno Superior)', axis: 'Borde Superior' },
  pb: { property: 'Padding Bottom (Relleno Inferior)', axis: 'Borde Inferior' },
  pl: { property: 'Padding Left (Relleno Izquierdo)', axis: 'Borde Izquierdo' },
  pr: { property: 'Padding Right (Relleno Derecho)', axis: 'Borde Derecho' },

  // Distancia y Huecos
  gap: { property: 'Gap (Separación)', axis: 'Entre filas y columnas' },
  'gap-x': { property: 'Gap Horizontal', axis: 'Entre columnas' },
  'gap-y': { property: 'Gap Vertical', axis: 'Entre filas' },

  // Dimensiones
  w: { property: 'Width (Ancho)', axis: 'Eje Horizontal' },
  h: { property: 'Height (Alto)', axis: 'Eje Vertical' },
  'max-w': { property: 'Max Width (Ancho Máximo)', axis: 'Límite Horizontal' },
  'min-w': { property: 'Min Width (Ancho Mínimo)', axis: 'Límite Horizontal' },
  'max-h': { property: 'Max Height (Alto Máximo)', axis: 'Límite Vertical' },
  'min-h': { property: 'Min Height (Alto Mínimo)', axis: 'Límite Vertical' },

  // Colores
  bg: { property: 'Background (Fondo)', axis: 'Superficie del contenedor' },
  text: { property: 'Text (Texto / Tipografía)', axis: 'Estilo de letra' },
  border: { property: 'Border (Borde)', axis: 'Contorno exterior' },
  ring: { property: 'Ring (Anillo de Enfoque)', axis: 'Borde de selección' },

  // Tipografía
  font: { property: 'Font (Fuente / Grosor)', axis: 'Peso o Familia tipográfica' },
  tracking: { property: 'Tracking (Espaciado de Letras)', axis: 'Distancia entre caracteres' },
  leading: { property: 'Leading (Interlineado)', axis: 'Distancia entre renglones' },

  // Layout
  grid: { property: 'Grid (Rejilla)', axis: 'Distribución Bidimensional' },
  'grid-cols': { property: 'Grid Columns', axis: 'Columnas' },
  'col-span': { property: 'Column Span', axis: 'Espacio ocupado' },
  flex: { property: 'Flexbox', axis: 'Alineación de Cajas' },
  items: { property: 'Align Items', axis: 'Alineación Secundaria (Vertical)' },
  justify: { property: 'Justify Content', axis: 'Alineación Principal (Horizontal)' },

  // Esquinas y Sombras
  rounded: { property: 'Border Radius (Redondeo)', axis: 'Esquinas' },
  shadow: { property: 'Box Shadow (Sombra)', axis: 'Elevación visual' },
  opacity: { property: 'Opacity (Opacidad)', axis: 'Nivel de transparencia' },
};

const EXACT_CLASSES = {
  flex: { property: 'Display: Flexbox', axis: 'Caja Flexible', value: 'Alinea elementos en fila o columna', css: 'display: flex;' },
  'inline-flex': { property: 'Display: Inline Flex', axis: 'Caja Flexible en Línea', value: 'Flexbox ajustado al ancho del contenido', css: 'display: inline-flex;' },
  grid: { property: 'Display: Grid', axis: 'Rejilla 2D', value: 'Distribuye en filas y columnas', css: 'display: grid;' },
  hidden: { property: 'Display: Hidden', axis: 'Visibilidad', value: 'Oculta el elemento del DOM', css: 'display: none;' },
  block: { property: 'Display: Block', axis: 'Bloque', value: 'Ocupa todo el ancho disponible', css: 'display: block;' },
  
  relative: { property: 'Position: Relative', axis: 'Posicionamiento', value: 'Punto de referencia para hijos absolutos', css: 'position: relative;' },
  absolute: { property: 'Position: Absolute', axis: 'Posicionamiento', value: 'Ubicación libre respecto al padre relativo', css: 'position: absolute;' },
  fixed: { property: 'Position: Fixed', axis: 'Posicionamiento', value: 'Fijo en la pantalla durante el scroll', css: 'position: fixed;' },

  'min-h-screen': { property: 'Min Height', axis: 'Límite Vertical', value: 'Mínimo el 100% del alto de la ventana (100vh)', css: 'min-height: 100vh;' },
  'h-screen': { property: 'Height', axis: 'Límite Vertical', value: 'Exactamente el 100% del alto de la ventana (100vh)', css: 'height: 100vh;' },
  'w-full': { property: 'Width', axis: 'Eje Horizontal', value: '100% del contenedor padre', css: 'width: 100%;' },
  'h-full': { property: 'Height', axis: 'Eje Vertical', value: '100% del contenedor padre', css: 'height: 100%;' },
  'mx-auto': { property: 'Margin Horizontal', axis: 'Eje X', value: 'Centrado automático', css: 'margin-left: auto; margin-right: auto;' },

  uppercase: { property: 'Text Transform', axis: 'Tipografía', value: 'MAYÚSCULAS', css: 'text-transform: uppercase;' },
  lowercase: { property: 'Text Transform', axis: 'Tipografía', value: 'minúsculas', css: 'text-transform: lowercase;' },
  capitalize: { property: 'Text Transform', axis: 'Tipografía', value: 'Primera Letra Mayúscula', css: 'text-transform: capitalize;' },
  'rounded-full': { property: 'Border Radius', axis: 'Esquinas', value: 'Círculo / Píldora (9999px)', css: 'border-radius: 9999px;' },
};

export function parseTailwindClass(rawClassStr) {
  if (!rawClassStr || typeof rawClassStr !== 'string') return null;

  const parts = rawClassStr.trim().split(':');
  let variants = [];
  let baseClass = rawClassStr;

  if (parts.length > 1) {
    baseClass = parts.pop();
    variants = parts.map((v) => {
      const info = VARIANT_MAP[v];
      return {
        prefix: v,
        type: info ? info.type : 'Condición',
        description: info ? info.description : `Condición activa bajo '${v}:'`,
      };
    });
  }

  // 1. Clases Exactas
  if (EXACT_CLASSES[baseClass]) {
    const item = EXACT_CLASSES[baseClass];
    return {
      raw: rawClassStr,
      baseClass,
      variants,
      prefixMeaning: item.property,
      axisMeaning: item.axis,
      valueMeaning: item.value,
      cssEquivalent: item.css,
    };
  }

  // 2. Valores Arbitrarios [...]
  const arbitraryMatch = baseClass.match(/^([a-z0-9-]+)-\[(.+)\]$/);
  if (arbitraryMatch) {
    const [, prefix, arbitraryValue] = arbitraryMatch;
    const prefixInfo = PREFIX_MAP[prefix] || { property: prefix.toUpperCase(), axis: 'Personalizado' };

    return {
      raw: rawClassStr,
      baseClass,
      variants,
      prefixMeaning: prefixInfo.property,
      axisMeaning: prefixInfo.axis,
      valueMeaning: `Medida exacta [${arbitraryValue}]`,
      cssEquivalent: `${prefix}: ${arbitraryValue};`,
    };
  }

  // 3. Clases Compuestas (Ej: bg-slate-950, max-w-7xl, text-slate-100/80)
  const segments = baseClass.split('-');
  
  if (segments.length === 1) {
    return {
      raw: rawClassStr,
      baseClass,
      variants,
      prefixMeaning: baseClass,
      axisMeaning: 'Ajuste directo',
      valueMeaning: 'Estándar',
      cssEquivalent: `Procesado por Tailwind CSS`,
    };
  }

  let prefix = segments[0];
  let restSegments = segments.slice(1);

  // Prefijos de dos palabras (max-w, grid-cols, min-h, etc.)
  const twoWordPrefix = `${segments[0]}-${segments[1]}`;
  if (PREFIX_MAP[twoWordPrefix]) {
    prefix = twoWordPrefix;
    restSegments = segments.slice(2);
  }

  const prefixInfo = PREFIX_MAP[prefix] || {
    property: prefix.toUpperCase(),
    axis: 'General',
  };

  // Manejar el Valor Completo (ej: slate-950, 7xl, emerald-950/60)
  let fullValue = restSegments.join('-');
  let opacityInfo = '';

  if (fullValue.includes('/')) {
    const [valOnly, opacity] = fullValue.split('/');
    fullValue = valOnly;
    opacityInfo = ` (con ${opacity}% de opacidad)`;
  }

  // Si son 2 o más sub-elementos en el valor (ej: "slate-950" -> color: Slate, tono: 950)
  if (restSegments.length >= 2 && ['bg', 'text', 'border', 'ring'].includes(prefix)) {
    const colorName = restSegments[0];
    const colorShade = restSegments.slice(1).join('-');
    
    return {
      raw: rawClassStr,
      baseClass,
      variants,
      prefixMeaning: prefixInfo.property,
      axisMeaning: `${prefixInfo.axis} (Color: ${colorName.toUpperCase()})`,
      valueMeaning: `Tono/Intensidad ${colorShade}${opacityInfo}`,
      cssEquivalent: `Procesado dinámicamente por Tailwind CSS`,
    };
  }

  return {
    raw: rawClassStr,
    baseClass,
    variants,
    prefixMeaning: prefixInfo.property,
    axisMeaning: prefixInfo.axis,
    valueMeaning: `${fullValue}${opacityInfo}`,
    cssEquivalent: `Procesado dinámicamente por Tailwind CSS`,
  };
}