import { AccionDocumento } from './base.types'
import { UnifiedDocument } from './document.types'

/**
 * Configuración de botón en modal
 */
export interface ModalButton {
  label: string
  icon: string
  variant: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark'
  action: AccionDocumento
  className?: string
}

/**
 * Resultado de acción en modal
 */
export interface ModalActionResult {
  confirmed: boolean
  action?: AccionDocumento
  observacion?: string
  fechaRecepcion?: string
}

/**
 * Props del modal principal
 */
export interface DocumentModalProps {
  show: boolean
  document: UnifiedDocument | null
  onHide: () => void
  onAction: (result: ModalActionResult) => void
  formatDate: (date: string, options?: any) => string
}

/**
 * Props del header del modal
 */
export interface ModalHeaderProps {
  document: UnifiedDocument
  onClose: () => void
}

/**
 * Props del body del modal
 */
export interface ModalBodyProps {
  document: UnifiedDocument
  formatDate: (date: string, options?: any) => string
}

/**
 * Props del footer del modal
 */
export interface ModalFooterProps {
  document: UnifiedDocument
  buttons: ModalButton[]
  onAction: (action: AccionDocumento) => void
}

/**
 * Estado del modal manager
 */
export interface ModalState {
  show: boolean
  document: UnifiedDocument | null
  loading: boolean
}
