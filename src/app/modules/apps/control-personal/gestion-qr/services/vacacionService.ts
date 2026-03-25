import {parseIDNumeric} from 'src/app/utils/parseID'
import {getVacacionById, procesarEstadoVacacion} from '../../vacaciones/core/_requests'
import {UnifiedData} from '../types'
import {DataAdapter} from './dataAdapter'

export class VacacionService {
  async getVacacionUnified(id: number): Promise<UnifiedData | null> {
    try {
      const response = await getVacacionById(id)
      if (!response) return null
      return DataAdapter.fromVacacion(response)
    } catch (error) {
      throw error
    }
  }

  async procesarRecepcion(codigo: string, fechaHora: string) {
    const response = await procesarEstadoVacacion({
      id: parseIDNumeric(codigo),
      action: 'receive',
      fecha: fechaHora,
    })
    return {
      nro_correlativo: response?.data,
      message: `Vacación recepcionada correctamente el ${new Date(fechaHora).toLocaleDateString('es-BO')}`,
    }
  }

  async aprobarVacacion(codigo: string, numeroTramite?: string) {
    await procesarEstadoVacacion({
      id: parseIDNumeric(codigo),
      action: 'approve',
      numero_tramite: numeroTramite,
    })
    return {message: `Vacación ${codigo} aprobada exitosamente`}
  }

  // Vacaciones no usa este estado actualmente — disponible para futuro uso
  // async registrarObservacion(codigo: string, observacion: string) {
  //   await procesarEstadoVacacion({
  //     id: parseIDNumeric(codigo),
  //     action: 'observe',
  //     observacion,
  //   })
  //   return {message: `Observación registrada para vacación ${codigo}`}
  // }
}

export const vacacionService = new VacacionService()
