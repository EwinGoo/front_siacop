import { parseIDNumeric } from 'src/app/utils/parseID'
import { 
  getAsistenciaPermisoById, 
  procesarEstadoPermiso 
} from '../../permisos/asistencia-permiso/asistencia-permiso-list/core/_requests'
import { BaseDocumentService } from '../core/BaseDocumentService'
import { ActionResponse, ProcessStateParams, UnifiedDocument } from '../core/types'
import { PermisoAdapter } from '../adapters/PermisoAdapter'
import { ID } from 'src/_metronic/helpers'

/**
 * Estrategia para manejar Permisos (Licencias Especiales por Día)
 */
export class PermisoStrategy extends BaseDocumentService {
  private adapter = new PermisoAdapter()

  async getById(id: ID): Promise<any> {
    try {
      const response = await getAsistenciaPermisoById(id)
      
      if (!response) {
        console.warn(`No se encontró permiso con ID: ${id}`)
        return null
      }

      return response
    } catch (error) {
      console.error('Error al obtener permiso:', error)
      throw error
    }
  }

  async procesarRecepcion(codigo: string, fechaHora: string): Promise<ActionResponse> {
    try {
      const response = await procesarEstadoPermiso({
        code: parseIDNumeric(codigo),
        action: 'receive',
        fecha: fechaHora,
      })

      return {
        success: true,
        // nro_correlativo: response.data.data,
        message: `Permiso recepcionado correctamente el ${new Date(fechaHora).toLocaleDateString('es-BO')}`,
        data: response.data
      }
    } catch (error) {
      console.error('Error al procesar recepción de permiso:', error)
      throw error
    }
  }

  async aprobar(codigo: string): Promise<ActionResponse> {
    try {
      const response = await procesarEstadoPermiso({
        code: parseIDNumeric(codigo),
        action: 'approve'
      })

      return {
        success: true,
        message: `Permiso ${codigo} aprobado exitosamente`,
        data: response.data
      }
    } catch (error) {
      console.error('Error al aprobar permiso:', error)
      throw error
    }
  }

  async registrarObservacion(codigo: string, observacion: string): Promise<ActionResponse> {
    try {
      const response = await procesarEstadoPermiso({
        code: parseIDNumeric(codigo),
        action: 'observe',
        observacion: observacion
      })

      return {
        success: true,
        message: `Observación registrada para permiso ${codigo}`,
        data: response.data
      }
    } catch (error) {
      console.error('Error al registrar observación de permiso:', error)
      throw error
    }
  }

  async procesarEstado(params: ProcessStateParams): Promise<ActionResponse> {
    try {
      const response = await procesarEstadoPermiso(params)
      
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
