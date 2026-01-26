import {FC} from 'react'
import {KTIcon} from '../../../../../../../../../_metronic/helpers'
import {TipoPermiso} from '../../core/_models'
import Tooltip from '@mui/material/Tooltip'

type Props = {
  tipoPermiso: TipoPermiso
}

const InfoCell: FC<Props> = ({tipoPermiso}) => {
  // Format created date if exists

  return (
    <div className='d-flex align-items-center'>
      {/* Icon for tipo permiso */}
      <Tooltip
        title="Tipo de Permiso"
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
          <span className='symbol-label bg-light-primary'>
            <KTIcon
              iconName='shield-tick'
              className='fs-2 text-primary'
            />
          </span>
        </div>
      </Tooltip>

      <div className='d-flex flex-column'>
        {/* Main name */}
      <p className='text-gray-800 text-hover-primary fw-bolder mb-1 fs-6'>
          {tipoPermiso.nombre || 'Tipo de permiso sin nombre'}
        </p>
      </div>
    </div>
  )
}

export {InfoCell}