import { 
  getComisionById, 
  procesarEstadoComision, 
  aprobarComisionPorQR 
} from '../../comision/comision-list/core/_requests' // Ajustar ruta según tu estructura
import { TipoPermiso } from '../types'

export class ComisionService {
  async getComisionById(id: number) {
    try {
      const response = await getComisionById(id)
      return response
    } catch (error) {
      console.error('Error al obtener comisión:', error)
      throw error
    }
  }

  async procesarRecepcion(codigo: string, fechaHora: string, tipoPermiso: TipoPermiso) {
    try {
      const response = await procesarEstadoComision({
        code: parseInt(codigo),
        action: 'receive',
        fecha: fechaHora,
        // tipoPermiso: tipoPermiso
      })
      return response
    } catch (error) {
      console.error('Error al recepcionar comisión:', error)
      throw error
    }
  }

  async aprobarComision(codigo: string) {
    try {
      const response = await procesarEstadoComision({
        code: parseInt(codigo),
        action: 'approve'
      })
      return response
    } catch (error) {
      console.error('Error al aprobar comisión:', error)
      throw error
    }
  }

  async registrarObservacion(codigo: string, observacion: string) {
    try {
      const response = await procesarEstadoComision({
        code: parseInt(codigo),
        action: 'observe',
        observacion: observacion
      })
      return response
    } catch (error) {
      console.error('Error al registrar observación:', error)
      throw error
    }
  }
}

export const comisionService = new ComisionService()

// ============= 8. UTILIDADES PARA SWAL =============