// roles/permissions.ts - Agregar mapeo específico para comisiones

import { APP_ROLES, RoleValue } from "../roles"
import { Permission, PERMISSIONS } from "./permissions"

export const ROLE_PERMISSIONS: Record<RoleValue, Permission[]> = {
  [APP_ROLES.ADMINISTRADOR]: [
    // Administrador tiene todos los permisos de comisión
    PERMISSIONS.COMISION.VIEW,
    PERMISSIONS.COMISION.VIEW_FULL_ACCESS,
    PERMISSIONS.COMISION.CREATE,
    PERMISSIONS.COMISION.EDIT,
    PERMISSIONS.COMISION.DELETE,
    // Otros permisos...
    PERMISSIONS.ASISTENCIA_PERMISO.VIEW,
    PERMISSIONS.ASISTENCIA_PERMISO.CREATE,
    PERMISSIONS.ASISTENCIA_PERMISO.EDIT,
    PERMISSIONS.ASISTENCIA_PERMISO.DELETE,
    PERMISSIONS.DECLARATORIA_COMISION.VIEW,
    PERMISSIONS.DECLARATORIA_COMISION.CREATE,
    PERMISSIONS.TIPO_PERMISO.VIEW,
    PERMISSIONS.TIPO_PERMISO.MANAGE,
    PERMISSIONS.FERIADO_ASUETO.VIEW,
    PERMISSIONS.FERIADO_ASUETO.MANAGE,
    PERMISSIONS.GESTION_QR.VIEW,
  ],
  
  [APP_ROLES.CONTROL_PERSONAL]: [
    // Control Personal puede aprobar y gestionar comisiones
    PERMISSIONS.COMISION.VIEW,
    PERMISSIONS.COMISION.VIEW_FULL_ACCESS,
    PERMISSIONS.COMISION.CREATE,
    PERMISSIONS.COMISION.EDIT,
    PERMISSIONS.COMISION.DELETE,
    // Otros permisos...
    PERMISSIONS.ASISTENCIA_PERMISO.VIEW,
    PERMISSIONS.ASISTENCIA_PERMISO.CREATE,
    PERMISSIONS.ASISTENCIA_PERMISO.EDIT,
    PERMISSIONS.DECLARATORIA_COMISION.VIEW,
    PERMISSIONS.DECLARATORIA_COMISION.CREATE,
    PERMISSIONS.TIPO_PERMISO.VIEW,
    PERMISSIONS.FERIADO_ASUETO.VIEW,
    PERMISSIONS.GESTION_QR.VIEW,
  ],
  
  [APP_ROLES.ADMINISTRATIVO]: [
    // Administrativos solo pueden crear y ver sus propias comisiones
    PERMISSIONS.COMISION.VIEW,
    PERMISSIONS.COMISION.CREATE,
    // NO tienen EDIT, DELETE, ni VIEW_FULL_ACCESS para aprobar
    PERMISSIONS.ASISTENCIA_PERMISO.VIEW,
    PERMISSIONS.ASISTENCIA_PERMISO.CREATE,
  ],
  
  [APP_ROLES.SECRETARIA_RRHH]: [
    PERMISSIONS.DECLARATORIA_COMISION.VIEW,
    PERMISSIONS.DECLARATORIA_COMISION.CREATE,
  ],
  
  [APP_ROLES.PERSONAL_UPEA]: [],
  [APP_ROLES.USUARIO]: [],
}

// Función para verificar si un usuario puede gestionar (aprobar/reportes)
export const canManageComisiones = (userRoles: string[]): boolean => {
  return userRoles.some(role => 
    role === APP_ROLES.ADMINISTRADOR || role === APP_ROLES.CONTROL_PERSONAL
  )
}

// Función para verificar permisos específicos
export const hasPermission = (userRoles: string[], permission: Permission): boolean => {
  return userRoles.some(role => {
    const rolePermissions = ROLE_PERMISSIONS[role as RoleValue]
    return rolePermissions?.includes(permission) || false
  })
}