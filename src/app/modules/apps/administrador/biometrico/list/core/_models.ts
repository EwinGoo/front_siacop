import {ID, PaginationState} from 'src/_metronic/helpers'

export type DispositivoBiometrico = {
  id_biometrico?: ID
  id_usuario?: number
  nombre_dispositivo?: string
  direccion_ip?: string
  puerto?: number
  ubicacion?: string | null
  ubicacion_descripcion?: string | null
  modelo?: string | null
  firmware?: string | null
  serial?: string
  platform?: string | null
  fecha_hora?: string | null
  ultima_sincronizacion?: string | null
  created_at?: string
  updated_at?: string
  deleted_at?: string | null
  // Campo adicional del JOIN con usuarios
  usuario?: string
}

// Tipo genérico para respuestas del backend
export type BackendResponse<T> = {
  status: number
  error: boolean
  message: string
  data: T
}

// Respuesta del Backend para DispositivoBiometrico
export type DispositivoBiometricoBackendResponse = {
  status: number
  error: boolean
  message: string
  data: DispositivoBiometrico[]
  pagination?: PaginationState
}

// Tipo específico para el endpoint
export type DispositivoBiometricoBackendData = {
  data: DispositivoBiometrico[]
  payload?: {
    pagination?: PaginationState
    errors?: Record<string, string[]>
  }
}

// Respuesta del Frontend (Query)
export type DispositivoBiometricoQueryResponse = {
  data?: DispositivoBiometrico[]
  payload?: {
    message?: string
    errors?: Record<string, string[]>
    pagination?: PaginationState
  }
}

export type ZktecoLoginResponse = {
  success: boolean
  data: any // aquí lo tipas según lo que devuelva tu backend
  message?: string
  session_status: any
}

export type LogoutResponse = {
  success: boolean
  message: string
  session_cleared: boolean
  timestamp: string
  warning?: string
}

export type DeviceUser = {
  uid: number
  department: string
  id_number: string
  name: string
  card: string
  group: string
  privilege: string
  edit_url: string
}

export type DeviceUsersResponse = {
  success: boolean
  data: DeviceUser[]
  count: number
  timestamp: string
}

export type DeviceInfo = {
  device_name: string
  serial_number: string
  produce_date: string
  ip_address: string
  user_capacity: string
  transaction_capacity: string
  finger_capacity: string
  lock: string
  rf_card: string
  short_message_management: string
  usb_disk: string
  usb_client: string
  remote_identification_server: string
}

export type DeviceInfoResponse = {
  success: boolean
  data: DeviceInfo
  timestamp: string
}

// Valores iniciales para un formulario
export const initialDispositivoBiometrico: DispositivoBiometrico = {
  id_usuario: 9972,
  nombre_dispositivo: '',
  direccion_ip: '',
  puerto: 4370,
  ubicacion: '',
  ubicacion_descripcion: '',
  modelo: '',
  firmware: '',
  serial: '',
  platform: '',
  fecha_hora: null,
  ultima_sincronizacion: null,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  deleted_at: null,
}
