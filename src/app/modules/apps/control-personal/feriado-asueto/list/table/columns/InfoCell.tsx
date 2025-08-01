import {FC} from 'react'
import {KTIcon} from '../../../../../../../../_metronic/helpers'
import {FeriadoAsueto} from '../../core/_models'
import Tooltip from '@mui/material/Tooltip'

type Props = {
  feriadoAsueto: FeriadoAsueto
}

const InfoCell: FC<Props> = ({feriadoAsueto}) => {

  return (
    <div className='d-flex align-items-center'>
      {/* Icono basada segun evento */}
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
        {/* Nombre de evento */}
        <a href='#' className='text-gray-800 text-hover-primary fw-bolder mb-1 fs-6'>
          {feriadoAsueto.nombre_evento || 'Evento sin nombre'}
        </a>
      </div>
    </div>
  )
}

export {InfoCell}