export type ModoRecepcion = 'automatico' | 'manual'
export type TipoPermiso = 'hora' | 'dia'

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