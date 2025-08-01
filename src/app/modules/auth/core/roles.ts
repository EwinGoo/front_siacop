export type RoleKey = 'ADMINISTRADOR' | 'CONTROL_PERSONAL' | 'USUARIO'

export const APP_ROLES = {
  ADMINISTRADOR: 'administrador',
  CONTROL_PERSONAL: 'control_personal',
  USUARIO: 'usuario',
} as const

export type RoleValue = typeof APP_ROLES[RoleKey]
// Función de validación corregida

export const PERMISSION_GROUPS: Record<string, readonly RoleValue[]> = {
  COMISION_MANAGEMENT: [APP_ROLES.ADMINISTRADOR, APP_ROLES.CONTROL_PERSONAL],
  CONFIGURACION: [APP_ROLES.ADMINISTRADOR],
  // ...
} as const
