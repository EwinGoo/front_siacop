import {comisionService} from '../services/comisionService'
import {DataAdapter} from '../services/dataAdapter'
import {AccionQR, QRModule} from './types'
import ComisionModal from '../components/modals/ComisionModal'

const ACCIONES_POR_ESTADO: Record<string, AccionQR[]> = {
  GENERADO: ['reception'],
  ENVIADO: ['reception'],
  RECEPCIONADO: ['approve', 'observe'],
  APROBADO: [],
  OBSERVADO: [],
}

export const comisionModule: QRModule = {
  tipo: 'hora',
  config: {
    label: 'Comisiones',
    icon: 'bi-briefcase',
    color: 'info',
    prefijo: 'C',
  },

  async getById(id) {
    const data = await comisionService.getComisionById(id)
    if (!data) return null
    return DataAdapter.fromComision(data)
  },

  async recepcionar(codigo, fechaHora) {
    return comisionService.procesarRecepcion(codigo, fechaHora, 'hora')
  },

  async aprobar(codigo) {
    return comisionService.aprobarComision(codigo)
  },

  async observar(codigo, observacion) {
    return comisionService.registrarObservacion(codigo, observacion)
  },

  getAccionesPorEstado(estado) {
    return ACCIONES_POR_ESTADO[estado.toUpperCase()] ?? []
  },

  Modal: ComisionModal,
}
