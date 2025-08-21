interface HistorialItem {
  code: string
  timestamp: number
  tipoPermiso: string
}

interface HistorialCardProps {
  scannedHistory: HistorialItem[]
}

export const formatTime = (timestamp: number) => {
  return new Date(timestamp).toLocaleTimeString('es-BO', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

const formatDate = (timestamp: number) => {
  return new Date(timestamp).toLocaleDateString('es-BO', {
    day: '2-digit',
    month: '2-digit',
  })
}
export const HistorialCard: React.FC<HistorialCardProps> = ({scannedHistory}) => {
  if (scannedHistory.length === 0) return null


  return (
    <div className='card'>
      <div className='card-header border-0 bg-info bg-opacity-10'>
        <div className='d-flex align-items-center justify-content-between w-100'>
          <h3 className='card-title text-info fw-bold mb-0'>
            <i className='bi bi-clock-history me-2'></i>
            Historial Reciente
          </h3>
          <span className='badge badge-light-info'>{scannedHistory.length} códigos</span>
        </div>
      </div>
      <div className='card-body'>
        <div className='scroll-y' style={{maxHeight: '350px'}}>
          {scannedHistory.map((item, index) => (
            <div
              key={`${item.code}-${item.timestamp}`}
              className={`d-flex align-items-center py-3 ${
                index !== scannedHistory.length - 1 ? 'border-bottom border-gray-200' : ''
              }`}
            >
              <div className='symbol symbol-35px me-3'>
                <div
                  className={`symbol-label ${
                    index === 0 ? 'bg-light-primary' : 'bg-light-secondary'
                  }`}
                >
                  <i
                    className={`bi ${
                      index === 0 ? 'bi-star-fill text-primary' : 'bi-clock text-secondary'
                    } fs-6`}
                  ></i>
                </div>
              </div>
              <div className='flex-grow-1'>
                <div className='d-flex align-items-center justify-content-between'>
                  <div className='fw-semibold text-gray-800 fs-7'>#{item.code}</div>
                  {item.tipoPermiso == 'dia' ? (
                    <div className='badge badge-light-primary fs-8'>
                      Permiso Día
                    </div>
                  ) : (
                    <div className='badge badge-light-info fs-8'>
                      Permiso Hora
                    </div>
                  )}
                </div>
                <div className='d-flex align-items-center justify-content-between'>
                  <div className='text-muted fs-8 mt-1'>
                    <i className='bi bi-clock me-1'></i>
                    {formatTime(item.timestamp)}
                  </div>
                  <div className='text-muted fs-8'>{formatDate(item.timestamp)}</div>
                </div>
              </div>
              {index === 0 && (
                <div className='badge badge-light-success ms-2'>
                  <i className='bi bi-arrow-left me-1'></i>
                  Último
                </div>
              )}
            </div>
          ))}
        </div>

        {scannedHistory.length >= 10 && (
          <div className='text-center mt-3'>
            <small className='text-muted'>
              <i className='bi bi-info-circle me-1'></i>
              Mostrando los últimos 10 códigos escaneados
            </small>
          </div>
        )}
      </div>
    </div>
  )
}
