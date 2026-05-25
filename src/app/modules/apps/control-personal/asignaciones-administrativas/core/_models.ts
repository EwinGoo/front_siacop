export type TipoContratacion =
  | 'CONVOCATORIA'
  | 'DESIGNACION'
  | 'CONTRATO'
  | 'HONORARIOS'

export type PersonaAsignacionAdministrativa = {
  ci?: string | null
  nombre?: string | null
  paterno?: string | null
  materno?: string | null
}

export type AsignacionAdministrativa = {
  id_asignacion_administrativo?: number
  id_persona_administrativo: number | ''
  id_poa: number | ''
  id_nivel?: number | '' | null
  id_tipo_horario?: number | '' | null
  fecha_inicio_asignacion_administrativo?: string | null
  fecha_fin_asignacion_administrativo?: string | null
  numero_memorandum?: string | null
  fecha_creacion_memorandum?: string | null
  tipo_contratacion?: TipoContratacion | '' | null
  codigo_cargo?: string | null
  url_memorandum?: string | null
  estado_asignacion_administrativo?: boolean
  fecha_finalizacion_asignacion?: string | null
  detalle_finalizacion_asignacion?: string | null
  fecha_creacion_asignacion_administrativo?: string | null
  persona?: PersonaAsignacionAdministrativa
}

export type AsignacionAdministrativaListResponse = {
  data: AsignacionAdministrativa[]
  pagination: {
    page: number
    items_per_page: number
    total: number
  }
}

export const initialAsignacionAdministrativa: AsignacionAdministrativa = {
  id_persona_administrativo: '',
  id_poa: '',
  id_nivel: '',
  id_tipo_horario: '',
  fecha_inicio_asignacion_administrativo: '',
  fecha_fin_asignacion_administrativo: '',
  numero_memorandum: '',
  fecha_creacion_memorandum: '',
  tipo_contratacion: 'DESIGNACION',
  codigo_cargo: '',
  url_memorandum: '',
  estado_asignacion_administrativo: true,
  fecha_finalizacion_asignacion: '',
  detalle_finalizacion_asignacion: '',
}
