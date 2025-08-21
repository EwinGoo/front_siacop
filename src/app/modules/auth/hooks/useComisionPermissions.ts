import { usePermissions } from "./usePermissions"

// Hook específico para compatibilidad con código existente
export const useComisionPermissions = () => {
  const { comision } = usePermissions()
  
  return {
    isAdminComision: comision.canManage,
    canManageComisiones: comision.canManage,
    canViewComisiones: comision.canView,
    canCreateComisiones: comision.canCreate,
    canEditComisiones: comision.canEdit,
    canDeleteComisiones: comision.canDelete,
  }
}