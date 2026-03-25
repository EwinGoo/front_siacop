import { ID } from 'src/_metronic/helpers'
import { EstadoDocumento, StateConfig, TipoPermiso } from './base.types'

/**
 * Keys de tipos de documentos soportados
 */
export type DocumentTypeKey = 'COMISION' | 'PERMISO' | 'VACACION'

/**
 * Interfaz base para todos los documentos
 */
export interface BaseDocument {
  id: ID
  codigo: string
  estado: EstadoDocumento
  nro_correlativo?: number
  created_at?: string
  updated_at?: string
}

/**
 * Datos unificados de un documento (para UI)
 */
export interface UnifiedDocument extends BaseDocument {
  // Tipo de documento
  tipo_documento: DocumentTypeKey
  tipo_permiso: string // Tipo específico (ej: "COMISIÓN", "LICENCIA MÉDICA", etc)
  
  // Información personal
  ci?: string
  nombre_generador?: string
  nombre_cargo?: string
  unidad?: string
  tipo_personal?: string
  
  // Fechas
  fecha_inicio: string
  fecha_fin?: string
  hora?: string
  turno_permiso?: string
  
  // Detalles
  descripcion?: string
  observacion?: string
  
  // Campos específicos de comisión
  recorrido_de?: string
  recorrido_a?: string
  
  // Campos específicos de vacación
  dias_solicitado?: string | number
  numero_tramite?: string
  fecha_solicitud?: string
  tipo_solicitud?: string
}

/**
 * Información de visualización de un documento
 */
export interface DocumentDisplayInfo {
  titulo: string
  subtitulo: string
  icono: string
  color: string
  badgeColor: string
}

/**
 * Configuración completa de un tipo de documento
 */
export interface DocumentTypeConfig {
  // Identificación
  key: DocumentTypeKey
  code: string // Código QR (C, P, V)
  
  // Labels
  label: string // Singular (ej: "Comisión")
  labelPlural: string // Plural (ej: "Comisiones")
  description: string
  
  // UI
  icon: string // Bootstrap icon class
  color: string // Color principal
  badgeColor: string // Clase de badge
  
  // Sistema
  tipoPermiso: TipoPermiso // Para compatibilidad legacy
  strategyClass: any // Constructor de la estrategia
  adapterClass: any // Constructor del adaptador
  
  // Estados permitidos
  states: Record<string, StateConfig>
}

/**
 * Parámetros para procesar estado de documento
 */
export interface ProcessStateParams {
  code: ID
  action: 'send' | 'approve' | 'observe' | 'receive'
  observacion?: string
  fecha?: string
  numero_tramite?: string
}
