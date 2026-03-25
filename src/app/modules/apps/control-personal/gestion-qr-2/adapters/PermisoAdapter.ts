import { AsistenciaPermiso } from '../../permisos/asistencia-permiso/asistencia-permiso-list/core/_models'
import { UnifiedDocument } from '../core/types'

/**
 * Adaptador para transformar datos de Permiso al formato unificado
 */
export class PermisoAdapter {
  /**
   * Transforma un permiso del backend al formato UnifiedDocument
   */
  transform(permiso: AsistenciaPermiso): UnifiedDocument {
    return {
      // Identificación
      tipo_documento: 'PERMISO',
      id: permiso.id_asistencia_permiso,
      // codigo: permiso.id_asistencia_permiso.toString(),
      codigo: "",
      nro_correlativo: permiso.nro_correlativo,
      
      // Estado
      estado: permiso.estado_permiso,
      
      // Información personal
      ci: permiso.ci || undefined,
      nombre_generador: permiso.nombre_generador || undefined,
      tipo_personal: permiso.tipo_personal || undefined,
      unidad: permiso.unidad || undefined,
      nombre_cargo: permiso.nombre_cargo || undefined,
      
      // Fechas y horarios
      fecha_inicio: permiso.fecha_inicio_permiso,
      fecha_fin: permiso.fecha_fin_permiso,
      turno_permiso: permiso.turno_permiso,
      
      // Tipo y detalles
      tipo_permiso: permiso.tipo_permiso_nombre || '',
      descripcion: permiso.detalle_permiso || undefined,
      observacion: permiso.observacion || undefined,
      
      // Metadata
      created_at: permiso.created_at || undefined
    }
  }
}
