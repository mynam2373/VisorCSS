// src/utils/classParser.js

// 1. Diccionario de prefijos de variantes (Breakpoints y Estados)
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

// 2. Diccionario de Prefijos y Propiedades con explicación práctica
const PREFIX_MAP = {
  // Margen (Espacio exterior)
  m: { property: 'Margin (Margen Exterior)', axis: 'Crea espacio por fuera alrededor de los 4 lados del elemento' },
  mx: { property: 'Margin Horizontal (Eje X)', axis: 'Crea espacio por fuera solo a la izquierda y derecha (sirve para centrar con auto)' },
  my: { property: 'Margin Vertical (Eje Y)', axis: 'Crea espacio por fuera solo arriba y abajo' },
  mt: { property: 'Margin Top (Margen Superior)', axis: 'Empuja el elemento hacia abajo creando espacio arriba' },
  mb: { property: 'Margin Bottom (Margen Inferior)', axis: 'Empuja los elementos de abajo creando separación por inferior' },
  ml: { property: 'Margin Left (Margen Izquierdo)', axis: 'Empuja el elemento hacia la derecha' },
  mr: { property: 'Margin Right (Margen Derecho)', axis: 'Separa el elemento del contenido que esté a su derecha' },

  // Padding (Espacio interior)
  p: { property: 'Padding (Relleno Interior)', axis: 'Crea espacio dentro del elemento entre su borde y su contenido' },
  px: { property: 'Padding Horizontal (Eje X)', axis: 'Amplía el colchón interior a la izquierda y derecha' },
  py: { property: 'Padding Vertical (Eje Y)', axis: 'Amplía el colchón interior arriba y abajo' },
  pt: { property: 'Padding Top (Relleno Superior)', axis: 'Separa el contenido interno del borde superior' },
  pb: { property: 'Padding Bottom (Relleno Inferior)', axis: 'Separa el contenido interno del borde inferior' },
  pl: { property: 'Padding Left (Relleno Izquierdo)', axis: 'Separa el contenido interno del borde izquierdo' },
  pr: { property: 'Padding Right (Relleno Derecho)', axis: 'Separa el contenido interno del borde derecho' },

  // Distancia y Huecos
  gap: { property: 'Gap (Separación de Cajas)', axis: 'Establece una separación fija entre elementos dentro de un Flex o Grid' },
  'gap-x': { property: 'Gap Horizontal', axis: 'Separación única para las columnas' },
  'gap-y': { property: 'Gap Vertical', axis: 'Separación única para las filas' },

  // Dimensiones
  w: { property: 'Width (Ancho)', axis: 'Fija el tamaño horizontal del elemento' },
  h: { property: 'Height (Alto)', axis: 'Fija el tamaño vertical del elemento' },
  'max-w': { property: 'Max Width (Ancho Máximo)', axis: 'Impide que el elemento crezca más allá de esta medida (evita que las líneas de texto sean infinitas)' },
  'min-w': { property: 'Min Width (Ancho Mínimo)', axis: 'Asegura que el elemento nunca se reduzca más allá de esta medida' },
  'max-h': { property: 'Max Height (Alto Máximo)', axis: 'Impide que el elemento sobrepase esta altura vertical' },
  'min-h': { property: 'Min Height (Alto Mínimo)', axis: 'Garantiza una altura base mínima aunque el contenido sea poco' },

  // Colores y Apariencia
  bg: { property: 'Background (Fondo)', axis: 'Define el color o degradado de superficie del elemento' },
  text: { property: 'Text (Texto)', axis: 'Define el color de la tipografía o el tamaño de la letra' },
  border: { property: 'Border (Borde)', axis: 'Define el grosor, estilo o color del borde del contenedor' },
  ring: { property: 'Ring (Anillo exterior)', axis: 'Dibuja una línea de enfoque suave alrededor del borde (muy útil para botones e inputs)' },

  // Tipografía
  font: { property: 'Font (Fuente / Grosor)', axis: 'Define el peso visual de la letra (fina, normal, negrita) o la familia tipográfica' },
  tracking: { property: 'Tracking (Espaciado de Letras)', axis: 'Controla qué tan separadas o juntas están las letras entre sí (letter-spacing)' },
  leading: { property: 'Leading (Interlineado)', axis: 'Ajusta la distancia vertical entre renglones de texto (line-height)' },

  // Layout y Distribución
  grid: { property: 'Grid (Rejilla 2D)', axis: 'Activa un contenedor bidimensional para ordenar elementos en filas y columnas' },
  'grid-cols': { property: 'Grid Columns (Columnas)', axis: 'Divide el espacio horizontal en un número específico de columnas iguales' },
  'col-span': { property: 'Column Span (Alcance)', axis: 'Hace que una caja o tarjeta ocupe múltiples columnas de ancho' },
  flex: { property: 'Flexbox (Alineación 1D)', axis: 'Activa el modo de caja flexible para alinear elementos en fila o columna' },
  items: { property: 'Align Items (Alineación Secundaria)', axis: 'Controla el alineamiento vertical de los elementos dentro de la fila' },
  justify: { property: 'Justify Content (Alineación Principal)', axis: 'Distribuye el espacio horizontal sobrante entre los elementos' },

  // Esquinas y Sombras
  rounded: { property: 'Border Radius (Redondeo)', axis: 'Suaviza las esquinas afiladas del contenedor haciéndolas curvas' },
  shadow: { property: 'Box Shadow (Sombra)', axis: 'Añade una sombra paralela para dar la sensación de elevación o profundidad' },
  opacity: { property: 'Opacity (Opacidad)', axis: 'Ajusta el nivel de transparencia (0 es invisible, 100 es totalmente sólido)' },

  // Posición
  top: { property: 'Top (Posición Superior)', axis: 'Distancia fija desde el borde superior cuando se usa posicionamiento absoluto o relativo' },
  bottom: { property: 'Bottom (Posición Inferior)', axis: 'Distancia fija desde el borde inferior' },
  left: { property: 'Left (Posición Izquierda)', axis: 'Distancia fija desde el borde izquierdo' },
  right: { property: 'Right (Posición Derecha)', axis: 'Distancia fija desde el borde derecho' },
  z: { property: 'Z-Index (Capa / Profundidad)', axis: 'Determina qué elemento se dibuja por encima de otro cuando se superponen' },
};

// 3. Glosario de Clases Exactas
const EXACT_CLASSES = {
  flex: { property: 'Display: Flexbox', axis: 'Modo Flexible', value: 'Convierte el contenedor en una caja donde los hijos se colocan uno al lado del otro por defecto.', css: 'display: flex;' },
  'inline-flex': { property: 'Display: Inline Flex', axis: 'Flexbox en línea', value: 'Funciona como flexbox pero el contenedor solo ocupa el ancho de su contenido.', css: 'display: inline-flex;' },
  grid: { property: 'Display: Grid', axis: 'Modo Rejilla', value: 'Activa la distribución en filas y columnas.', css: 'display: grid;' },
  hidden: { property: 'Display: Hidden', axis: 'Visibilidad', value: 'Oculta completamente el elemento y libera el espacio que ocupaba en la pantalla.', css: 'display: none;' },
  block: { property: 'Display: Block', axis: 'Bloque', value: 'El elemento ocupa todo el ancho disponible y fuerza un salto de línea.', css: 'display: block;' },
  'inline-block': { property: 'Display: Inline Block', axis: 'Bloque en línea', value: 'Permite fijar ancho y alto pero se coloca al lado de otros elementos.', css: 'display: inline-block;' },

  relative: { property: 'Position: Relative', axis: 'Posicionamiento Relativo', value: 'Mantiene el elemento en su flujo normal pero sirve de referencia de origen para sus hijos absolutos.', css: 'position: relative;' },
  absolute: { property: 'Position: Absolute', axis: 'Posicionamiento Absoluto', value: 'Saca el elemento del flujo normal y lo posiciona exactamente donde le indiques respecto a su padre relativo.', css: 'position: absolute;' },
  fixed: { property: 'Position: Fixed', axis: 'Posicionamiento Fijo', value: 'Deja el elemento congelado en la pantalla aunque el usuario haga scroll.', css: 'position: fixed;' },
  sticky: { property: 'Position: Sticky', axis: 'Posicionamiento Pegajoso', value: 'Se comporta como relativo hasta que se hace scroll y llega a un límite, donde se queda pegado.', css: 'position: sticky;' },

  'min-h-screen': { property: 'Altura Mínima', axis: 'Pantalla Completa Vertical', value: 'Hace que el contenedor mida como mínimo el 100% del alto visible del navegador (100vh).', css: 'min-height: 100vh;' },
  'h-screen': { property: 'Altura Fija', axis: 'Pantalla Completa Vertical', value: 'Fija la altura exactamente al 100% de la ventana del navegador.', css: 'height: 100vh;' },
  'w-full': { property: 'Ancho Completo', axis: 'Eje Horizontal', value: 'Hace que el elemento ocupe el 100% del ancho del contenedor padre.', css: 'width: 100%;' },
  'h-full': { property: 'Alto Completo', axis: 'Eje Vertical', value: 'Hace que el elemento ocupe el 100% de la altura del contenedor padre.', css: 'height: 100%;' },
  'mx-auto': { property: 'Margen Automático', axis: 'Centrado Horizontal', value: 'Centra automáticamente un bloque asignando espacio idéntico a izquierda y derecha.', css: 'margin-left: auto; margin-right: auto;' },

  uppercase: { property: 'Transformación de Texto', axis: 'Mayúsculas', value: 'Convierte todas las letras del texto a MAYÚSCULAS.', css: 'text-transform: uppercase;' },
  lowercase: { property: 'Transformación de Texto', axis: 'Minúsculas', value: 'Convierte todas las letras del texto a minúsculas.', css: 'text-transform: lowercase;' },
  capitalize: { property: 'Transformación de Texto', axis: 'Capitalizar', value: 'Pone En Mayúscula La Primera Letra De Cada Palabra.', css: 'text-transform: capitalize;' },
  truncate: { property: 'Recorte de Texto', axis: 'Puntos Suspensivos', value: 'Si el texto no cabe en una sola línea, lo corta y añade "..." al final.', css: 'overflow: hidden; text-overflow: ellipsis; white-space: nowrap;' },
  'rounded-full': { property: 'Esquinas Redondeadas', axis: 'Forma Circular', value: 'Redondea los bordes al máximo posible, creando un círculo perfecto si la caja es cuadrada, o forma de píldora.', css: 'border-radius: 9999px;' },
};

/**
 * Función Principal para Analizar una Clase Tailwind
 */
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
        description: info ? info.description : `Filtro o condición activa bajo '${v}:'`,
      };
    });
  }

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

  const arbitraryMatch = baseClass.match(/^([a-z0-9-]+)-\[(.+)\]$/);
  if (arbitraryMatch) {
    const [, prefix, arbitraryValue] = arbitraryMatch;
    const prefixInfo = PREFIX_MAP[prefix] || { property: prefix.toUpperCase(), axis: 'Propiedad personalizada' };

    return {
      raw: rawClassStr,
      baseClass,
      variants,
      prefixMeaning: prefixInfo.property,
      axisMeaning: prefixInfo.axis,
      valueMeaning: `Aplica la medida exacta manual '${arbitraryValue}' especificada en corchetes`,
      cssEquivalent: `${prefix}: ${arbitraryValue}; (Procesado dinámicamente por Tailwind)`,
    };
  }

  const segments = baseClass.split('-');
  
  if (segments.length === 1) {
    return {
      raw: rawClassStr,
      baseClass,
      variants,
      prefixMeaning: baseClass,
      axisMeaning: 'Regla directa de estilo',
      valueMeaning: 'Aplica el valor estándar asignado por Tailwind CSS',
      cssEquivalent: `Procesado por Tailwind CSS`,
    };
  }

  let prefix = segments[0];
  let value = segments.slice(1).join('-');

  const twoWordPrefix = `${segments[0]}-${segments[1]}`;
  if (PREFIX_MAP[twoWordPrefix]) {
    prefix = twoWordPrefix;
    value = segments.slice(2).join('-');
  }

  const prefixInfo = PREFIX_MAP[prefix] || {
    property: prefix.toUpperCase(),
    axis: 'Ajuste visual general',
  };

  let opacityInfo = '';
  if (value.includes('/')) {
    const [valOnly, opacity] = value.split('/');
    value = valOnly;
    opacityInfo = ` con un ${opacity}% de opacidad (transparencia)`;
  }

  return {
    raw: rawClassStr,
    baseClass,
    variants,
    prefixMeaning: prefixInfo.property,
    axisMeaning: prefixInfo.axis,
    valueMeaning: `Nivel o escala '${value}'${opacityInfo}`,
    cssEquivalent: `Procesado dinámicamente por Tailwind CSS`,
  };
}