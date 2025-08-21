// components/ColumnVisibilitySelector.tsx
import React, { useState, useRef, useEffect } from 'react'
import { KTIcon } from 'src/_metronic/helpers'

interface ColumnVisibilitySelectorProps {
  columnConfig: Array<{
    id: string
    title: string
    isVisible: boolean
    isRequired: boolean
  }>
  onToggleColumn: (columnId: string) => void
  onShowAll: () => void
  onHideAll: () => void
  onReset: () => void
}

const ColumnVisibilitySelector: React.FC<ColumnVisibilitySelectorProps> = ({
  columnConfig,
  onToggleColumn,
  onShowAll,
  onHideAll,
  onReset
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const visibleCount = columnConfig.filter(col => col.isVisible).length
  const totalCount = columnConfig.length

  return (
    <div className="position-relative" ref={dropdownRef}>
      {/* Botón trigger */}
      <button
        type="button"
        className={`btn btn-light d-flex align-items-center ${isOpen ? 'active' : ''}`}
        style={{width:'26px',padding:'15px 0'}}
        onClick={() => setIsOpen(!isOpen)}
        title="Configurar columnas visibles"
      >
        <KTIcon iconName="setting-2" className="ms-2 fs-8 h-5" />
        {/* <span className="badge badge-circle badge-light-primary ms-2 fs-8">
          {visibleCount}
        </span> */}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div 
          className="menu menu-sub menu-sub-dropdown w-300px show"
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            zIndex: 1050,
            marginTop: '0.5rem'
          }}
        >
          <div className="px-7 py-5">
            {/* Header */}
            <div className="fs-5 text-dark fw-bolder mb-4 d-flex align-items-center justify-content-between">
              <span>Columnas Visibles</span>
              <span className="badge badge-light-primary">
                {visibleCount}/{totalCount}
              </span>
            </div>

            {/* Acciones rápidas */}
            {/* <div className="d-flex gap-2 mb-4">
              <button
                type="button"
                className="btn btn-light btn-sm flex-fill"
                onClick={onShowAll}
              >
                <KTIcon iconName="check-square" className="fs-6 me-1" />
                Mostrar Todo
              </button>
              <button
                type="button"
                className="btn btn-light btn-sm flex-fill"
                onClick={onHideAll}
              >
                <KTIcon iconName="minus-square" className="fs-6 me-1" />
                Ocultar Todo
              </button>
            </div> */}

            {/* Lista de columnas */}
            <div className="scroll-y mh-300px">
              {columnConfig.map((column) => (
                <div
                  key={column.id}
                  className="d-flex align-items-center py-2 px-3 rounded mb-1 cursor-pointer hover-light-primary"
                  onClick={() => !column.isRequired && onToggleColumn(column.id)}
                >
                  <div className="form-check form-check-custom form-check-solid me-3">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={column.isVisible}
                      disabled={column.isRequired}
                      onChange={() => !column.isRequired && onToggleColumn(column.id)}
                    />
                  </div>
                  
                  <div className="flex-grow-1">
                    <span className={`fw-semibold ${column.isRequired ? 'text-muted' : 'text-dark'}`}>
                      {column.title}
                    </span>
                    {column.isRequired && (
                      <span className="badge badge-light-warning ms-2 fs-8">
                        Obligatorio
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="pt-4 border-top">
              <button
                type="button"
                className="btn btn-light btn-sm w-100"
                onClick={onReset}
              >
                <KTIcon iconName="arrow-counterclockwise" className="fs-6 me-2" />
                Restaurar Predeterminado
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export { ColumnVisibilitySelector }