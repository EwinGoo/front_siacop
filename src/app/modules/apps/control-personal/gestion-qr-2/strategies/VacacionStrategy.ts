import { parseIDNumeric } from 'src/app/utils/parseID'
import { 
  getVacacionById, 
  procesarEstadoVacacion 
} from '../../vacaciones/core/_requests'
import { BaseDocumentService } from '../core/BaseDocumentService'
import { ActionResponse, ProcessStateParams, UnifiedDocument } from '../core/types'
import { VacacionAdapter } from '../adapters/VacacionAdapter'
import { ID } from 'src/_metronic/helpers'

/**
 * Estrategia para manejar Vacaciones
 * 
 * ✨ NUEVA FUNCIONALIDAD
 */
export class VacacionStrategy extends BaseDocumentService {
  private adapter = new VacacionAdapter()

  async getById(id: ID): Promise<any> {
    try {
      const response = await getVacacionById(id)
      
      if (!response) {
        console.warn(`No se encontró vacación con ID: ${id}`)
        return null
      }

      return response
    } catch (error) {
      console.error('Error al obtener vacación:', error)
      throw error
    }
  }

  async procesarRecepcion(codigo: string, fechaHora: string): Promise<ActionResponse> {
    try {
      const response = await procesarEstadoVacacion({
        id: parseIDNumeric(codigo),
        action: 'receive',
        fecha: fechaHora,
      })

      return {
        success: true,
        nro_correlativo: response.data?.nro_correlativo,
        message: `Vacación recepcionada correctamente el ${new Date(fechaHora).toLocaleDateString('es-BO')}`,
        data: response.data
      }
    } catch (error) {
      console.error('Error al procesar recepción de vacación:', error)
      throw error
    }
  }

  async aprobar(codigo: string): Promise<ActionResponse> {
    try {
      const response = await procesarEstadoVacacion({
        id: parseIDNumeric(codigo),
        action: 'approve'
      })

      return {
        success: true,
        message: `Vacación ${codigo} aprobada exitosamente`,
        data: response.data
      }
    } catch (error) {
      console.error('Error al aprobar vacación:', error)
      throw error
    }
  }

  async registrarObservacion(codigo: string, observacion: string): Promise<ActionResponse> {
    try {
      const response = await procesarEstadoVacacion({
        id: parseIDNumeric(codigo),
        action: 'observe',
        observacion: observacion
      })

      return {
        success: true,
        message: `Observación registrada para vacación ${codigo}`,
        data: response.data
      }
    } catch (error) {
      console.error('Error al registrar observación de vacación:', error)
      throw error
    }
  }

  async procesarEstado(params: ProcessStateParams): Promise<ActionResponse> {
    try {
      // Adaptar params al formato de vacaciones
      const vacacionParams = {
        id: params.code,
        action: params.action as 'receive' | 'approve' | 'observe',
        ...(params.observacion && { observacion: params.observacion }),
        ...(params.fecha && { fecha: params.fecha }),
        ...(params.numero_tramite && { numero_tramite: params.numero_tramite })
      }

      const response = await procesarEstadoVacacion(vacacionParams)
      
      return {
        success: true,
        message: 'Estado procesado correctamente',
        data: response.data
      }
    } catch (error) {
      console.error('Error al procesar estado de vacación:', error)
      throw error
    }
  }

  transformToUnified(data: any): UnifiedDocument {
    return this.adapter.transform(data)
  }
}
