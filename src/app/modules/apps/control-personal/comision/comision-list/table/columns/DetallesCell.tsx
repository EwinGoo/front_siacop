import React from 'react'
import {Comision} from '../../core/_models'
import Tooltip from '@mui/material/Tooltip'

type Props = {
  comision: Comision
}

const DetallesCell: React.FC<Props> = ({comision}) => {
  const truncateText = (text: string, maxLength: number = 25): string => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
  }

  const detalle =
    comision.tipo_comision === 'TRANSPORTE'
      ? (comision.recorrido_de + ' → ' + comision.recorrido_a)
      : (comision.descripcion_comision || '')

  return (
    <Tooltip
      title={detalle}
      arrow
      placement="top"
      slotProps={{
        tooltip: {
          sx: {
            fontSize: 12,
          },
        },
      }}
    >
      <div className='d-inline-flex flex-col'>
        {comision.tipo_comision === 'TRANSPORTE' ? (
          <span>
            <strong>Recorrido:</strong> {truncateText(detalle)}
          </span>
        ) : (
          <span>
            <strong>Descripción:</strong> {truncateText(detalle)}
          </span>
        )}
      </div>
    </Tooltip>
  )
}

export {DetallesCell}
