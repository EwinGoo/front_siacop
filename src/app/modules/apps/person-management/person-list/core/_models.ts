import {ID, Response, PaginationState } from '../../../../../../_metronic/helpers'

export type Persona = {
  id?: ID
  nombre?: string
  apellido?: string
  email?: string
  telefono?: string
  estado?: string
  created_at?: string
}

export type PersonaBackendResponse = {
  status: number
  error: boolean
  message: string
  data: Persona[] // Array de personas
  pagination?: PaginationState
  // errors?: Record<string, string[]>
}

// export type PersonaAPIResponse = {
//   status: number
//   error: boolean
//   message: string
//   data: {
//     data: Persona[] // Array de personas
//     pagination?: PaginationStateModel
//   }
// }

// export type PersonaQueryResponse = APIResponse<{
//   data: Persona[]
//   pagination: PaginationStateModel
// }>


export type BackendResponse<T> = {
  status: number
  error: boolean
  message: string
  data: T
}

// Tipo específico para el endpoint de personas
export type PersonasBackendData = {
  data: Persona[]           // Array de personas
  payload?: {
    pagination?: PaginationState
  }
}

// Tipo para la respuesta del frontend

export type PersonaQueryResponse = {
  data?: Persona[]
  payload?: {
    message?: string
    errors?: Record<string, string[]>
    pagination?: PaginationState
  }
}

// export type Persona

// export type PersonaQueryResponse = Response<Array<Persona>>

// export const initialPersona: Persona = {
//   nombre: '',
//   apellido: '',
//   email: '',
//   telefono: '',
//   estado: 'inactivo',
//   created_at: new Date().toISOString(), // Opcional: inicializar con la fecha actual
// }

export const initialPersona: Persona = {
  nombre: 'test',
  apellido: 'apellido test',
  email: 'test@test.com',
  telefono: '12341234',
  estado: 'activo',
  created_at: new Date().toISOString(), // Opcional: inicializar con la fecha actual
}
