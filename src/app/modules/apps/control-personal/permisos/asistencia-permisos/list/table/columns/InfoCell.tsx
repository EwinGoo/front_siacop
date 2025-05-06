/* eslint-disable jsx-a11y/anchor-is-valid */
import clsx from 'clsx'
import {FC} from 'react'
import {KTIcon} from '../../../../../../../../../_metronic/helpers'
import {AsistenciaPermiso} from '../../core/_models'
import Tooltip from '@mui/material/Tooltip'

type Props = {
  asistenciaPermiso: AsistenciaPermiso
}

const InfoCell: FC<Props> = ({asistenciaPermiso}) => {
  // Format dates
  const formatDate = (dateString: string | null | undefined): string => {
    if (!dateString) return 'Sin fecha'
    try {
      return new Date(dateString).toLocaleDateString()
    } catch {
      return 'Fecha inválida'
    }
  }

  const fechaInicio = formatDate(asistenciaPermiso.fecha_inicio_permiso)
  const fechaFin = formatDate(asistenciaPermiso.fecha_fin_permiso)

  // Status badge classes
  const statusClass = asistenciaPermiso.estado_permiso === 'APROBADO' 
    ? 'badge-light-success' 
    : 'badge-light-warning'

  return (
    <div className='d-flex align-items-center'>
      {/* Icon for permiso */}
      <Tooltip
        title="Solicitud de Permiso"
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
              iconName='profile-user'
              className='fs-2 text-primary'
            />
          </span>
        </div>
      </Tooltip>

      <div className='d-flex flex-column'>
        {/* Main info - Persona ID */}
        <a href='#' className='text-gray-800 text-hover-primary fw-bolder mb-1 fs-6'>
          Persona ID: {asistenciaPermiso.nombre_generador || 'No especificado'}
        </a>

        {/* Secondary info row */}
        <div className='d-flex flex-wrap align-items-center'>
          {/* Date range */}
          <span className='text-muted fw-bold me-2'>
            <KTIcon iconName='calendar' className='fs-5 me-1' />
            {fechaInicio} - {fechaFin}
          </span>

          {/* Status badge */}
          <span className={clsx('badge', statusClass, 'me-2')}>
            {asistenciaPermiso.estado_permiso === 'APROBADO' ? 'Aprobado' : 'Pendiente'}
          </span>

          {/* Description preview */}
          {asistenciaPermiso.detalle_permiso && (
            <Tooltip title={asistenciaPermiso.detalle_permiso} arrow>
              <span className='text-muted fw-bold'>
                <KTIcon iconName='document' className='fs-5 mx-1' />
                {asistenciaPermiso.detalle_permiso.substring(0, 30)}...
              </span>
            </Tooltip>
          )}
        </div>
      </div>
    </div>
  )
}

export {InfoCell}