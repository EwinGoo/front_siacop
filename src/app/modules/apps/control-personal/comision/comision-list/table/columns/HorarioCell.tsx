import React from 'react'
import useDateFormatter from 'src/app/hooks/useDateFormatter'

interface HorarioCellProps {
  horaSalida: string
  horaRetorno: string
}

const HorarioCell: React.FC<HorarioCellProps> = ({horaSalida, horaRetorno}) => {
  const {formatTimeFromString} = useDateFormatter()

  return (
    <div className='d-inline-flex align-items-center rounded bg-light px-3 py-1'>
      <span className='text-primary fw-semibold'>{formatTimeFromString(horaSalida)}</span>
      <span className='mx-2 text-muted fw-bold'>–</span>
      <span className='text-success fw-semibold'>{formatTimeFromString(horaRetorno)}</span>
    </div>
  )
}

export default HorarioCell
