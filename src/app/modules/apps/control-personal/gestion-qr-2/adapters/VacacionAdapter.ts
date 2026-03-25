import { Vacacion } from '../../vacaciones/core/_models'
import { UnifiedDocument } from '../core/types'

/**
 * Adaptador para transformar datos de Vacación al formato unificado
 * 
 * ✨ NUEVA FUNCIONALIDAD
 */
export class VacacionAdapter {
  /**
   * Transforma una vacación del backend al formato UnifiedDocument
   */
  transform(vacacion: Vacacion): UnifiedDocument {
    return {
      // Identificación
      tipo_documento: 'VACACION',
      id: vacacion.id_vacacion_solicitado,
      // codigo: vacacion.id_vacacion_solicitado.toString(),
      codigo: '',
      nro_correlativo: undefined, // Vacaciones no tienen nro_correlativo
      
      // Estado
      estado: vacacion.estado_vacacion,
      
      // Información personal
      // Nota: Vacacion no tiene campos de persona directamente
      // Si se necesitan, deben cargarse desde id_persona_administrativo
      ci: undefined,
      nombre_generador: undefined,
      tipo_personal: undefined,
      unidad: undefined,
      nombre_cargo: undefined,
      
      // Fechas
      fecha_inicio: vacacion.fecha_vacacion_inicio,
      fecha_fin: vacacion.fecha_vacacion_fin,
      fecha_solicitud: vacacion.fecha_solicitud,
      
      // Tipo y detalles específicos de vacación
      tipo_permiso: vacacion.tipo_solicitud,
      tipo_solicitud: vacacion.tipo_solicitud,
      dias_solicitado: vacacion.dias_solicitado,
      numero_tramite: vacacion.numero_tramite || undefined,
      
      // Descripción (construida a partir de datos de vacación)
      descripcion: this.buildDescription(vacacion),
      
      // Observación (si existe en el modelo, agregar aquí)
      observacion: undefined
    }
  }

  /**
   * Construye una descripción legible para la vacación
   */
  private buildDescription(vacacion: Vacacion): string {
    const dias = vacacion.dias_solicitado
    const tipo = vacacion.tipo_solicitud
    
    return `Solicitud de ${dias} día(s) de ${tipo.toLowerCase()}`
  }
}
