import { ID, PaginationState } from 'src/_metronic/helpers';

// Interfaz principal basada en tu JSON de respuesta
export type Vacacion = {
  id_vacacion_solicitado: ID
  id_asignacion_administrativo: ID
  id_persona_administrativo: ID
  numero_tramite: string | null
  fecha_vacacion_inicio: string
  fecha_vacacion_fin: string
  dias_solicitado: string | number
  dias_disponible: string | number | null
  dias_saldo: string | number | null
  fecha_solicitud: string
  tipo_solicitud: string
  estado_vacacion: 'GENERADO' | 'APROBADO' | 'RECEPCIONADO' | 'OBSERVADO'
};

// Tipo genérico para respuestas estándar del backend
export type BackendResponse<T> = {
  status: number;
  error: boolean;
  message: string;
  data: T;
};

// Estructura específica para el listado (Index) con paginación
export type VacacionBackendData = {
  data: Vacacion[];
  payload?: {
    pagination?: PaginationState;
  };
};

// Respuesta procesada para el Hook de Query (Frontend)
export type VacacionQueryResponse = {
  data?: Vacacion[];
  payload?: {
    message?: string;
    errors?: Record<string, string[]>;
    pagination?: PaginationState;
  };
};