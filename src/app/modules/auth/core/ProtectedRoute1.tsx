import {FC, useMemo} from 'react'
import {Navigate} from 'react-router-dom'
import {Permission} from './roles/permissions'
import { useAuth } from './Auth'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredPermissions?: Permission[]
  requireAll?: boolean
}

export const ProtectedRoute: FC<ProtectedRouteProps> = ({
  children, 
  requiredPermissions,
  requireAll = false
}) => {
  // const {hasAnyPermission, hasAllPermissions} = useAuth()
  // const {hasAnyPermission, hasAllPermissions} = null;

  // const hasAccess = useMemo(() => {
  //   if (!requiredPermissions || requiredPermissions.length === 0) {
  //     return true
  //   }
    
  //   return requireAll 
  //     ? hasAllPermissions(requiredPermissions)
  //     : hasAnyPermission(requiredPermissions)
  // }, [requiredPermissions, requireAll, hasAllPermissions, hasAnyPermission])
 
  // if (!hasAccess) {
  if (!true) {
    return <Navigate to="/acceso-denegado" replace />
  }
 
  return <>{children}</>
}