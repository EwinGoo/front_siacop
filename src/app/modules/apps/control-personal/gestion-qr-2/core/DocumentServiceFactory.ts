import { BaseDocumentService } from './BaseDocumentService'
import { DocumentTypeKey, TipoPermiso } from './types'
import { getDocumentTypeByCode, getDocumentTypeByKey } from '../config/documentTypes.config'

/**
 * Factory para crear instancias de servicios de documentos
 * 
 * Uso:
 *   const service = DocumentServiceFactory.createByCode('C') // ComisionStrategy
 *   const service = DocumentServiceFactory.createByKey('PERMISO') // PermisoStrategy
 *   const service = DocumentServiceFactory.createByTipoPermiso('vacacion') // VacacionStrategy
 */
export class DocumentServiceFactory {
  private static instances = new Map<DocumentTypeKey, BaseDocumentService>()

  /**
   * Crea o retorna instancia singleton de servicio por código QR
   * @param code Código QR ('C', 'P', 'V')
   */
  static createByCode(code: string): BaseDocumentService {
    const config = getDocumentTypeByCode(code)
    
    if (!config) {
      throw new Error(`Tipo de documento no soportado para código: ${code}`)
    }

    return this.getInstance(config.key, config.strategyClass)
  }

  /**
   * Crea o retorna instancia singleton de servicio por key
   * @param key Key del documento ('COMISION', 'PERMISO', 'VACACION')
   */
  static createByKey(key: DocumentTypeKey): BaseDocumentService {
    const config = getDocumentTypeByKey(key)
    return this.getInstance(key, config.strategyClass)
  }

  /**
   * Crea o retorna instancia singleton de servicio por tipo de permiso (legacy)
   * @param tipoPermiso 'hora', 'dia', 'vacacion'
   */
  static createByTipoPermiso(tipoPermiso: TipoPermiso): BaseDocumentService {
    const keyMap: Record<TipoPermiso, DocumentTypeKey> = {
      hora: 'COMISION',
      dia: 'PERMISO',
      vacacion: 'VACACION'
    }

    const key = keyMap[tipoPermiso]
    return this.createByKey(key)
  }

  /**
   * Obtiene o crea instancia singleton
   */
  private static getInstance(
    key: DocumentTypeKey,
    StrategyClass: new () => BaseDocumentService
  ): BaseDocumentService {
    if (!this.instances.has(key)) {
      this.instances.set(key, new StrategyClass())
    }
    return this.instances.get(key)!
  }

  /**
   * Limpia el cache de instancias (útil para testing)
   */
  static clearCache(): void {
    this.instances.clear()
  }
}
