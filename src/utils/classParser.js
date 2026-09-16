// src/utils/classParser.js

// Escalas estándar de Tailwind para ubicar la posición del valor actual
const VALUE_SCALES = {
  // Tamaños de Texto / Font Size
  textSize: ['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl', '7xl', '8xl', '9xl'],
  // Breakpoints / Pantallas
  screenSize: ['sm', 'md', 'lg', 'xl', '2xl'],
  // Border Radius / Redondeo
  roundedSize: ['none', 'sm', 'DEFAULT', 'md', 'lg', 'xl', '2xl', '3xl', 'full'],
  // Box Shadows / Sombras
  shadowSize: ['sm', 'DEFAULT', 'md', 'lg', 'xl', '2xl', 'inner', 'none'],
  // Spacing / Espaciado genérico por pasos
  spacingSize: ['0', '0.5', '1', '1.5', '2', '2.5', '3', '3.5', '4', '5', '6', '7', '8', '9', '10', '11', '12', '14', '16', '20', '24', '28', '32', '36', '40', '44', '48', '52', '56', '60', '64', '72', '80', '96'],
  // Max Widths
  maxWidthSize: ['0', 'none', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl', '7xl', 'full', 'min', 'max', 'fit', 'prose', 'screen-sm', 'screen-md', 'screen-lg', 'screen-xl', 'screen-2xl'],
};

// Función auxiliar para generar la cadena de escala con la posición
function getScaleString(scaleArray, currentValue) {
  const normalizedValue = currentValue === '' ? 'DEFAULT' : currentValue;
  const index = scaleArray.indexOf(normalizedValue);

  if (index === -1) return '';

  const scaleFormatted = scaleArray
    .map((item) => (item === normalizedValue ? `[${item}]` : item))
    .join(' - ');

  return ` (${scaleFormatted})`;
}

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
  m: { property: 'Margin (Margen Exterior)', axis: 'Todos los lados', scale: VALUE_SCALES.spacingSize },
  mx: { property: 'Margin Horizontal (Eje X)', axis: 'Izquierda y Derecha', scale: VALUE_SCALES.spacingSize },
  my: { property: 'Margin Vertical (Eje Y)', axis: 'Arriba y Abajo', scale: VALUE_SCALES.spacingSize },
  mt: { property: 'Margin Top (Margen Superior)', axis: 'Borde Superior', scale: VALUE_SCALES.spacingSize },
  mb: { property: 'Margin Bottom (Margen Inferior)', axis: 'Borde Inferior', scale: VALUE_SCALES.spacingSize },
  ml: { property: 'Margin Left (Margen Izquierdo)', axis: 'Borde Izquierdo', scale: VALUE_SCALES.spacingSize },
  mr: { property: 'Margin Right (Margen Derecho)', axis: 'Borde Derecho', scale: VALUE_SCALES.spacingSize },

  p: { property: 'Padding (Relleno Interior)', axis: 'Todos los lados', scale: VALUE_SCALES.spacingSize },
  px: { property: 'Padding Horizontal (Eje X)', axis: 'Izquierda y Derecha', scale: VALUE_SCALES.spacingSize },
  py: { property: 'Padding Vertical (Eje Y)', axis: 'Arriba y Abajo', scale: VALUE_SCALES.spacingSize },
  pt: { property: 'Padding Top (Relleno Superior)', axis: 'Borde Superior', scale: VALUE_SCALES.spacingSize },
  pb: { property: 'Padding Bottom (Relleno Inferior)', axis: 'Borde Inferior', scale: VALUE_SCALES.spacingSize },
  pl: { property: 'Padding Left (Relleno Izquierdo)', axis: 'Borde Izquierdo', scale: VALUE_SCALES.spacingSize },
  pr: { property: 'Padding Right (Relleno Derecho)', axis: 'Borde Derecho', scale: VALUE_SCALES.spacingSize },

  gap: { property: 'Gap (Separación)', axis: 'Entre filas y columnas', scale: VALUE_SCALES.spacingSize },
  'gap-x': { property: 'Gap Horizontal', axis: 'Entre columnas', scale: VALUE_SCALES.spacingSize },
  'gap-y': { property: 'Gap Vertical', axis: 'Entre filas', scale: VALUE_SCALES.spacingSize },

  w: { property: 'Width (Ancho)', axis: 'Eje Horizontal', scale: VALUE_SCALES.spacingSize },
  h: { property: 'Height (Alto)', axis: 'Eje Vertical', scale: VALUE_SCALES.spacingSize },
  'max-w': { property: 'Max Width (Ancho Máximo)', axis: 'Límite Horizontal', scale: VALUE_SCALES.maxWidthSize },
  'min-w': { property: 'Min Width (Ancho Mínimo)', axis: 'Límite Horizontal' },
  'max-h': { property: 'Max Height (Alto Máximo)', axis: 'Límite Vertical' },
  'min-h': { property: 'Min Height (Alto Mínimo)', axis: 'Límite Vertical' },

  bg: { property: 'Background (Fondo)', axis: 'Superficie del contenedor' },
  text: { property: 'Text (Texto / Tipografía)', axis: 'Estilo o Tamaño de letra' },
  border: { property: 'Border (Borde)', axis: 'Contorno exterior' },
  ring: { property: 'Ring (Anillo de Enfoque)', axis: 'Borde de selección' },

  font: { property: 'Font (Fuente / Grosor)', axis: 'Peso o Familia tipográfica' },
  tracking: { property: 'Tracking (Espaciado de Letras)', axis: 'Distancia entre caracteres' },
  leading: { property: 'Leading (Interlineado)', axis: 'Distancia entre renglones' },

  grid: { property: 'Grid (Rejilla)', axis: 'Distribución Bidimensional' },
  'grid-cols': { property: 'Grid Columns', axis: 'Columnas' },
  'col-span': { property: 'Column Span', axis: 'Espacio ocupado' },
  flex: { property: 'Flexbox', axis: 'Alineación de Cajas' },
  items: { property: 'Align Items', axis: 'Alineación Secundaria (Vertical)' },
  justify: { property: 'Justify Content', axis: 'Alineación Principal (Horizontal)' },

  rounded: { property: 'Border Radius (Redondeo)', axis: 'Esquinas', scale: VALUE_SCALES.roundedSize },
  shadow: { property: 'Box Shadow (Sombra)', axis: 'Elevación visual', scale: VALUE_SCALES.shadowSize },
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
      const scaleInfo = getScaleString(VALUE_SCALES.screenSize, v);
      return {
        prefix: v,
        type: info ? info.type : 'Condición',
        description: `${info ? info.description : `Condición activa bajo '${v}:'`}${scaleInfo}`,
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

  // 3. Clases Compuestas
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

  const twoWordPrefix = `${segments[0]}-${segments[1]}`;
  if (PREFIX_MAP[twoWordPrefix]) {
    prefix = twoWordPrefix;
    restSegments = segments.slice(2);
  }

  const prefixInfo = PREFIX_MAP[prefix] || {
    property: prefix.toUpperCase(),
    axis: 'General',
  };

  let fullValue = restSegments.join('-');
  let opacityInfo = '';

  if (fullValue.includes('/')) {
    const [valOnly, opacity] = fullValue.split('/');
    fullValue = valOnly;
    opacityInfo = ` (con ${opacity}% de opacidad)`;
  }

  // Si es un color de 2 partes (ej: bg-slate-950)
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

  // Detectar si la propiedad tiene una escala asignada (ej: text-4xl, max-w-7xl, p-8)
  let scaleString = '';
  if (prefix === 'text' && VALUE_SCALES.textSize.includes(fullValue)) {
    scaleString = getScaleString(VALUE_SCALES.textSize, fullValue);
  } else if (prefixInfo.scale) {
    scaleString = getScaleString(prefixInfo.scale, fullValue);
  }

  return {
    raw: rawClassStr,
    baseClass,
    variants,
    prefixMeaning: prefixInfo.property,
    axisMeaning: prefixInfo.axis,
    valueMeaning: `${fullValue}${opacityInfo}${scaleString}`,
    cssEquivalent: `Procesado dinámicamente por Tailwind CSS`,
  };
}