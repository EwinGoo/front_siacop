export type RoleKey =
  | 'ADMINISTRADOR'
  | 'CONTROL_PERSONAL'
  | 'USUARIO'
  | 'PERSONAL_UPEA'
  | 'ADMINISTRATIVO'
  | 'SECRETARIA_RRHH'

export const APP_ROLES = {
  ADMINISTRADOR: 'administrador',
  CONTROL_PERSONAL: 'control_personal',
  USUARIO: 'usuario',
  PERSONAL_UPEA: 'personal_upea',
  ADMINISTRATIVO: 'administrativo',
  SECRETARIA_RRHH: 'secretaria_rrhh',
} as const

export type RoleValue = typeof APP_ROLES[RoleKey]
// Función de validación corregida

export const PERMISSION_GROUPS: Record<string, readonly RoleValue[]> = {
  CONTROL_PERSONAL: [APP_ROLES.CONTROL_PERSONAL],
  ADMINISTRATIVO: [APP_ROLES.ADMINISTRATIVO],
  COMISION_MANAGEMENT: [APP_ROLES.ADMINISTRADOR, APP_ROLES.CONTROL_PERSONAL],
  CONFIGURACION: [APP_ROLES.ADMINISTRADOR],
  SECRETARIA_RRHH: [APP_ROLES.CONTROL_PERSONAL,APP_ROLES.SECRETARIA_RRHH],
  // ...
} as const
