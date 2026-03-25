import { ModoRecepcion, TipoPermiso } from './base.types'

/**
 * Props del ControlPanel
 */
export interface ControlPanelProps {
  modoRecepcion: ModoRecepcion
  tipoPermiso: TipoPermiso
  fechaHora: string
  isPaused: boolean
  loading: boolean
  onModoRecepcionChange: (modo: ModoRecepcion) => void
  onTipoPermisoChange: (tipo: TipoPermiso) => void
  onFechaHoraChange: (fecha: string) => void
  onPausedChange: (paused: boolean) => void
  onIngresoManual: () => void
  onTimeUpdate: (date: Date) => void
}

/**
 * Props de Cards
 */
export interface UltimoCodigoCardProps {
  lastScanned: {
    code: string
    tipoPermiso: string
    timestamp: number
  } | null
}

export interface HistorialCardProps {
  scannedHistory: Array<{
    code: string
    timestamp: number
    tipoPermiso: string
  }>
}

/**
 * Props del QRScanner
 */
export interface QRScannerPanelProps {
  modoRecepcion: ModoRecepcion
  tipoPermiso: TipoPermiso
  onQRDetected: (result: { code: string; timestamp: number }) => void
}