import { formatTimeFromString } from 'src/app/utils/dateTimeFormater'
import {Comision} from '../../comision/comision-list/core/_models'
import {AsistenciaPermiso} from '../../permisos/asistencia-permiso/asistencia-permiso-list/core/_models'
import {Vacacion} from '../../vacaciones/core/_models'
import {UnifiedData} from '../types'
import { truncateText } from 'src/app/utils/textUtils'

export class DataAdapter {
  /**
   * Convierte datos de comisión al formato unificado
   */

  static fromComision(comision: Comision): UnifiedData {
    // console.log(comision)

    return {
      tipo_documento: 'comision',
      id: comision.id_comision,
      nro_correlativo: comision.nro_correlativo,
      ci: comision.ci || '',
      codigo: comision.id_comision,
      nombre_generador: comision.nombre_generador,
      estado: comision.estado_boleta_comision, 
      fecha_inicio: comision.fecha_comision,
      fecha_fin: comision.fecha_comision_fin,
      descripcion: this.isComision(comision.tipo_comision || '') ? '':  truncateText((comision.descripcion_comision ||''),120),
      hora: formatTimeFromString(comision.hora_salida) + '-' + formatTimeFromString(comision.hora_retorno),
      tipo_permiso: comision.tipo_comision || '',
      nombre_cargo: comision.nombre_cargo,
      unidad: comision.unidad,
      recorrido_de: this.isComision(comision.tipo_comision || '') ?comision.recorrido_de:'', 
      recorrido_a: this.isComision(comision.tipo_comision || '') ?comision.recorrido_a:'',
      observacion: comision.observacion || '',
    }
  }
  //  data.recorrido_a ? `
  //       <div class="row mb-2 text-start">
  //         <div class="col-3 fw-bold">Ruta</div>
  //         <div class="col-9">: ${data.recorrido_de} → ${data.recorrido_a}</div>
  //       </div>
  //       ` : ''}

  /**
   * Convierte datos de permiso al formato unificado
   */
  static fromPermiso(permiso: AsistenciaPermiso): UnifiedData {
    return {
      tipo_documento: 'permiso',
      id: permiso.id_asistencia_permiso,
      codigo: permiso.id_asistencia_permiso,
      nombre_generador: permiso.nombre_generador,
      estado: permiso.estado_permiso,
      fecha_inicio: permiso.fecha_inicio_permiso,
      fecha_fin: permiso.fecha_fin_permiso,
      tipo_permiso: permiso.tipo_permiso_nombre || '',
      observacion: permiso.observacion || '',
      turno_permiso: permiso.turno_permiso,
      tipo_personal: permiso.tipo_personal,
      ci: permiso.ci,
    }
  }

  /**
   * Convierte datos de vacación al formato unificado
   */
  static fromVacacion(vacacion: Vacacion): UnifiedData {
    return {
      tipo_documento: 'vacacion',
      id: vacacion.id_vacacion_solicitado,
      codigo: vacacion.id_vacacion_solicitado,
      nombre_generador: vacacion.nombre_generador || null,
      ci: vacacion.ci,
      nombre_cargo: vacacion.nombre_cargo || null,
      estado: vacacion.estado_vacacion,
      fecha_inicio: vacacion.fecha_vacacion_inicio,
      fecha_fin: vacacion.fecha_vacacion_fin,
      tipo_permiso: vacacion.tipo_solicitud || '',
      nro_correlativo: vacacion.nro_correlativo ?? undefined,
      numero_tramite: vacacion.numero_tramite,
      dias_solicitado: vacacion.dias_solicitado,
      dias_disponible: vacacion.dias_disponible,
      dias_saldo: vacacion.dias_saldo,
      observacion: '',
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
        titulo: 'LICENCIA ESPECIAL',
        subtitulo: 'PERMISO: ' + data.tipo_permiso || 'Permiso',
        icono: 'bi-calendar-check',
        color: 'primary',
      }
    } else if (data.tipo_documento === 'vacacion') {
      return {
        titulo: 'VACACIÓN',
        subtitulo: 'TIPO: ' + data.tipo_permiso,
        icono: 'bi-umbrella',
        color: 'success',
      }
    } else {
      return {
        titulo: 'PERMISO POR HORA',
        subtitulo: 'TIPO: ' + data.tipo_permiso,
        icono: 'bi-briefcase',
        color: 'info',
      }
    }
  }

  static isComision(tipo: string): boolean {
    const tipos = ['COMISIÓN', 'TRANSPORTE']
    return tipos.includes(tipo)
  }
}
