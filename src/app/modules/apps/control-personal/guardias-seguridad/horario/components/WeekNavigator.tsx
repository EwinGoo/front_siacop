import {KTIcon} from 'src/_metronic/helpers'

type Props = {
  fechaInicio: string
  onPrev: () => void
  onNext: () => void
  onHoy: () => void
  posicionCiclo: number | null
  numeroCiclo: number | null
}

const BADGE_CICLO = ['badge-light-primary', 'badge-light-warning', 'badge-light-danger']

const formatDateRange = (fechaInicio: string) => {
  const start = new Date(fechaInicio + 'T12:00:00')
  const end = new Date(start)
  end.setDate(end.getDate() + 6)
  const opts: Intl.DateTimeFormatOptions = {day: 'numeric', month: 'long'}
  const optsYear: Intl.DateTimeFormatOptions = {day: 'numeric', month: 'long', year: 'numeric'}
  return `${start.toLocaleDateString('es-ES', opts)} — ${end.toLocaleDateString('es-ES', optsYear)}`
}

const WeekNavigator = ({fechaInicio, onPrev, onNext, onHoy, posicionCiclo, numeroCiclo}: Props) => {
  const badgeClass = posicionCiclo ? BADGE_CICLO[(posicionCiclo - 1) % 3] : 'badge-light-secondary'

  return (
    <div className='d-flex align-items-center justify-content-between flex-wrap gap-3 mb-6'>
      <div className='d-flex align-items-center gap-3'>
        <button className='btn btn-icon btn-light btn-sm' onClick={onPrev} title='Semana anterior'>
          <KTIcon iconName='arrow-left' className='fs-2' />
        </button>
        <div className='text-center'>
          <div className='fw-bolder fs-5 text-dark'>{formatDateRange(fechaInicio)}</div>
          {posicionCiclo && (
            <div className='mt-1'>
              <span className={`badge ${badgeClass} fs-7`}>
                Ciclo #{numeroCiclo} · Semana {posicionCiclo} de 3
              </span>
            </div>
          )}
        </div>
        <button className='btn btn-icon btn-light btn-sm' onClick={onNext} title='Semana siguiente'>
          <KTIcon iconName='arrow-right' className='fs-2' />
        </button>
      </div>
      <button className='btn btn-light-primary btn-sm' onClick={onHoy}>
        <KTIcon iconName='calendar' className='fs-4 me-1' />
        Semana actual
      </button>
    </div>
  )
}

export {WeekNavigator}
