import {FC, useState} from 'react'
import {KTIcon} from 'src/_metronic/helpers'
import {showToast} from 'src/app/utils/toastHelper'
import axios from 'axios'

type Props = {
  isConnected: boolean
}

type SyncStats = {
  records_count?: number
  users_updated?: number
  attendance_records?: number
  last_sync?: string
  errors?: string[]
}

const SyncDataComponent: FC<Props> = ({isConnected}) => {
  const [syncLoading, setSyncLoading] = useState(false)
  const [lastSync, setLastSync] = useState<string | null>(null)
  const [syncStats, setSyncStats] = useState<SyncStats | null>(null)

  const handleSyncDevice = async () => {
    if (!isConnected) {
      showToast({
        message: 'Debe estar conectado al dispositivo para sincronizar',
        type: 'error',
      })
      return
    }

    setSyncLoading(true)
    try {
      showToast({
        message: 'Iniciando sincronización de datos...',
        type: 'info',
      })

      // Llamada al endpoint de sincronización
      const response = await axios.post('/api/zkteco/sync')

      if (response.data.success) {
        const stats = response.data.data
        setSyncStats(stats)
        setLastSync(new Date().toLocaleString('es-ES', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        }))
        
        showToast({
          message: `Sincronización exitosa. ${stats.records_count || 0} registros procesados`,
          type: 'success',
        })
      } else {
        showToast({
          message: response.data.message || 'Error durante la sincronización',
          type: 'error',
        })
      }
    } catch (error: any) {
      console.error('Error de sincronización:', error)
      showToast({
        message: error.response?.data?.message || 'Error inesperado durante la sincronización',
        type: 'error',
      })
    } finally {
      setSyncLoading(false)
    }
  }

  if (!isConnected) {
    return (
      <div className='text-center py-10'>
        <div className='card card-flush'>
          <div className='card-body text-center d-flex flex-column justify-content-center py-10'>
            <KTIcon iconName='arrows-loop' className='fs-2x text-muted mb-4' />
            <h5 className='text-muted mb-3'>Sincronización de Datos</h5>
            <p className='text-muted fs-6 mb-5'>
              Debe estar conectado al dispositivo biométrico para realizar la sincronización
            </p>
            <button className='btn btn-secondary' disabled>
              <KTIcon iconName='disconnect' className='fs-5 me-2' />
              No Disponible
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='row g-6'>
      {/* Card Principal de Sincronización */}
      <div className='col-md-8'>
        <div className='card card-flush h-100'>
          <div className='card-header'>
            <div className='card-title'>
              <h3 className='fw-bold m-0'>
                <KTIcon iconName='arrows-loop' className='fs-2 me-3' />
                Sincronización de Datos
              </h3>
            </div>
          </div>
          
          <div className='card-body'>
            <div className='mb-6'>
              <h6 className='mb-3'>Proceso de Sincronización</h6>
              <p className='text-muted fs-6 mb-4'>
                La sincronización descarga todos los registros de asistencia del dispositivo 
                biométrico y actualiza la información de usuarios en el sistema.
              </p>
              
              <div className='d-flex flex-column gap-3 mb-6'>
                <div className='d-flex align-items-center'>
                  <KTIcon iconName='check-circle' className='fs-5 text-success me-3' />
                  <span>Descarga registros de asistencia</span>
                </div>
                <div className='d-flex align-items-center'>
                  <KTIcon iconName='check-circle' className='fs-5 text-success me-3' />
                  <span>Actualiza información de usuarios</span>
                </div>
                <div className='d-flex align-items-center'>
                  <KTIcon iconName='check-circle' className='fs-5 text-success me-3' />
                  <span>Sincroniza datos biométricos</span>
                </div>
              </div>
            </div>

            <div className='text-center'>
              <button
                className='btn btn-primary btn-lg'
                onClick={handleSyncDevice}
                disabled={syncLoading}
              >
                {syncLoading ? (
                  <>
                    <span className='spinner-border spinner-border-sm me-3' />
                    Sincronizando datos...
                  </>
                ) : (
                  <>
                    <KTIcon iconName='arrows-loop' className='fs-4 me-3' />
                    Iniciar Sincronización
                  </>
                )}
              </button>
            </div>

            <div className='mt-6'>
              <div className='alert alert-info d-flex align-items-center'>
                <KTIcon iconName='information' className='fs-2 text-info me-3' />
                <div>
                  <strong>Nota:</strong> Este proceso puede tomar varios minutos dependiendo 
                  de la cantidad de registros. No cierre esta ventana durante la sincronización.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Card de Estadísticas */}
      <div className='col-md-4'>
        <div className='card card-flush h-100'>
          <div className='card-header'>
            <div className='card-title'>
              <h5 className='fw-bold m-0'>Última Sincronización</h5>
            </div>
          </div>
          
          <div className='card-body'>
            {syncStats && lastSync ? (
              <>
                <div className='mb-4'>
                  <div className='d-flex align-items-center mb-3'>
                    <KTIcon iconName='check-circle' className='fs-2 text-success me-3' />
                    <span className='text-success fw-bold'>Sincronización Exitosa</span>
                  </div>
                  <div className='text-muted fs-7'>
                    {lastSync}
                  </div>
                </div>

                <div className='separator mb-4'></div>

                <div className='mb-4'>
                  <div className='d-flex justify-content-between align-items-center mb-2'>
                    <span className='text-muted'>Registros procesados:</span>
                    <span className='badge badge-light-success fs-6'>
                      {(syncStats.records_count || 0).toLocaleString()}
                    </span>
                  </div>
                  
                  <div className='d-flex justify-content-between align-items-center mb-2'>
                    <span className='text-muted'>Usuarios actualizados:</span>
                    <span className='badge badge-light-primary fs-6'>
                      {syncStats.users_updated || 0}
                    </span>
                  </div>

                  {syncStats.attendance_records && (
                    <div className='d-flex justify-content-between align-items-center mb-2'>
                      <span className='text-muted'>Asistencias:</span>
                      <span className='badge badge-light-info fs-6'>
                        {syncStats.attendance_records.toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>

                {syncStats.errors && syncStats.errors.length > 0 && (
                  <div className='alert alert-warning'>
                    <div className='fw-bold mb-2'>Advertencias:</div>
                    {syncStats.errors.map((error, index) => (
                      <div key={index} className='fs-7'>• {error}</div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className='text-center py-6'>
                <KTIcon iconName='chart-line-down' className='fs-2x text-muted mb-3' />
                <p className='text-muted'>
                  No hay datos de sincronización reciente
                </p>
                <p className='text-muted fs-7'>
                  Ejecute una sincronización para ver las estadísticas
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export {SyncDataComponent}