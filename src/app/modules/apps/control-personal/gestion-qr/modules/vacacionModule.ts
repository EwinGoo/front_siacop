import {vacacionService} from '../services/vacacionService'
import {AccionQR, QRModule} from './types'
import VacacionModal from '../components/modals/VacacionModal'

// Vacaciones no tiene acción "observar" actualmente
const ACCIONES_POR_ESTADO: Record<string, AccionQR[]> = {
  GENERADO: ['reception'],
  ENVIADO: ['reception'],
  RECEPCIONADO: ['approve'],
  APROBADO: [],
  // OBSERVADO: [], // No disponible en vacaciones por ahora
}

export const vacacionModule: QRModule = {
  tipo: 'vacacion',
  config: {
    label: 'Vacaciones',
    icon: 'bi-umbrella',
    color: 'success',
    prefijo: 'V',
  },

  async getById(id) {
    return vacacionService.getVacacionUnified(id)
  },

  async recepcionar(codigo, fechaHora) {
    return vacacionService.procesarRecepcion(codigo, fechaHora)
  },

  async aprobar(codigo, params) {
    return vacacionService.aprobarVacacion(codigo, params?.numero_tramite)
  },

  // observar no definido — vacaciones no usa este estado actualmente
  // async observar(codigo, observacion) {
  //   return vacacionService.registrarObservacion(codigo, observacion)
  // },

  getAccionesPorEstado(estado) {
    return ACCIONES_POR_ESTADO[estado.toUpperCase()] ?? []
  },

  Modal: VacacionModal,
}
