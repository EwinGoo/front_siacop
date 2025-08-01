import React from 'react'
import {AsistenciaPermiso} from '../../core/_models'
import Tooltip from '@mui/material/Tooltip'

type Props = {
  asistenciaComision: AsistenciaPermiso
}

const DetallesCell: React.FC<Props> = ({asistenciaComision}) => {
  const truncateText = (text: string, maxLength: number = 25): string => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
  }

  const detalle = truncateText(asistenciaComision.detalle_permiso, 30)
  return (
    <Tooltip
      title={detalle}
      arrow
      placement='top'
      slotProps={{
        tooltip: {
          sx: {
            fontSize: 12,
          },
        },
      }}
    >
      <div className="d-inline-flex flex-col">{detalle}</div>
    </Tooltip>
  )
}

export {DetallesCell}
