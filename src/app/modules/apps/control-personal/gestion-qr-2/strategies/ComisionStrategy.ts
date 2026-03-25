import { parseIDNumeric } from 'src/app/utils/parseID'
import { 
  getComisionById, 
  procesarEstadoComision 
} from '../../comision/comision-list/core/_requests'
import { BaseDocumentService } from '../core/BaseDocumentService'
import { ActionResponse, ProcessStateParams, UnifiedDocument } from '../core/types'
import { ComisionAdapter } from '../adapters/ComisionAdapter'
import { ID } from 'src/_metronic/helpers'

/**
 * Estrategia para manejar Comisiones (Permisos por Hora)
 */
export class ComisionStrategy extends BaseDocumentService {
  private adapter = new ComisionAdapter()

  async getById(id: ID): Promise<any> {
    try {
      const response = await getComisionById(id)
      return response
    } catch (error) {
      console.error('Error al obtener comisión:', error)
      throw error
    }
  }

  async procesarRecepcion(codigo: string, fechaHora: string): Promise<ActionResponse> {
    try {
      const response = await procesarEstadoComision({
        code: parseIDNumeric(codigo),
        action: 'receive',
        fecha: fechaHora,
      })

      return {
        success: true,
        // nro_correlativo: response.data.data.nro_correlativo,
        message: `Comisión recepcionada correctamente el ${new Date(fechaHora).toLocaleDateString('es-BO')}`,
        data: response.data
      }
    } catch (error) {
      console.error('Error al recepcionar comisión:', error)
      throw error
    }
  }

  async aprobar(codigo: string): Promise<ActionResponse> {
    try {
      const response = await procesarEstadoComision({
        code: parseIDNumeric(codigo),
        action: 'approve',
      })

      return {
        success: true,
        message: `Comisión ${codigo} aprobada exitosamente`,
        data: response.data
      }
    } catch (error) {
      console.error('Error al aprobar comisión:', error)
      throw error
    }
  }

  async registrarObservacion(codigo: string, observacion: string): Promise<ActionResponse> {
    try {
      const response = await procesarEstadoComision({
        code: parseIDNumeric(codigo),
        action: 'observe',
        observacion: observacion,
      })

      return {
        success: true,
        message: `Observación registrada para comisión ${codigo}`,
        data: response.data
      }
    } catch (error) {
      console.error('Error al registrar observación:', error)
      throw error
    }
  }

  async procesarEstado(params: ProcessStateParams): Promise<ActionResponse> {
    try {
      const response = await procesarEstadoComision(params)
      
      return {
        success: true,
        message: 'Estado procesado correctamente',
        data: response.data
      }
    } catch (error) {
      console.error('Error al procesar estado:', error)
      throw error
    }
  }

  transformToUnified(data: any): UnifiedDocument {
    return this.adapter.transform(data)
  }
}
