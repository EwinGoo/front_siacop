// DateCell.tsx
import useDateFormatter from '../../../../../../../hooks/useDateFormatter'

export const DateCell = ({value}: {value: string | Date}) => {
  const {formatLongDate} = useDateFormatter()
  return (
    <div className='mb-2 min-w-100px'>
      <i className='fas fa-calendar-check text-primary me-2' />
      <span className='fw-bold'>{formatLongDate(value)}</span>
    </div>
  )
}
