// src/utils/storage.js

const PROJECTS_KEY = 'css_reader_projects';
const ACTIVE_PROJECT_KEY = 'css_reader_active_project_id';

// Guardar proyectos en la sesión
export const saveProjectsToStorage = (projects) => {
  try {
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
  } catch (e) {
    console.error('Error al guardar en localStorage', e);
  }
};

// Cargar proyectos de la sesión
export const loadProjectsFromStorage = () => {
  try {
    const data = localStorage.getItem(PROJECTS_KEY);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    console.error('Error al cargar de localStorage', e);
    return null;
  }
};

// Guardar ID del proyecto activo
export const saveActiveProjectId = (id) => {
  localStorage.setItem(ACTIVE_PROJECT_KEY, id);
};

// Obtener ID del proyecto activo
export const getActiveProjectId = () => {
  return localStorage.getItem(ACTIVE_PROJECT_KEY);
};