import {permisoService} from '../services/permisoService'
import {AccionQR, QRModule} from './types'
import PermisoModal from '../components/modals/PermisoModal'

const ACCIONES_POR_ESTADO: Record<string, AccionQR[]> = {
  GENERADO: ['reception'],
  ENVIADO: ['reception'],
  RECEPCIONADO: ['approve', 'observe'],
  APROBADO: [],
  OBSERVADO: [],
}

export const permisoModule: QRModule = {
  tipo: 'dia',
  config: {
    label: 'Licencias Especiales',
    icon: 'bi-calendar-check',
    color: 'primary',
    prefijo: 'P',
  },

  async getById(id) {
    return permisoService.getPermisoById(id)
  },

  async recepcionar(codigo, fechaHora) {
    return permisoService.procesarRecepcion(codigo, fechaHora, 'dia')
  },

  async aprobar(codigo) {
    return permisoService.aprobarPermiso(codigo)
  },

  async observar(codigo, observacion) {
    return permisoService.registrarObservacion(codigo, observacion)
  },

  getAccionesPorEstado(estado) {
    return ACCIONES_POR_ESTADO[estado.toUpperCase()] ?? []
  },

  Modal: PermisoModal,
}
