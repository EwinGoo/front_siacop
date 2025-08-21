// hooks/usePermissions.ts
import { useMemo } from 'react'
import { useAuth } from '../core/Auth'
import { Permission, PERMISSIONS } from '../core/roles/permissions'
import { ROLE_PERMISSIONS } from '../core/roles/roleDefinitions'

export const usePermissions = () => {
  const { currentUser } = useAuth()

  // Memoizar los permisos del usuario para evitar recálculos innecesarios
  const userPermissions = useMemo(() => {
    if (!currentUser?.groups?.length) return new Set<Permission>()
    
    const permissions = new Set<Permission>()
    
    // Obtener todos los permisos de todos los roles del usuario
    currentUser.groups.forEach(role => {
      const rolePermissions = ROLE_PERMISSIONS[role]
      if (rolePermissions) {
        rolePermissions.forEach(permission => permissions.add(permission))
      }
    })
    
    return permissions
  }, [currentUser?.groups])

  // Función optimizada para verificar permisos individuales
  const hasPermission = (permission: Permission): boolean => {
    return userPermissions.has(permission)
  }

  // Función para verificar múltiples permisos (AND)
  const hasAllPermissions = (permissions: Permission[]): boolean => {
    return permissions.every(permission => userPermissions.has(permission))
  }

  // Función para verificar al menos uno de varios permisos (OR)
  const hasAnyPermission = (permissions: Permission[]): boolean => {
    return permissions.some(permission => userPermissions.has(permission))
  }

  // Permisos específicos memoizados para módulos principales
  const modulePermissions = useMemo(() => ({
    // Asistencia y Permisos
    asistenciaPermiso: {
      canView: userPermissions.has(PERMISSIONS.ASISTENCIA_PERMISO.VIEW),
      canCreate: userPermissions.has(PERMISSIONS.ASISTENCIA_PERMISO.CREATE),
      canEdit: userPermissions.has(PERMISSIONS.ASISTENCIA_PERMISO.EDIT),
      canDelete: userPermissions.has(PERMISSIONS.ASISTENCIA_PERMISO.DELETE),
      canManage: userPermissions.has(PERMISSIONS.ASISTENCIA_PERMISO.CREATE) || 
                 userPermissions.has(PERMISSIONS.ASISTENCIA_PERMISO.EDIT) ||
                 userPermissions.has(PERMISSIONS.ASISTENCIA_PERMISO.DELETE)
    },
    
    // Comisiones
    comision: {
      canView: userPermissions.has(PERMISSIONS.COMISION.VIEW),
      canCreate: userPermissions.has(PERMISSIONS.COMISION.CREATE),
      canEdit: userPermissions.has(PERMISSIONS.COMISION.EDIT),
      canDelete: userPermissions.has(PERMISSIONS.COMISION.DELETE),
      canManage: userPermissions.has(PERMISSIONS.COMISION.CREATE) || 
                 userPermissions.has(PERMISSIONS.COMISION.EDIT) ||
                 userPermissions.has(PERMISSIONS.COMISION.DELETE)
    },
    
    // Declaratoria de Comisión
    declaratoriaComision: {
      canView: userPermissions.has(PERMISSIONS.DECLARATORIA_COMISION.VIEW),
      canCreate: userPermissions.has(PERMISSIONS.DECLARATORIA_COMISION.CREATE),
      canEdit: userPermissions.has(PERMISSIONS.DECLARATORIA_COMISION.EDIT),
      canDelete: userPermissions.has(PERMISSIONS.DECLARATORIA_COMISION.DELETE),
      canManage: userPermissions.has(PERMISSIONS.DECLARATORIA_COMISION.CREATE) || 
                 userPermissions.has(PERMISSIONS.DECLARATORIA_COMISION.EDIT) ||
                 userPermissions.has(PERMISSIONS.DECLARATORIA_COMISION.DELETE)
    },
    
    // Tipos de Permiso
    tipoPermiso: {
      canView: userPermissions.has(PERMISSIONS.TIPO_PERMISO.VIEW),
      canManage: userPermissions.has(PERMISSIONS.TIPO_PERMISO.MANAGE)
    },
    
    // Feriados y Asuetos
    feriadoAsueto: {
      canView: userPermissions.has(PERMISSIONS.FERIADO_ASUETO.VIEW),
      canManage: userPermissions.has(PERMISSIONS.FERIADO_ASUETO.MANAGE)
    },
    
    // Gestión QR
    gestionQr: {
      canView: userPermissions.has(PERMISSIONS.GESTION_QR.VIEW)
    }
  }), [userPermissions])

  return {
    hasPermission,
    hasAllPermissions,
    hasAnyPermission,
    userPermissions: Array.from(userPermissions),
    ...modulePermissions
  }
}