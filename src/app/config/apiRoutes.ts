// src/app/config/apiRoutes.ts

export const API_BASE_URL = process.env.REACT_APP_API_URL || '' // fallback para evitar undefined
export const API_URL = process.env.ASISTENCIA_PERMISO || '' // fallback para evitar undefined

export const API_ROUTES = {
  ADMINISTRADOR: `${API_BASE_URL}/administrador`,
  CONTROL_PERSONAL: `${API_BASE_URL}/control-personal`,
  PLANILLAS: `${API_BASE_URL}/planillas`,
  PLANILLA_DOCENTE: `${API_BASE_URL}/planilla-docente`,
  PLANILLA_ESTUDIANTE: `${API_BASE_URL}/planilla-estudiante`,
  ASIGNACION_ADMINISTRATIVO: `${API_BASE_URL}/control-personal/asignacion-administrativo`,
  GUARDIAS: `${API_BASE_URL}/control-personal/guardias-seguridad`,
  PLANILLA_ASISTENCIA: `${API_BASE_URL}/control-personal/planilla-asistencia`,
  PERSONA: `${API_BASE_URL}/persona`,
  USUARIOS: `${API_BASE_URL}/usuarios`,
  HORARIO_TIPOS: `${API_BASE_URL}/control-personal/horario-tipos`,
  HORARIO_ALTERNOS: `${API_BASE_URL}/control-personal/horario-alternos`,
  HORARIOS: `${API_BASE_URL}/control-personal/horarios`,
  REPORTES: {
    PERSONAL: {
      FORMULARIO: (hash: string) =>
        `${API_BASE_URL}/control-personal/boletas-comision/reporte/${hash}`,
      GENERAL: `${API_BASE_URL}/control-personal/boletas-comision/reporte-general`,
      // Agrega más rutas aquí si es necesario
    },
    PERMISO: {
      FORMULARIO: (hash: string) => `${API_BASE_URL}/reporte/permiso/${hash}`,
      GENERAL: `${API_BASE_URL}/reporte/permiso/reporte-general`,
    },
    DECLARATORIA_COMISION: {
      FORMULARIO: (hash: string) => `${API_BASE_URL}/reporte/declaratoria-comision/${hash}`,
    },
    VACACION: {
      GENERAL: `${API_BASE_URL}/control-personal/vacacion/reporte-general`,
    },
  },
}
