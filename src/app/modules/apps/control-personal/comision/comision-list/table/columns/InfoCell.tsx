/* eslint-disable jsx-a11y/anchor-is-valid */
import clsx from 'clsx'
import {FC} from 'react'
import {KTIcon} from '../../../../../../../../_metronic/helpers'
import {Comision} from '../../core/_models'
import Tooltip, {TooltipProps, tooltipClasses} from '@mui/material/Tooltip'
type Props = {
  comision: Comision
}

const InfoCell: FC<Props> = ({comision}) => {
  // Format date if exists
  const formattedDate = comision.fecha_comision
    ? new Date(comision.fecha_comision).toLocaleDateString()
    : 'Sin fecha'

  // Status badge classes
  const statusClass =
    comision.estado_boleta_comision === 'APROBADO' ? 'badge-light-success' : 'badge-light-warning'

  return (
    <div className='d-flex align-items-center'>
      {/* Icon based on commission type */}
      <Tooltip
        title={comision.tipo_comision}
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
          <span
            className={`symbol-label bg-light-${
              comision.tipo_comision === 'PERSONAL'
                ? 'info'
                : comision.tipo_comision === 'TRANSPORTE'
                ? 'primary'
                : 'secondary' // Para CAJA SALUD
            }`}
          >
            {comision.tipo_comision === 'PERSONAL' ? (
              <KTIcon iconName='briefcase' className='fs-2 text-info' />
            ) : comision.tipo_comision === 'TRANSPORTE' ? (
              <KTIcon iconName='truck' className='fs-2 text-primary' />
            ) : (
              <i className='fas fa-hospital fs-2'  style={{ color: '#f3779eff' }}></i> // CAJA SALUD
            )}
          </span>
        </div>
      </Tooltip>

      <div className='d-flex flex-column'>
        {/* Main description */}
        <a href='#' className='text-gray-800 text-hover-primary fw-bolder mb-1 fs-6'>
          {comision.tipo_comision || 'Comisión sin descripción'}
        </a>

        {/* Secondary info row */}
        <div className='d-flex flex-wrap align-items-center'>
          {/* Date */}
          {/* <span className='text-muted fw-bold me-2'>
            <KTIcon iconName='calendar' className='fs-5 me-1' />
            {formattedDate}
          </span> */}

          {/* Status badge */}
          {/* <span className={clsx('badge', statusClass, 'me-2')}>
            {comision.estado_boleta_comision}
          </span> */}

          {/* Route info */}
          {/* {comision.recorrido_de && comision.recorrido_a && (
            <span className='text-muted fw-bold'>
              <KTIcon iconName='arrow-right' className='fs-5 mx-1' />
              {comision.recorrido_de} → {comision.recorrido_a}
            </span>
          )} */}
        </div>
      </div>
    </div>
  )
}

export {InfoCell}
