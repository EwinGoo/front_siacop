import {useAuth} from 'src/app/modules/auth'

export const usePermissions = (estado?: string) => {
  const {hasPermission} = useAuth()

  const canManageComisiones = hasPermission('COMISION_MANAGEMENT')
  const isAdminComision = canManageComisiones
  return {
    isAdminComision,
    canManageComisiones,
  }
}
