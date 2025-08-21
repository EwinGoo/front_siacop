// DateCell.tsx
import clsx from 'clsx'
import useDateFormatter from '../../../../../../../hooks/useDateFormatter'

export const DateCell = ({comision}) => {
  const {formatLongDate} = useDateFormatter()

  return (
    <div
      className={clsx(
        'bg-light-primary',
        'p-3',
        'rounded',
        'text-gray-800',
        'fw-semibold',
        'text-sm',
        'min-w-250px',
        'd-inline-block',
        'w-auto'
      )}
    >
      {comision.tipo_comision === 'FISIOTERAPIA' ? (
        <>
          <div className='mb-2'>
            <i className='fas fa-calendar-alt text-primary me-2' />
            Inicio: <span className='fw-bold'>{formatLongDate(comision.fecha_comision)}</span>
          </div>
          <div>
            <i className='fas fa-calendar-check text-primary me-2' />
            Fin: <span className='fw-bold'>{formatLongDate(comision.fecha_comision_fin)}</span>
          </div>
        </>
      ) : (
        <div className='mb-2 min-w-100px'>
          <i className='fas fa-calendar-check text-primary me-2' />
          <span className='fw-bold'>{formatLongDate(comision.fecha_comision)}</span>
        </div>
      )}
    </div>
  )
}
