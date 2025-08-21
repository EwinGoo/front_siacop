// core/ProtectedRoute.tsx (versión actualizada)
import {FC, memo} from 'react'
import {Navigate} from 'react-router-dom'
import {useAuth} from './Auth'
import {Permission} from './roles/permissions'

interface ProtectedRouteProps {
  children: React.ReactNode
  // Para compatibilidad con el sistema anterior
  requiredPermissions?: string[]
  // Nuevo sistema con permisos específicos
  requiredSpecificPermissions?: Permission[]
  // Opciones para controlar el comportamiento
  requireAllPermissions?: boolean // true = AND, false = OR (default: true)
  fallbackPath?: string // Ruta de redirección (default: '/acceso-denegado')
  excludeDocenteAdministrativo?: boolean // Nueva prop
}

export const ProtectedRoute: FC<ProtectedRouteProps> = memo(
  ({
    children,
    requiredPermissions, // Legacy
    requiredSpecificPermissions, // Nuevo sistema
    requireAllPermissions = true,
    fallbackPath = '/acceso-denegado',
    excludeDocenteAdministrativo = false,
  }) => {
    const {hasPermission, hasAllSpecificPermissions, hasAnySpecificPermission, currentUser} =
      useAuth()

    // Si usa el sistema legacy
    // if (requiredPermissions?.length) {
    //   const hasAccess = requireAllPermissions
    //     ? requiredPermissions.every(p => hasPermission(p as keyof typeof import('./roles').PERMISSION_GROUPS))
    //     : requiredPermissions.some(p => hasPermission(p as keyof typeof import('./roles').PERMISSION_GROUPS))

    //   if (!hasAccess) {
    //     return <Navigate to={fallbackPath} replace />
    //   }
    // }

    // Si usa el nuevo sistema de permisos específicos
    // console.log(hasAllSpecificPermissions(requiredSpecificPermissions!));

    if (excludeDocenteAdministrativo && currentUser) {
      const isDocente = currentUser.personal?.tipo_personal === 'DOCENTE'
      const isAdministrativo = currentUser.groups?.includes('administrativo')
      

      if (isDocente && isAdministrativo) {
        return <Navigate to='/acceso-denegado' replace />
      }
    }  

    if (requiredSpecificPermissions?.length) {
      const hasAccess = requireAllPermissions
        ? hasAllSpecificPermissions(requiredSpecificPermissions)
        : hasAnySpecificPermission(requiredSpecificPermissions)

      if (!hasAccess) {
        return <Navigate to={fallbackPath} replace />
      }
    }

    return <>{children}</>
  }
)

ProtectedRoute.displayName = 'ProtectedRoute'

// Componente helper para proteger componentes inline
interface PermissionGuardProps {
  children: React.ReactNode
  permissions: Permission[]
  requireAll?: boolean
  fallback?: React.ReactNode
}

export const PermissionGuard: FC<PermissionGuardProps> = memo(
  ({children, permissions, requireAll = true, fallback = null}) => {
    const {hasAllSpecificPermissions, hasAnySpecificPermission} = useAuth()

    const hasAccess = requireAll
      ? hasAllSpecificPermissions(permissions)
      : hasAnySpecificPermission(permissions)

    return hasAccess ? <>{children}</> : <>{fallback}</>
  }
)

PermissionGuard.displayName = 'PermissionGuard'

// Hook para usar en componentes cuando necesites lógica condicional
export const useRoutePermissions = (permissions: Permission[], requireAll = true) => {
  const {hasAllSpecificPermissions, hasAnySpecificPermission} = useAuth()

  return requireAll ? hasAllSpecificPermissions(permissions) : hasAnySpecificPermission(permissions)
}
