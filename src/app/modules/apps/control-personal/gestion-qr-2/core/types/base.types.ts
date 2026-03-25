import { ID } from 'src/_metronic/helpers'

/**
 * Estados posibles de un documento
 */
export type EstadoDocumento = 'GENERADO' | 'ENVIADO' | 'RECEPCIONADO' | 'APROBADO' | 'OBSERVADO'

/**
 * Acciones posibles sobre un documento
 */
export type AccionDocumento = 'view' | 'reception' | 'approve' | 'observe'

/**
 * Tipos de permisos del sistema legacy (mantener por compatibilidad)
 */
export type TipoPermiso = 'hora' | 'dia' | 'vacacion'

/**
 * Modos de recepción
 */
export type ModoRecepcion = 'automatico' | 'manual'

/**
 * Resultado de escaneo QR
 */
export interface QRResult {
  code: string
  timestamp: number
  rawData?: any
}

/**
 * Respuesta de procesamiento de acción
 */
export interface ActionResponse {
  success: boolean
  message: string
  nro_correlativo?: number
  data?: any
}

/**
 * Configuración de estado
 */
export interface StateConfig {
  label: string
  color: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info'
  action: AccionDocumento
}

/**
 * Estilos de badge por estado
 */
export const ESTADO_STYLES: Record<EstadoDocumento, string> = {
  GENERADO: 'secondary',
  ENVIADO: 'warning',
  RECEPCIONADO: 'info',
  OBSERVADO: 'danger',
  APROBADO: 'success',
}
