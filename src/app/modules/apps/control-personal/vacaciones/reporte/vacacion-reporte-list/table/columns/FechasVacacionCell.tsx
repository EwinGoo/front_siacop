// DateCell.tsx
import clsx from 'clsx'
import useDateFormatter from 'src/app/hooks/useDateFormatter'

export const FechasVacacionCell = ({row}) => {
  const {formatShortDate} = useDateFormatter()

  return (
    <div
      className={clsx(
        'bg-light-primary',
        'p-3',
        'rounded',
        'text-gray-800',
        'fw-semibold',
        'text-sm',
        'min-w-150px',
        'd-inline-block',
        'w-auto'
      )}
    >
      <div className='mb-2'>
        <i className='fas fa-calendar-alt text-primary me-2' />
        De: <span className='fw-bold'>{formatShortDate(row.fecha_vacacion_inicio)}</span>
      </div>
      <div>
        <i className='fas fa-calendar-check text-primary me-2' />
        Al: <span className='fw-bold'>{formatShortDate(row.fecha_vacacion_fin)}</span>
      </div>
    </div>
  )
}
