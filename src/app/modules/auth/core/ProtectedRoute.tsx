import {FC} from 'react'
import {Navigate} from 'react-router-dom'
import {useAuth} from 'src/app/modules/auth'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredPermissions?: string[]
}

export const ProtectedRoute: FC<ProtectedRouteProps> = ({children, requiredPermissions}) => {
  const {hasPermission} = useAuth()

  if (requiredPermissions && !requiredPermissions.every(p => hasPermission(p))) {
    // Redirigir a una página de acceso denegado
    return <Navigate to="/acceso-denegado" replace />
  }

  return <>{children}</>
}
