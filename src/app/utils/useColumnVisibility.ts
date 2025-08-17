// hooks/useColumnVisibility.ts
import { useState, useEffect, useCallback, useMemo } from 'react'
import { Column } from 'react-table'

interface ColumnVisibilityConfig {
  id: string
  title: string
  isVisible: boolean
  isRequired: boolean
}

interface UseColumnVisibilityReturn {
  visibleColumns: any[]
  columnConfig: ColumnVisibilityConfig[]
  toggleColumn: (columnId: string) => void
  showAllColumns: () => void
  hideAllOptionalColumns: () => void
  resetToDefaults: () => void
}

// Utilidad para extraer configuración de columnas
const extractColumnConfig = (columns: any[], moduleKey: string): ColumnVisibilityConfig[] => {
  return columns.map((col) => {
    const id = col.id || col.accessor || 'unknown'
    const title = col.Header?.props?.title || col.Header || id
    
    // Columnas que siempre deben estar visibles
    const requiredColumns = ['rowNumber', 'actions']
    const isRequired = requiredColumns.includes(id)
    
    // Obtener visibilidad guardada o usar default
    const savedVisibility = localStorage.getItem(`columnVisibility_${moduleKey}`)
    const savedConfig = savedVisibility ? JSON.parse(savedVisibility) : {}
    const isVisible = savedConfig[id] !== undefined ? savedConfig[id] : true
    
    return {
      id,
      title: typeof title === 'string' ? title : id,
      isVisible,
      isRequired
    }
  })
}

export const useColumnVisibility = (
  originalColumns: readonly Column<any>[],
  moduleKey: string
): UseColumnVisibilityReturn => {
  const [columnConfig, setColumnConfig] = useState<ColumnVisibilityConfig[]>([])

  // Inicializar configuración
  useEffect(() => {
    const config = extractColumnConfig([...originalColumns], moduleKey)
    setColumnConfig(config)
  }, [originalColumns, moduleKey])

  // Guardar en localStorage cuando cambie la configuración
  useEffect(() => {
    if (columnConfig.length > 0) {
      const visibilityMap = columnConfig.reduce((acc, col) => {
        acc[col.id] = col.isVisible
        return acc
      }, {} as Record<string, boolean>)
      
      localStorage.setItem(`columnVisibility_${moduleKey}`, JSON.stringify(visibilityMap))
    }
  }, [columnConfig, moduleKey])

  // Filtrar columnas visibles
//   const visibleColumns = originalColumns.filter((col) => {
//     const id = col.id || col.accessor
//     const config = columnConfig.find(c => c.id === id)
//     return config ? config.isVisible : true
//   })

  const visibleColumns = useMemo(() => {
    return originalColumns.filter((col) => {
      const id = col.id || col.accessor
      const config = columnConfig.find(c => c.id === id)
      return config ? config.isVisible : true
    })
  }, [originalColumns, columnConfig])

  // Funciones de control
  const toggleColumn = useCallback((columnId: string) => {
    setColumnConfig(prev => prev.map(col => 
      col.id === columnId && !col.isRequired
        ? { ...col, isVisible: !col.isVisible }
        : col
    ))
  }, [])

  const showAllColumns = useCallback(() => {
    setColumnConfig(prev => prev.map(col => ({ ...col, isVisible: true })))
  }, [])

  const hideAllOptionalColumns = useCallback(() => {
    setColumnConfig(prev => prev.map(col => 
      col.isRequired ? col : { ...col, isVisible: false }
    ))
  }, [])

  const resetToDefaults = useCallback(() => {
    setColumnConfig(prev => prev.map(col => ({ ...col, isVisible: true })))
  }, [])

  return {
    visibleColumns,
    columnConfig,
    toggleColumn,
    showAllColumns,
    hideAllOptionalColumns,
    resetToDefaults
  }
}