import {formatTime} from './HistorialCard'

interface UltimoCodigoCardProps {
  lastScanned: {
    code: string
    tipoPermiso: string
    timestamp: number
  } | null
}

export const UltimoCodigoCard: React.FC<UltimoCodigoCardProps> = ({lastScanned}) => {
  if (!lastScanned) return null

  return (
    <div className='card mb-6'>
      <div className='card-header border-0 bg-success bg-opacity-10'>
        <h3 className='card-title text-success fw-bold'>
          <i className='bi bi-qr-code me-2'></i>
          Último Código
        </h3>
      </div>
      <div className='card-body'>
        <div className='d-flex align-items-center'>
          <div className='symbol symbol-40px me-4'>
            <div className='symbol-label bg-light-success'>
              <i className='bi bi-qr-code text-success fs-4'></i>
            </div>
          </div>
          <div className='flex-grow-1'>
            <div className='fw-bold text-gray-800 fs-5'>{lastScanned.code}</div>
            <div className='text-muted fs-7'>
              <i className='bi bi-clock me-1'></i>
              {formatTime(lastScanned.timestamp)}
            </div>
          </div>
          {/* {tipoPermiso} */}
          {lastScanned.tipoPermiso == 'dia' ? (
            <div className='badge badge-light-primary fs-8'>Permiso Día</div>
          ) : (
            <div className='badge badge-light-info fs-8'>Permiso Hora</div>
          )}
          <div className='badge badge-light-success'>
            <i className='bi bi-check-circle me-1'></i>
            Escaneado
          </div>
        </div>
      </div>
    </div>
  )
}
