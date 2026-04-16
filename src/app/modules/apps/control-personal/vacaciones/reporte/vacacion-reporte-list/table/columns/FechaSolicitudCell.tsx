// DateCell.tsx
import clsx from 'clsx'
import useDateFormatter from 'src/app/hooks/useDateFormatter'

export const FechaSolicitudCell = ({row}) => {
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
        'd-inline-block',
        'w-auto'
      )}
    >
       <span className='fw-bold'>{formatShortDate(row.fecha_solicitud)}</span>
    </div>
  )
}
