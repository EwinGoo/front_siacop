import { useState } from 'react'
import { DocumentServiceFactory } from '../core'
import { AccionDocumento, UnifiedDocument } from '../core/types'
import { parseCode, extractCodeFromURL } from 'src/app/utils/parseID'

/**
 * Hook para manejar acciones sobre documentos
 */
export const useDocumentActions = () => {
  const [loading, setLoading] = useState(false)

  /**
   * Obtiene un documento por código QR
   */
  const fetchDocument = async (qrCode: string): Promise<UnifiedDocument | null> => {
    try {
      setLoading(true)

      // Extraer código limpio
      const cleanCode = extractCodeFromURL(qrCode)
      
      // Determinar tipo de permiso
      const tipoPermiso = parseCode(cleanCode)
      
      // Crear servicio apropiado
      const service = DocumentServiceFactory.createByTipoPermiso(tipoPermiso)
      
      // Extraer solo el número (quitar C, P, V)
      const numericCode = cleanCode.substring(1)
      
      // Obtener datos del backend
      const data = await service.getById(parseInt(numericCode))
      
      if (!data) {
        throw new Error('Documento no encontrado')
      }
      
      // Transformar a formato unificado
      const unifiedDoc = service.transformToUnified(data)
      
      return unifiedDoc
    } catch (error) {
      console.error('Error al obtener documento:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  /**
   * Procesa la recepción de un documento
   */
  const procesarRecepcion = async (
    document: UnifiedDocument,
    fechaHora: string
  ): Promise<{ success: boolean; message: string; nro_correlativo?: number }> => {
    try {
      setLoading(true)

      const service = DocumentServiceFactory.createByKey(document.tipo_documento)
      const result = await service.procesarRecepcion(document.codigo, fechaHora)

      return {
        success: result.success,
        message: result.message,
        nro_correlativo: result.nro_correlativo
      }
    } catch (error: any) {
      console.error('Error al recepcionar:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  /**
   * Aprueba un documento
   */
  const aprobar = async (
    document: UnifiedDocument
  ): Promise<{ success: boolean; message: string }> => {
    try {
      setLoading(true)

      const service = DocumentServiceFactory.createByKey(document.tipo_documento)
      const result = await service.aprobar(document.codigo)

      return {
        success: result.success,
        message: result.message
      }
    } catch (error: any) {
      console.error('Error al aprobar:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  /**
   * Registra una observación en un documento
   */
  const registrarObservacion = async (
    document: UnifiedDocument,
    observacion: string
  ): Promise<{ success: boolean; message: string }> => {
    try {
      setLoading(false)

      const service = DocumentServiceFactory.createByKey(document.tipo_documento)
      const result = await service.registrarObservacion(document.codigo, observacion)

      return {
        success: result.success,
        message: result.message
      }
    } catch (error: any) {
      console.error('Error al registrar observación:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  /**
   * Ejecuta una acción según el tipo
   */
  const executeAction = async (
    action: AccionDocumento,
    document: UnifiedDocument,
    options?: {
      fechaHora?: string
      observacion?: string
    }
  ): Promise<{ success: boolean; message: string; nro_correlativo?: number }> => {
    switch (action) {
      case 'reception':
        if (!options?.fechaHora) {
          throw new Error('fechaHora es requerido para recepción')
        }
        return await procesarRecepcion(document, options.fechaHora)

      case 'approve':
        return await aprobar(document)

      case 'observe':
        if (!options?.observacion) {
          throw new Error('observacion es requerido para observar')
        }
        return await registrarObservacion(document, options.observacion)

      case 'view':
        return { success: true, message: 'Documento visualizado' }

      default:
        throw new Error(`Acción no soportada: ${action}`)
    }
  }

  return {
    loading,
    fetchDocument,
    procesarRecepcion,
    aprobar,
    registrarObservacion,
    executeAction
  }
}
