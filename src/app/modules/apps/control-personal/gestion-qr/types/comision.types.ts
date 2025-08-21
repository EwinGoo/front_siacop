import {ID} from 'src/_metronic/helpers'
import {Comision} from '../../comision/comision-list/core/_models'
import {TipoPermiso} from '../../permisos/tipos-permisos/list/core/_models'
import {AsistenciaPermisoDetails} from '../../permisos/asistencia-permiso/asistencia-permiso-list/asistencia-permiso-observar-modal/components/AsistenciaPermisoDetails'
import {AsistenciaPermiso} from '../../permisos/asistencia-permiso/asistencia-permiso-list/core/_models'

// }
export interface ComisionActionResponse {
  confirmed: boolean
  action?: string
  observacion?: string
  fechaRecepcion?: string
}

export interface ProcesarComisionParams {
  code: number
  action: 'receive' | 'approve' | 'observe'
  observacion?: string
}

export interface ComisionModalConfig {
  comisionData: Comision
  formatToBolivianDate: (date: string, options?: any) => string
  tipoPermiso?: TipoPermiso
  typeConfig?: {
    serviceName: string
    icon: string
    color: string
    description: string
  }
}

export interface UnifiedData {
  // Campos comunes adaptados
  id: ID
  codigo: ID
  nombre_generador?: string | null
  estado: string
  fecha_inicio: string
  fecha_fin?: string
  descripcion?: string | null
  tipo_documento: 'comision' | 'permiso'

  // Campos específicos de comisión
  nombre_cargo?: string | null
  unidad?: string | null
  recorrido_de?: string
  recorrido_a?: string

  // Campos específicos de permiso
  tipo_permiso_nombre?: string
  turno_permiso?: string
  tipo_personal?: string
  instruccion?: string
  ci?: string
}
