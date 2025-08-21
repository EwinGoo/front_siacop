import { useMemo } from "react"
import { useAuth } from "./Auth"
import { RoleValue } from "./roles"
import { ROLE_PERMISSIONS } from "./roles/roleDefinitions"
import { PERMISSIONS } from "./roles/permissions"

export const usePermissions = (estado?: string) => {
  const {currentUser} = useAuth()

  return useMemo(() => {
    if (!currentUser?.groups) {
      return {
        isAdminComision: false,
        canManageComisiones: false,
      }
    }

    // ✅ Cálculo directo sin usar funciones del contexto
    const userPermissions = currentUser.groups.flatMap(
      (role) => ROLE_PERMISSIONS[role as RoleValue] || []
    )

    const comisionPermissions = [
      PERMISSIONS.COMISION.VIEW,
      PERMISSIONS.COMISION.CREATE,
      PERMISSIONS.COMISION.EDIT,
      PERMISSIONS.COMISION.DELETE,
    ]

    const canManageComisiones = comisionPermissions.some((permission) =>
      userPermissions.includes(permission)
    )

    return {
      isAdminComision: canManageComisiones,
      canManageComisiones,
    }
  }, [currentUser?.groups]) // ✅ Dependencia simple
}