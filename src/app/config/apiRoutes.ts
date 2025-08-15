// src/app/config/apiRoutes.ts

export const API_BASE_URL = process.env.REACT_APP_API_URL || '' // fallback para evitar undefined
export const API_URL = process.env.ASISTENCIA_PERMISO || '' // fallback para evitar undefined

export const API_ROUTES = {
  CONTROL_PERSONAL: `${API_BASE_URL}/api/control-personal`,
  PERSONA: `${API_BASE_URL}/api/persona`,
  USUARIOS: `${API_BASE_URL}/api/usuarios`,
  REPORTES: {
    PERSONAL: {
      FORMULARIO: (hash: string) => `${API_BASE_URL}/reporte/comision/${hash}`,
      GENERAL: `${API_BASE_URL}/reporte/comision/reporte-general`,
      // Agrega más rutas aquí si es necesario
    },
    PERMISO: {
      FORMULARIO: (hash: string) => `${API_BASE_URL}/reporte/permiso/${hash}`,
      GENERAL: `${API_BASE_URL}/reporte/permiso/reporte-general`,
    },
    DECLARATORIA_COMISION: {
      FORMULARIO: (hash: string) => `${API_BASE_URL}/reporte/declaratoria-comision/${hash}`,
    },
    // Otros grupos de reportes si tienes más
  },
}
