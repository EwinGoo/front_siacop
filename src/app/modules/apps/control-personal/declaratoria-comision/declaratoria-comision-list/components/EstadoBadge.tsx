import React from 'react'

type Props = {
  estado: string
}

const estadoStyles: Record<string, string> = {
  GENERADO: 'warning',
  EMITIDO: 'success',
  ANULADO: 'danger',
}

const EstadoBadge: React.FC<Props> = ({estado}) => {
  const color = estadoStyles[estado] || 'light'
  return <span className={`badge badge-light-${color}`}>{estado}</span>
}

export {EstadoBadge}
