import {ID, Response, PaginationState} from '../../../../../../../_metronic/helpers'

export type Comision = {
  id_comision?: ID | undefined
  id_asignacion_administrativo?: number
  id_usuario_generador?: number
  id_usuario_aprobador?: number | null
  fecha_comision?: string | null // DATE -> string (ISO)
  hora_salida?: string | null // TIME -> string (HH:MM:SS)
  hora_retorno?: string // TIME -> string (HH:MM:SS)
  descripcion_comision?: string
  recorrido_de?: string
  recorrido_a?: string
  estado_boleta_comision?: 'PENDIENTE' | 'APROBADO'
  tipo_comision?: 'COMISION' | 'TRANSPORTE'
  created_at?: string
  updated_at?: string
  deleted_at?: string | null
  id_historico?: number | null
}
// export type Comision = {
//   id_comision?: ID
//   id_asignacion_administrativo: number
//   id_usuario_generador: number
//   id_usuario_aprobador?: number | null
//   fecha_comision?: string | null // DATE -> string (ISO)
//   hora_salida?: string | null // TIME -> string (HH:MM:SS)
//   hora_retorno: string // TIME -> string (HH:MM:SS)
//   descripcion_comision: string
//   recorrido_de: string
//   recorrido_a: string
//   estado_boleta_comision: 'PENDIENTE' | 'APROBADO'
//   tipo_comision: 'COMISION' | 'TRANSPORTE'
//   created_at?: string
//   updated_at?: string
//   deleted_at?: string | null
//   id_historico?: number | null
// }

// Respuesta del Backend para Comisiones
export type ComisionBackendResponse = {
  status: number
  error: boolean
  message: string
  data: Comision[] // Array de comisiones
  pagination?: PaginationState
}

// Tipo genérico para respuestas del backend
export type BackendResponse<T> = {
  status: number
  error: boolean
  message: string
  data: T
}

// Tipo específico para el endpoint de comisiones
export type ComisionesBackendData = {
  data: Comision[]
  payload?: {
    pagination?: PaginationState
    errors?: Record<string, string[]>
  }
}

// Respuesta del Frontend (Query)
export type ComisionQueryResponse = {
  data?: Comision[]
  payload?: {
    message?: string
    errors?: Record<string, string[]>
    pagination?: PaginationState
  }
}

// Valores iniciales para un formulario de Comisión
export const initialComision: Comision = {
  id_asignacion_administrativo: 0,
  id_usuario_generador: 0,
  id_usuario_aprobador: null,
  fecha_comision: new Date().toISOString().split('T')[0], // Fecha actual (YYYY-MM-DD)
  hora_salida: '08:00:00',
  hora_retorno: '17:00:00',
  descripcion_comision: '',
  recorrido_de: '',
  recorrido_a: '',
  estado_boleta_comision: 'PENDIENTE',
  tipo_comision: 'COMISION',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  deleted_at: null,
  id_historico: null,
}
