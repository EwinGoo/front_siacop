import { Comision } from '../../comision/comision-list/core/_models'
import { AsistenciaPermiso } from '../../permisos/asistencia-permiso/asistencia-permiso-list/core/_models'
import { UnifiedData } from '../types'

export class DataAdapter {
  /**
   * Convierte datos de comisión al formato unificado
   */
  static fromComision(comision: Comision): UnifiedData {
    return {
      id: comision.id_comision,
      codigo: comision.id_comision,
      nombre_generador: comision.nombre_generador,
      estado: comision.estado_boleta_comision,
      fecha_inicio: comision.fecha_comision,
      fecha_fin: comision.fecha_comision_fin,
      descripcion: comision.descripcion_comision,
      tipo_documento: 'comision',
      nombre_cargo: comision.nombre_cargo,
      unidad: comision.unidad,
      recorrido_de: comision.recorrido_de,
      recorrido_a: comision.recorrido_a
    }
  }

  /**
   * Convierte datos de permiso al formato unificado
   */
  static fromPermiso(permiso: AsistenciaPermiso): UnifiedData {
    return {
      id: permiso.id_asistencia_permiso,
      codigo: permiso.id_asistencia_permiso,
      nombre_generador: permiso.nombre_generador,
      estado: permiso.estado_permiso,
      fecha_inicio: permiso.fecha_inicio_permiso,
      fecha_fin: permiso.fecha_fin_permiso,
      descripcion: permiso.detalle_permiso || permiso.tipo_permiso_nombre,
      tipo_documento: 'permiso',
      tipo_permiso_nombre: permiso.tipo_permiso_nombre,
      turno_permiso: permiso.turno_permiso,
      tipo_personal: permiso.tipo_personal,
      ci: permiso.ci
    }
  }

  /**
   * Obtiene el estado normalizado
   */
  static getEstadoNormalizado(data: UnifiedData): string {
    return data.estado.toUpperCase()
  }

  /**
   * Obtiene información de visualización según el tipo
   */
  static getDisplayInfo(data: UnifiedData) {
    if (data.tipo_documento === 'permiso') {
      return {
        titulo: 'Permiso de Asistencia',
        subtitulo: data.tipo_permiso_nombre || 'Permiso',
        icono: 'bi-calendar-check',
        color: 'warning'
      }
    } else {
      return {
        titulo: 'Comisión de Servicio',
        subtitulo: 'Comisión',
        icono: 'bi-briefcase',
        color: 'primary'
      }
    }
  }
}