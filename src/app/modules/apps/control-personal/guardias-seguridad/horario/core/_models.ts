export type TurnoInfo = {
  id_turno: number
  nombre: string
  hora_inicio: string
  hora_fin: string
  color: string
}

export type GrupoInfo = {
  id_grupo: number
  nombre: string
  orden: number
  descripcion?: string | null
  miembros: MiembroInfo[]
}

export type MiembroInfo = {
  id_grupo_miembro: number
  id_persona: number
  id_bloque?: number | null
  ci: string
  nombre: string
  paterno: string
  materno: string
  nombre_bloque?: string | null
}

export type AsignacionDia = {
  id_asignacion: number
  id_persona: number
  id_turno: number
  id_bloque?: number | null
  id_grupo?: number | null
  ci: string
  nombre_persona: string
  paterno: string
  materno: string
  nombre_turno: string
  color_turno: string
  nombre_bloque?: string | null
  nombre_grupo?: string | null
  tipo_origen: 'AUTO' | 'MANUAL' | 'EMERGENCIA'
  observacion?: string | null
}

export type DiaSemana = {
  fecha: string
  dia_semana: string
  es_fin_semana: boolean
  asignaciones: Record<string, AsignacionDia> // key: id_persona
}

export type SemanaInfo = {
  fecha_inicio: string
  fecha_fin: string
  posicion_ciclo: number | null
  numero_ciclo: number | null
}

export type HorarioSemanalResponse = {
  semana: SemanaInfo
  configuracion: ConfiguracionCiclo | null
  grupos: GrupoInfo[]
  turnos: TurnoInfo[]
  dias: DiaSemana[]
}

export type ConfiguracionCiclo = {
  id_configuracion?: number
  fecha_inicio_ciclo: string
  descripcion?: string | null
}
