/* eslint-disable jsx-a11y/anchor-is-valid */
import clsx from 'clsx'
import {FC} from 'react'
import {KTIcon} from '../../../../../../../../_metronic/helpers'
import {Comision} from '../../core/_models'
import Tooltip, {TooltipProps, tooltipClasses} from '@mui/material/Tooltip'

type Props = {
  comision: Comision
}

// Mapeo de iconos por nombre de tipo de permiso
const iconMapping: Record<string, {icon: string, color: string, bgColor: string, isKTIcon: boolean}> = {
  'PERSONAL': {
    icon: 'briefcase',
    color: 'text-info',
    bgColor: 'bg-light-info',
    isKTIcon: true
  },
  'TRANSPORTE': {
    icon: 'truck',
    color: 'text-primary',
    bgColor: 'bg-light-primary',
    isKTIcon: true
  },
  'CAJA SALUD': {
    icon: 'hospital',
    color: '#f3779eff',
    bgColor: 'bg-light-danger',
    isKTIcon: false
  },
  'FISIOTERAPIA': {
    icon: 'hand-holding-medical',
    color: '#f3779eff',
    bgColor: 'bg-light-danger',
    isKTIcon: false
  },
  'CAPACITACION': {
    icon: 'graduation-cap',
    color: 'text-success',
    bgColor: 'bg-light-success',
    isKTIcon: true
  },
  'REUNION': {
    icon: 'users',
    color: 'text-dark',
    bgColor: 'bg-light-dark',
    isKTIcon: true
  },
  'TRAMITE': {
    icon: 'file-text',
    color: 'text-warning',
    bgColor: 'bg-light-warning',
    isKTIcon: true
  },
  'OTROS': {
    icon: 'gear',
    color: 'text-secondary',
    bgColor: 'bg-light-secondary',
    isKTIcon: true
  }
}

const InfoCell: FC<Props> = ({comision}) => {
  // Format date if exists
  const formattedDate = comision.fecha_comision
    ? new Date(comision.fecha_comision).toLocaleDateString()
    : 'Sin fecha'

  // Status badge classes
  const statusClass =
    comision.estado_boleta_comision === 'APROBADO' ? 'badge-light-success' : 'badge-light-warning'

  // Get the permission type name (usar nombre_permiso en lugar de tipo_comision)
  const tipoPermiso = comision.tipo_comision || 'OTROS'
  
  // Get icon configuration for the permission type
  const iconConfig = iconMapping[tipoPermiso.toUpperCase()] || iconMapping['OTROS']

  // Function to render the appropriate icon
  const renderIcon = () => {
    if (iconConfig.isKTIcon) {
      return (
        <KTIcon 
          iconName={iconConfig.icon} 
          className={`fs-2 ${iconConfig.color}`} 
        />
      )
    } else {
      return (
        <i 
          className={`fas fa-${iconConfig.icon} fs-2`}
          style={{ color: iconConfig.color }}
        />
      )
    }
  }

  return (
    <div className='d-flex align-items-center'>
      {/* Icon based on permission type */}
      <Tooltip
        title={`Tipo: ${tipoPermiso}`}
        arrow
        slotProps={{
          tooltip: {
            sx: {
              fontSize: 11,
            },
          },
        }}
      >
        <div className='symbol symbol-50px me-5'>
          <span className={`symbol-label ${iconConfig.bgColor}`}>
            {renderIcon()}
          </span>
        </div>
      </Tooltip>

      <div className='d-flex flex-column'>
        {/* Main description - mostrar el nombre del tipo de permiso */}
        <a href='#' className='text-gray-800 text-hover-primary fw-bolder mb-1 fs-6'>
          {tipoPermiso || 'Permiso sin descripción'}
        </a>
      </div>
    </div>
  )
}

export {InfoCell}