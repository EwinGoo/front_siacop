import {parseIDNumeric} from 'src/app/utils/parseID'
// Asegúrate de tener estas funciones creadas en tu archivo de requests de vacaciones
import {getVacacionById, procesarEstadoVacacion} from '../../vacaciones/core/_requests'
import {UnifiedData} from '../types'
import {DataAdapter} from './dataAdapter'
import {Vacacion} from '../../vacaciones/core/_models'

export class VacacionService {
  /**
   * Obtiene una vacación por ID y la transforma al formato unificado
   */
//   async getVacacionById(id: number): Promise<Vacacion> {
//     try {
//       const response = await getVacacionById(id)

//       //   if (!response) {
//       //     console.warn(`No se encontró vacación con ID: ${id}`)
//       //     return null
//       //   }

//       // Convertir al formato unificado usando el adaptador
//       //   return DataAdapter.fromVacacion(response)
//       return response
//     } catch (error) {
//       console.error('Error al obtener vacación:', error)
//       throw error
//     }
//   }

  /**
   * Obtiene una vacación por ID directamente sin transformaciones
   */
  async getVacacionById(id: number): Promise<Vacacion> {
    try {
      // Llamada directa al request que definimos anteriormente
      const response = await getVacacionById(id)
      return response
    } catch (error) {
      console.error('Error al obtener vacación en el Service:', error)
      throw error
    }
  }

  /**
   * Procesa la recepción de la boleta de vacación
   */
  //   async procesarRecepcion(codigo: string, fechaHora: string) {
  //     try {
  //       const response = await procesarEstadoVacacion({
  //         code: parseIDNumeric(codigo),
  //         action: 'receive',
  //         fecha: fechaHora,
  //       })

  //       return {
  //         nro_correlativo: response.data.data,
  //         message: `Vacación recepcionada correctamente el ${new Date(fechaHora).toLocaleDateString('es-BO')}`
  //       }
  //     } catch (error) {
  //       console.error('Error al procesar recepción de vacación:', error)
  //       throw error
  //     }
  //   }

  /**
   * Aprueba la solicitud de vacación (Genera estado APROBADO)
   */
  //   async aprobarVacacion(codigo: string, numeroTramite?: string) {
  //     try {
  //       const response = await procesarEstadoVacacion({
  //         code: parseIDNumeric(codigo),
  //         action: 'approve',
  //         numero_tramite: numeroTramite // Por si tu API requiere el nro de trámite en la aprobación
  //       })

  //       return {
  //         message: `Vacación ${codigo} aprobada exitosamente`
  //       }
  //     } catch (error) {
  //       console.error('Error al aprobar vacación:', error)
  //       throw error
  //     }
  //   }

  /**
   * Registra una observación para devolver la solicitud al administrativo
   */
  //   async registrarObservacion(codigo: string, observacion: string) {
  //     try {
  //       const response = await procesarEstadoVacacion({
  //         code: parseIDNumeric(codigo),
  //         action: 'observe',
  //         observacion: observacion
  //       })

  //       return {
  //         message: `Observación registrada para vacación ${codigo}`
  //       }
  //     } catch (error) {
  //       console.error('Error al registrar observación de vacación:', error)
  //       throw error
  //     }
  //   }
}

export const vacacionService = new VacacionService()
