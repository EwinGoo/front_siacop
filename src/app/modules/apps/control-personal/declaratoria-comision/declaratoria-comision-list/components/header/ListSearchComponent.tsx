// Modificación para ListSearchComponent.tsx
import React from 'react'
import { useEffect, useState } from 'react'
import { initialQueryState, KTIcon, useDebounce } from '../../../../../../../../_metronic/helpers'
import { useQueryRequest } from '../../core/QueryRequestProvider'
import { ColumnVisibilitySelector } from 'src/app/components/ColumnVisibilitySelector'

interface ListSearchComponentProps {
  // Props para el selector de columnas
  columnConfig?: Array<{
    id: string
    title: string
    isVisible: boolean
    isRequired: boolean
  }>
  onToggleColumn?: (columnId: string) => void
  onShowAllColumns?: () => void
  onHideAllColumns?: () => void
  onResetColumns?: () => void
}

const ListSearchComponent: React.FC<ListSearchComponentProps> = ({
  columnConfig,
  onToggleColumn,
  onShowAllColumns,
  onHideAllColumns,
  onResetColumns
}) => {
  const { updateState } = useQueryRequest()
  const [searchTerm, setSearchTerm] = useState<string>('')
  const debouncedSearchTerm = useDebounce(searchTerm, 150)

  // useEffect(() => {
  //   if (debouncedSearchTerm !== undefined && searchTerm !== undefined) {
  //     updateState({ search: debouncedSearchTerm, ...initialQueryState })
  //   }
  // }, [debouncedSearchTerm])

  const columnVisibilityConfig = (window as any).columnVisibilityConfig

  useEffect(() => {
    if (debouncedSearchTerm !== undefined && searchTerm !== undefined) {
      updateState({ search: debouncedSearchTerm, ...initialQueryState })
    }
  }, [debouncedSearchTerm])

// setTimeout(()=>{
// console.log(columnVisibilityConfig);

// },1000)


  return (
    <div className='card-title'>
      <div className='d-flex align-items-center gap-3'>
        {/* Selector de columnas */}
        {columnVisibilityConfig &&  (
          <ColumnVisibilitySelector
            columnConfig={columnVisibilityConfig.columnConfig}
            onToggleColumn={columnVisibilityConfig.toggleColumn}
            onShowAll={columnVisibilityConfig.showAllColumns}
            onHideAll={columnVisibilityConfig.hideAllOptionalColumns}
            onReset={columnVisibilityConfig.resetToDefaults}
          />
        )}

        {/* Search existente */}
        <div className='d-flex align-items-center position-relative'>
          <KTIcon iconName='magnifier' className='fs-1 position-absolute ms-6' />
          <input
            type='text'
            data-kt-user-table-filter='search'
            className='form-control form-control-solid w-250px ps-14'
            placeholder='Buscar ...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
    </div>
  )
}

export { ListSearchComponent }