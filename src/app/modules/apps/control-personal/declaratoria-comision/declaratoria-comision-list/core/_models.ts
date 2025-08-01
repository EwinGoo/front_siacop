import {ID, Response, PaginationState} from '../../../../../../../_metronic/helpers'
export type TipoViatico = 'con_viatico' | 'sin_viatico'

export type DeclaratoriaComision = {
  id_declaratoria_comision?: ID
  id_asignacion_administrativo?: number
  id_usuario?: number
  fecha_elaboracion?: string
  nota_interna?: string | null
  rrhh_hoja_ruta_numero?: string
  rrhh_hoja_ruta_fecha?: string
  tipo_viatico: boolean | TipoViatico
  fecha_inicio?: string
  fecha_fin?: string
  destino?: string
  motivo?: string
  nombre_generador?: string | null
  ci?: string | null
}

export type DataPayload = Omit<DeclaratoriaComision, 'tipo_viatico'> & {
  tipo_viatico: string
}

export type DeclaratoriaComisionBackendResponse = {
  status: number
  error: boolean
  message: string
  data: DeclaratoriaComision[] // Array de declaratorias
  pagination?: PaginationState
}

export type BackendResponse<T> = {
  status: number
  error: boolean
  message: string
  data: T
}

export type DeclaratoriasComisionBackendData = {
  data: DeclaratoriaComision[]
  payload?: {
    pagination?: PaginationState
    errors?: Record<string, string[]>
  }
}

export type DeclaratoriaComisionQueryResponse = {
  data?: DeclaratoriaComision[]
  payload?: {
    message?: string
    errors?: Record<string, string[]>
    pagination?: PaginationState
  }
}

// export const initialDeclaratoriaComision: DeclaratoriaComision = {
//   id_asignacion_administrativo: 0,
//   id_usuario: 0,
//   fecha_elaboracion: new Date().toISOString().split('T')[0], // Fecha actual (YYYY-MM-DD)
//   nota_interna: null,
//   rrhh_hoja_ruta_numero: '',
//   rrhh_hoja_ruta_fecha: new Date().toISOString().split('T')[0],
//   tipo_viatico: 'sin_viatico',
//   fecha_inicio: new Date().toISOString().split('T')[0],
//   fecha_fin: new Date().toISOString().split('T')[0],
//   destino: '',
//   motivo: '',
//   created_at: new Date().toISOString(),
//   updated_at: new Date().toISOString(),
//   deleted_at: null,
// }

export const initialDeclaratoriaComision: DeclaratoriaComision = {
  id_declaratoria_comision: undefined,
  id_asignacion_administrativo: 12068,
  id_usuario: 9972,
  fecha_elaboracion: new Date().toISOString().split('T')[0],
  nota_interna: '1234',
  rrhh_hoja_ruta_numero: '1234',
  rrhh_hoja_ruta_fecha: new Date().toISOString().split('T')[0],
  tipo_viatico: false,
  fecha_inicio: new Date().toISOString().split('T')[0],
  fecha_fin: new Date().toISOString().split('T')[0],
  destino: 'UMSA',
  motivo: 'Congreso de universidades',
}
