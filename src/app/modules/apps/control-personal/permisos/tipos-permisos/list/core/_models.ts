import { ID, Response, PaginationState } from '../../../../../../../../_metronic/helpers';

export type TipoPermiso = {
  id_tipo_permiso?: ID;
  nombre: string;
  descripcion?: string | null;
  tipo_permiso?: 'COMISION' | 'PERMISO';  // Nuevo campo enum
  // requiere_hoja_ruta?: boolean | '0' | '1';  // Nuevo campo (puede ser boolean o string)
  instruccion?: string | null;  // Nuevo campo
  limite_dias: number | null;  // Nuevo campo
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
  tipo_permiso: 'PERMISO', // Valor por defecto
  // requiere_hoja_ruta: false, // O '1' si prefieres mantener el formato string
  instruccion: '',
  limite_dias: null,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  deleted_at: null,
};

export interface TipoPermisoPayload extends Omit<TipoPermiso, 'requiere_hoja_ruta'> {
  requiere_hoja_ruta: '0' | '1'; // Forzamos el tipo específico para el payload
}

