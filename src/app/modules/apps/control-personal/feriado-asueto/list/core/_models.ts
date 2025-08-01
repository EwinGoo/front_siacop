import {ID, Response, PaginationState} from '../../../../../../../_metronic/helpers'

export type FeriadoAsueto = {
  id_asistencia_feriado_asueto?: ID
  id_usuario?: number
  nombre_evento?: string
  fecha_evento?: Date | null // DATE -> string (ISO)
  tipo_evento?: 'ASUETO' | 'FERIADO'
  fecha_inicio?: Date | null // DATE -> string (ISO)
  fecha_fin?: Date | null // DATE -> string (ISO)
  hora_inicio?: string | null // TIME -> string (HH:MM:SS)
  hora_fin?: string | null // TIME -> string (HH:MM:SS)
  aplicado_a?: 'MASCULINO' | 'FEMENINO' | 'TODOS'
  detalle?: string | null
  created_at?: string
  updated_at?: string
  deleted_at?: string | null
}


// Tipo genérico para respuestas del backend
export type BackendResponse<T> = {
  status: number
  error: boolean
  message: string
  data: T
}


// Respuesta del Backend para FeriadoAsueto
export type FeriadoAsuetoBackendResponse = {
  status: number
  error: boolean
  message: string
  data: FeriadoAsueto[] // Array de registros
  pagination?: PaginationState
}

// Tipo específico para el endpoint
export type FeriadoAsuetoBackendData = {
  data: FeriadoAsueto[]
  payload?: {
    pagination?: PaginationState
    errors?: Record<string, string[]>
  }
}

// Respuesta del Frontend (Query)
export type FeriadoAsuetoQueryResponse = {
  data?: FeriadoAsueto[]
  payload?: {
    message?: string
    errors?: Record<string, string[]>
    pagination?: PaginationState
  }
}

// Valores iniciales para un formulario
export const initialFeriadoAsueto: FeriadoAsueto = {
  id_usuario: 0,
  nombre_evento: '',
  fecha_evento: new Date(), // Fecha actual (YYYY-MM-DD)
  tipo_evento: 'ASUETO',
  fecha_inicio: new Date(),
  fecha_fin: new Date(),
  hora_inicio: '08:00:00',
  hora_fin: '17:00:00',
  aplicado_a: 'TODOS',
  detalle: '',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  deleted_at: null,
}