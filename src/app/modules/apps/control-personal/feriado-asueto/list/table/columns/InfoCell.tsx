/* eslint-disable jsx-a11y/anchor-is-valid */
import clsx from 'clsx'
import {FC} from 'react'
import {KTIcon} from '../../../../../../../../_metronic/helpers'
import {FeriadoAsueto} from '../../core/_models'
import Tooltip from '@mui/material/Tooltip'

type Props = {
  feriadoAsueto: FeriadoAsueto
}

const InfoCell: FC<Props> = ({feriadoAsueto}) => {
  // Format dates if they exist
  const formattedEventDate = feriadoAsueto.fecha_evento
    ? new Date(feriadoAsueto.fecha_evento).toLocaleDateString()
    : 'Sin fecha definida'

  const formattedRange = feriadoAsueto.fecha_inicio && feriadoAsueto.fecha_fin
    ? `${new Date(feriadoAsueto.fecha_inicio).toLocaleDateString()} - ${new Date(feriadoAsueto.fecha_fin).toLocaleDateString()}`
    : 'Sin rango definido'

  // Type badge classes
  const typeClass = feriadoAsueto.tipo_evento === 'FERIADO' ? 'badge-light-primary' : 'badge-light-info'

  return (
    <div className='d-flex align-items-center'>
      {/* Icon based on event type */}
      <Tooltip
        title={feriadoAsueto.tipo_evento === 'FERIADO' ? 'Feriado' : 'Asueto'}
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
          <span className={`symbol-label bg-light-${feriadoAsueto.tipo_evento === 'FERIADO' ? 'primary' : 'info'}`}>
            <KTIcon
              iconName={feriadoAsueto.tipo_evento === 'FERIADO' ? 'star' : 'calendar-2'}
              className={`fs-2 text-${feriadoAsueto.tipo_evento === 'FERIADO' ? 'primary' : 'info'}`}
            />
          </span>
        </div>
      </Tooltip>

      <div className='d-flex flex-column'>
        {/* Event name */}
        <a href='#' className='text-gray-800 text-hover-primary fw-bolder mb-1 fs-6'>
          {feriadoAsueto.nombre_evento || 'Evento sin nombre'}
        </a>

        {/* Secondary info row */}
        <div className='d-flex flex-wrap align-items-center'>
          {/* Event date */}
          <span className='text-muted fw-bold me-2'>
            <KTIcon iconName='calendar' className='fs-5 me-1' />
            {formattedEventDate}
          </span>

          {/* Type badge */}
          <span className={clsx('badge', typeClass, 'me-2')}>
            {feriadoAsueto.tipo_evento}
          </span>

          {/* Date range */}
          <span className='text-muted fw-bold me-2'>
            <KTIcon iconName='clock' className='fs-5 me-1' />
            {formattedRange}
          </span>

          {/* Applied to */}
          {feriadoAsueto.aplicado_a && (
            <span className={clsx('badge', {
              'badge-light-success': feriadoAsueto.aplicado_a === 'TODOS',
              'badge-light-primary': feriadoAsueto.aplicado_a === 'MASCULINO',
              'badge-light-danger': feriadoAsueto.aplicado_a === 'FEMENINO'
            })}>
              {feriadoAsueto.aplicado_a}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export {InfoCell}