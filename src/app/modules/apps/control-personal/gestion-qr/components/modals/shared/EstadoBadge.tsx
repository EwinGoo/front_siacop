import React from 'react'
import {estadoStyles} from '../../../types'

interface Props {
  estado: string
}

const EstadoBadge: React.FC<Props> = ({estado}) => {
  const color = estadoStyles[estado.toUpperCase()] || 'secondary'
  return (
    <span className={`badge badge-light-${color} fs-7`}>
      <i className='bi bi-circle-fill me-1 fs-8 text-secondary'></i>
      {estado}
    </span>
  )
}

export default EstadoBadge
