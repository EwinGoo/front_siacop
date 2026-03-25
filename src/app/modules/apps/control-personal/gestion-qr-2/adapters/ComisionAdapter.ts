import { formatTimeFromString } from 'src/app/utils/dateTimeFormater'
import { truncateText } from 'src/app/utils/textUtils'
import { Comision } from '../../comision/comision-list/core/_models'
import { UnifiedDocument } from '../core/types'

/**
 * Adaptador para transformar datos de Comisión al formato unificado
 */
export class ComisionAdapter {
  /**
   * Transforma una comisión del backend al formato UnifiedDocument
   */
  transform(comision: Comision): UnifiedDocument {
    const isComisionType = this.isComisionType(comision.tipo_comision || '')

    return {
      // Identificación
      tipo_documento: 'COMISION',
      id: comision.id_comision!,
      codigo: comision.id_comision!.toString(),
      nro_correlativo: comision.nro_correlativo,
      
      // Estado
      estado: comision.estado_boleta_comision,
      
      // Información personal
      ci: comision.ci || undefined,
      nombre_generador: comision.nombre_generador || undefined,
      nombre_cargo: comision.nombre_cargo || undefined,
      unidad: comision.unidad || undefined,
      tipo_personal: comision.tipo_personal || undefined,
      
      // Fechas y horarios
      fecha_inicio: comision.fecha_comision,
      fecha_fin: comision.fecha_comision_fin,
      hora: `${formatTimeFromString(comision.hora_salida)} - ${formatTimeFromString(comision.hora_retorno)}`,
      
      // Tipo y detalles
      tipo_permiso: comision.tipo_comision || '',
      descripcion: isComisionType ? undefined : truncateText(comision.descripcion_comision || '', 120),
      observacion: comision.observacion || undefined,
      
      // Campos específicos de comisión
      recorrido_de: isComisionType ? comision.recorrido_de : undefined,
      recorrido_a: isComisionType ? comision.recorrido_a : undefined,
      
      // Metadata
      created_at: comision.created_at,
      updated_at: comision.updated_at
    }
  }

  /**
   * Determina si es un tipo de comisión (COMISIÓN o TRANSPORTE)
   */
  private isComisionType(tipo: string): boolean {
    const tiposComision = ['COMISIÓN', 'TRANSPORTE']
    return tiposComision.includes(tipo.toUpperCase())
  }
}
