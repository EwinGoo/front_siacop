import useDateFormatter from 'src/app/hooks/useDateFormatter'
import clsx from 'clsx'

export const DateCell = ({declaratoria}) => {
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
      <div className='mb-2'>
        <i className='fas fa-calendar-alt text-primary me-2' />
        Inicio: <span className='fw-bold'>{formatLongDate(declaratoria.fecha_inicio)}</span>
      </div>
      <div>
        <i className='fas fa-calendar-check text-primary me-2' />
        Fin: <span className='fw-bold'>{formatLongDate(declaratoria.fecha_fin)}</span>
      </div>
    </div>
  )
}
