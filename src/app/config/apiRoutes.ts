// src/app/config/apiRoutes.ts

export const API_BASE_URL = process.env.REACT_APP_THEME_API_URL || '' // fallback para evitar undefined
export const API_URL = process.env.ASISTENCIA_PERMISO || '' // fallback para evitar undefined

export const API_ROUTES = {
  CONTROL_PERSONAL: `${API_BASE_URL}/control-personal`,
  PERSONA: `${API_BASE_URL}/persona`,
  USUARIOS: `${API_BASE_URL}/usuarios`,
  REPORTES: `${API_BASE_URL}/reportes`,
  // Agrega aquí otros módulos según necesites
}
