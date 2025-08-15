import React from 'react'
import useDateFormatter from 'src/app/hooks/useDateFormatter'

const HorarioCell = ({feriadoAsueto}) => {
  const {formatTimeFromString} = useDateFormatter()

  return feriadoAsueto.tipo_evento == 'ASUETO' ? (
    <div className='text-center'>
      <div className='d-inline-flex align-items-center rounded bg-light px-3 py-1 text-center'>
        <span className='text-primary fw-semibold'>
          {formatTimeFromString(feriadoAsueto.hora_inicio)}
        </span>
        <span className='mx-2 text-muted fw-bold'>–</span>
        <span className='text-success fw-semibold'>
          {formatTimeFromString(feriadoAsueto.hora_fin)}
        </span>
      </div>
    </div>
  ) : (
    <div className='text-center'>-</div>
  )
}

export default HorarioCell
