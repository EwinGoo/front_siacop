/* eslint-disable jsx-a11y/anchor-is-valid */
import clsx from 'clsx'
import {FC} from 'react'
import {KTIcon} from '../../../../../../../../../_metronic/helpers'
import {TipoPermiso} from '../../core/_models'
import Tooltip from '@mui/material/Tooltip'

type Props = {
  tipoPermiso: TipoPermiso
}

const InfoCell: FC<Props> = ({tipoPermiso}) => {
  // Format created date if exists
  const formattedDate = tipoPermiso.created_at
    ? new Date(tipoPermiso.created_at).toLocaleDateString()
    : 'Sin fecha'

  // Status badge classes
  const statusClass = tipoPermiso.deleted_at ? 'badge-light-danger' : 'badge-light-success'

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
        <a href='#' className='text-gray-800 text-hover-primary fw-bolder mb-1 fs-6'>
          {tipoPermiso.nombre || 'Tipo de permiso sin nombre'}
        </a>
      </div>
    </div>
  )
}

export {InfoCell}