import { ID } from 'src/_metronic/helpers'
import { ActionResponse, ProcessStateParams, UnifiedDocument } from './types'

/**
 * Clase abstracta base para servicios de documentos
 * 
 * Cada tipo de documento debe extender esta clase e implementar
 * sus métodos específicos
 */
export abstract class BaseDocumentService {
  /**
   * Obtiene un documento por su ID
   */
  abstract getById(id: ID): Promise<any>

  /**
   * Procesa la recepción de un documento
   */
  abstract procesarRecepcion(
    codigo: string,
    fechaHora: string
  ): Promise<ActionResponse>

  /**
   * Aprueba un documento
   */
  abstract aprobar(codigo: string): Promise<ActionResponse>

  /**
   * Registra una observación en un documento
   */
  abstract registrarObservacion(
    codigo: string,
    observacion: string
  ): Promise<ActionResponse>

  /**
   * Procesa el estado de un documento (método genérico)
   */
  abstract procesarEstado(params: ProcessStateParams): Promise<ActionResponse>
  
  /**
   * Transforma los datos del backend al formato unificado
   */
  abstract transformToUnified(data: any): UnifiedDocument
}
