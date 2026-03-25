import React from 'react'
import {TipoPermiso, UnifiedData} from '../types'

export type AccionQR = 'reception' | 'approve' | 'observe'

export interface ModuleModalResult {
  confirmed: boolean
  action?: AccionQR
  observacion?: string
  numero_tramite?: string
}

export interface ModuleModalProps {
  data: UnifiedData
  accionesDisponibles: AccionQR[]
  formatToBolivianDate: (date: string, options?: any) => string
  onClose: (result: ModuleModalResult) => void
}

export interface QRModuleConfig {
  label: string
  icon: string
  color: string
  prefijo: string // 'C' | 'P' | 'V'
}

export interface QRModule {
  tipo: TipoPermiso
  config: QRModuleConfig

  getById(id: number): Promise<UnifiedData | null>
  recepcionar(codigo: string, fechaHora: string): Promise<{nro_correlativo?: any; message: string}>
  aprobar(codigo: string, params?: {numero_tramite?: string}): Promise<any>
  observar?(codigo: string, observacion: string): Promise<any>

  /** Qué acciones están disponibles para el estado dado */
  getAccionesPorEstado(estado: string): AccionQR[]

  /** Componente modal específico del módulo */
  Modal: React.ComponentType<ModuleModalProps>
}
