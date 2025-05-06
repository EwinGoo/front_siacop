import { ID, Response, PaginationState } from '../../../../../../../../_metronic/helpers';

export type TipoPermiso = {
  id_tipo_permiso?: ID;
  nombre?: string;
  descripcion?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  deleted_at?: string | null;
};

// Respuesta del Backend para TipoPermiso
export type TipoPermisoBackendResponse = {
  status: number;
  error: boolean;
  message: string;
  data: TipoPermiso[];
  pagination?: PaginationState;
};

// Tipo genérico para respuestas del backend
export type BackendResponse<T> = {
  status: number;
  error: boolean;
  message: string;
  data: T;
};

// Tipo específico para el endpoint de tipos de permiso
export type TipoPermisoBackendData = {
  data: TipoPermiso[];
  payload?: {
    pagination?: PaginationState;
    errors?: Record<string, string[]>;
  };
};

// Respuesta del Frontend (Query)
export type TipoPermisoQueryResponse = {
  data?: TipoPermiso[];
  payload?: {
    message?: string;
    errors?: Record<string, string[]>;
    pagination?: PaginationState;
  };
};

// Valores iniciales para un formulario de TipoPermiso
export const initialTipoPermiso: TipoPermiso = {
  nombre: '',
  descripcion: '',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  deleted_at: null,
};
