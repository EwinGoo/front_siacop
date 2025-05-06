import { ID, Response, PaginationState } from '../../../../../../../../_metronic/helpers';

export type AsistenciaPermiso = {
  id_asistencia_permiso?: ID;
  id_persona_administrativo?: number;
  id_tipo_permiso?: number | null;
  id_usuario_generador?: number;
  id_usuario_aprobador?: number | null;
  estado_permiso?: 'GENERADO' | 'APROBADO';
  numero_documento?: string | null;
  fecha_inicio_permiso?: string | null; // Date en formato ISO
  fecha_fin_permiso?: string | null; // Date en formato ISO
  detalle_permiso?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  deleted_at?: string | null;
  nombre_generador?: string | null;
};

export type BackendResponse<T> = {
  status: number;
  error: boolean;
  message: string;
  data: T;
};


// Respuesta del Backend para AsistenciaPermiso
export type AsistenciaPermisoBackendResponse = {
  status: number;
  error: boolean;
  message: string;
  data: AsistenciaPermiso[];
  pagination?: PaginationState;
};

// Tipo específico para el endpoint de asistencias/permisos
export type AsistenciaPermisoBackendData = {
  data: AsistenciaPermiso[];
  payload?: {
    pagination?: PaginationState;
    errors?: Record<string, string[]>;
  };
};

// Respuesta del Frontend (Query)
export type AsistenciaPermisoQueryResponse = {
  data?: AsistenciaPermiso[];
  payload?: {
    message?: string;
    errors?: Record<string, string[]>;
    pagination?: PaginationState;
  };
};

export type AsistenciaTipoPermisoQueryResponseData = {
  id: number
  nombre: string
}

// Valores iniciales para un formulario de AsistenciaPermiso
export const initialAsistenciaPermiso: AsistenciaPermiso = {
  id_persona_administrativo: 0,
  id_tipo_permiso: null,
  id_usuario_generador: 0,
  id_usuario_aprobador: null,
  estado_permiso: 'GENERADO',
  numero_documento: '',
  fecha_inicio_permiso: new Date().toISOString().split('T')[0],
  fecha_fin_permiso: new Date().toISOString().split('T')[0],
  detalle_permiso: '',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  deleted_at: null,
};