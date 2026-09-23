// src/services/githubService.js

/**
 * Parsea una URL de GitHub para extraer usuario, repositorio y rama/branch.
 * Ejemplos soportados:
 *  - https://github.com/facebook/react
 *  - https://github.com/facebook/react/tree/main
 */
export function parseGithubUrl(url) {
  try {
    const cleanUrl = url.trim().replace(/\/$/, '');
    const match = cleanUrl.match(/github\.com\/([^/]+)\/([^/]+)(?:\/tree\/([^/]+))?/);

    if (!match) return null;

    return {
      owner: match[1],
      repo: match[2].replace(/\.git$/, ''),
      branch: match[3] || 'main',
    };
  } catch {
    return null;
  }
}

/**
 * Convierte la lista plana de la Git Trees API de GitHub
 * en un árbol anidado compatible con nuestro FileTree.
 */
function buildTreeFromFlatList(flatList, owner, repo, branch) {
  const root = [];
  const map = {};

  // Primero creamos referencias de mapa para cada elemento
  flatList.forEach((item) => {
    const pathParts = item.path.split('/');
    const name = pathParts[pathParts.length - 1];
    const isFolder = item.type === 'tree';

    // Generamos URL para obtener el contenido raw si es un archivo
    const rawUrl = isFolder
      ? null
      : `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${item.path}`;

    map[item.path] = {
      id: item.path,
      name: name,
      type: isFolder ? 'folder' : 'file',
      depth: pathParts.length,
      isOpen: false,
      children: isFolder ? [] : undefined,
      content: isFolder ? undefined : null, // Se cargará dinámicamente al seleccionarlo
      rawUrl: rawUrl,
      isProtected: true,
    };
  });

  // Anidamos los nodos en sus padres correspondientes
  flatList.forEach((item) => {
    const pathParts = item.path.split('/');
    const node = map[item.path];

    if (pathParts.length === 1) {
      root.push(node);
    } else {
      const parentPath = pathParts.slice(0, -1).join('/');
      if (map[parentPath] && map[parentPath].children) {
        map[parentPath].children.push(node);
      } else {
        root.push(node);
      }
    }
  });

  return root;
}

/**
 * Obtiene la estructura completa de un repositorio público de GitHub en 1 sola petición.
 */
export async function fetchGithubRepository(url) {
  const parsed = parseGithubUrl(url);

  if (!parsed) {
    throw new Error('La URL ingresada no es una URL válida de GitHub.');
  }

  const { owner, repo, branch } = parsed;

  // Intentamos primero con la rama especificada (o 'main')
  let treeResponse = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`
  );

  // Si da 404, probamos fallback a la rama 'master'
  if (!treeResponse.ok && branch === 'main') {
    treeResponse = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/git/trees/master?recursive=1`
    );
  }

  if (!treeResponse.ok) {
    if (treeResponse.status === 404) {
      throw new Error(
        'Repositorio no encontrado o es privado. Asegúrate de que la URL sea pública.'
      );
    }
    if (treeResponse.status === 403) {
      throw new Error(
        'Límite de peticiones de GitHub alcanzado. Intenta de nuevo en unos minutos.'
      );
    }
    throw new Error(`Error al conectar con GitHub (${treeResponse.status})`);
  }

  const data = await treeResponse.json();

  if (!data.tree || data.tree.length === 0) {
    throw new Error('El repositorio está vacío.');
  }

  const filesTree = buildTreeFromFlatList(data.tree, owner, repo, branch);

  return {
    id: `gh_${owner}_${repo}`,
    name: `${repo} (GitHub)`,
    owner,
    repo,
    branch,
    files: filesTree,
  };
}

/**
 * Carga el contenido en texto plano de un archivo específico desde GitHub raw.
 */
export async function fetchFileContent(rawUrl) {
  const res = await fetch(rawUrl);
  if (!res.ok) {
    throw new Error('No se pudo cargar el contenido del archivo.');
  }
  return await res.text();
}