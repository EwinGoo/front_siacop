import {useEffect, useState} from 'react'
import {useParams, useNavigate} from 'react-router-dom'
import {KTIcon} from 'src/_metronic/helpers'
import {getDispositivoBiometricoById, getSessionStatus, logoutBiometrico} from '../list/core/_requests'
import {DispositivoBiometrico} from '../list/core/_models'
import {DeviceLoginForm} from './DeviceLoginForm'
import {DeviceAdminPanel} from './DeviceAdminPanel'

const BiometricoAdminPage = () => {
  const {id} = useParams<{id: string}>()
  const navigate = useNavigate()

  const [device, setDevice] = useState<DispositivoBiometrico | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [loggingOut, setLoggingOut] = useState(false)

  // Al montar: cargar datos del dispositivo y verificar sesión activa
  useEffect(() => {
    const init = async () => {
      const [deviceResult, sessionResult] = await Promise.allSettled([
        getDispositivoBiometricoById(Number(id)),
        getSessionStatus(),
      ])

      setDevice(deviceResult.status === 'fulfilled' ? (deviceResult.value ?? null) : null)
      setIsAuthenticated(
        sessionResult.status === 'fulfilled' ? sessionResult.value.authenticated : false
      )
      setLoading(false)
    }
    init()
  }, [id])

  const handleLoginSuccess = () => {
    setIsAuthenticated(true)
  }

  const handleLogout = async () => {
    setLoggingOut(true)
    try {
      await logoutBiometrico()
    } finally {
      setIsAuthenticated(false)
      setLoggingOut(false)
    }
  }

  if (loading) {
    return (
      <div className='d-flex justify-content-center align-items-center' style={{minHeight: '300px'}}>
        <div className='spinner-border text-primary' role='status' />
      </div>
    )
  }

  if (!device) {
    return (
      <div className='card'>
        <div className='card-body text-center py-15'>
          <KTIcon iconName='cross-circle' className='fs-2x text-danger mb-4' />
          <h4 className='text-danger'>Dispositivo no encontrado</h4>
          <button className='btn btn-light mt-4' onClick={() => navigate('/apps/biometricos/listar')}>
            <i className='bi bi-arrow-left me-2' />
            Volver al listado
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Header con info del dispositivo */}
      <div className='card mb-6'>
        <div className='card-body py-4'>
          <div className='d-flex align-items-center justify-content-between flex-wrap gap-3'>
            <div className='d-flex align-items-center gap-4'>
              <button
                className='btn btn-icon btn-light btn-sm'
                onClick={() => navigate('/apps/biometricos/listar')}
                title='Volver al listado'
              >
                <i className='bi bi-arrow-left fs-4' />
              </button>
              <div className='symbol symbol-50px'>
                <div className='symbol-label bg-light-primary'>
                  <KTIcon iconName='fingerprint-scanning' className='fs-2 text-primary' />
                </div>
              </div>
              <div>
                <h3 className='mb-0 fw-bold'>{device.nombre_dispositivo}</h3>
                <div className='text-muted fs-7'>
                  {device.direccion_ip}:{device.puerto}
                  {device.ubicacion && <span className='ms-3'>· {device.ubicacion}</span>}
                </div>
              </div>
            </div>

            <div className='d-flex align-items-center gap-3'>
              <span className={`badge badge-lg ${isAuthenticated ? 'badge-light-success' : 'badge-light-secondary'}`}>
                <i className={`bi ${isAuthenticated ? 'bi-shield-check' : 'bi-shield-x'} me-1`} />
                {isAuthenticated ? 'Sesión activa' : 'Sin sesión'}
              </span>

              {isAuthenticated && (
                <button
                  className='btn btn-sm btn-light-danger'
                  onClick={handleLogout}
                  disabled={loggingOut}
                >
                  {loggingOut
                    ? <span className='spinner-border spinner-border-sm me-2' />
                    : <i className='bi bi-box-arrow-right me-2' />
                  }
                  Desconectar
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      {isAuthenticated ? (
        <DeviceAdminPanel />
      ) : (
        <DeviceLoginForm device={device} onLoginSuccess={handleLoginSuccess} />
      )}
    </>
  )
}

export {BiometricoAdminPage}
export default BiometricoAdminPage
