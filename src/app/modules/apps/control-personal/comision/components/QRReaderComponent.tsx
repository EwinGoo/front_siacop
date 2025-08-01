import React, { useCallback } from 'react'
import {KTSVG} from '../../../../../../_metronic/helpers'
import {useQRReader} from '../hooks/useQRReader'

interface QRReaderComponentProps {
  onQRDetected: (result: {code: string; timestamp: number; rawData?: any}) => void
  autoStart?: boolean
  className?: string
}

export const QRReaderComponent: React.FC<QRReaderComponentProps> = ({
  onQRDetected,
  autoStart = true,
  className = '',
}) => {
  const {
    qrReaderRef,
    isActive, 
    isScanning, 
    cameras, 
    selectedCamera, 
    error, 
    permissionsGranted,
    toggleScanner, 
    switchCamera,
    forceRequestPermissions
  } = useQRReader({
    onCodeDetected: onQRDetected,
    debounceTime: 3000,
    autoStart,
  })

  // ✅ Memoizar handlers para evitar re-renders
  const handleToggleScanner = useCallback(() => {
    toggleScanner(!isActive)
  }, [toggleScanner, isActive])

  const handleRequestPermissions = useCallback(async () => {
    const granted = await forceRequestPermissions()
    if (granted) {
      console.log('✅ Permisos concedidos manualmente')
    }
  }, [forceRequestPermissions])

  const handleSwitchCamera = useCallback((deviceId: string) => {
    switchCamera(deviceId)
  }, [switchCamera])

  return (
    <div className={`qr-reader-container ${className}`}>
      {/* Controles superiores */}
      <div className='d-flex justify-content-between align-items-center mb-4'>
        <div className='d-flex align-items-center'>
          <button
            onClick={handleToggleScanner}
            className={`btn btn-sm me-3 ${isActive ? 'btn-danger' : 'btn-success'}`}
          >
            <i className={`bi bi-${isActive ? 'stop-circle' : 'play-circle'} me-2`}></i>
            {isActive ? 'Detener' : 'Iniciar'} Escáner
          </button>

          {error && !permissionsGranted && (
            <button
              onClick={handleRequestPermissions}
              className="btn btn-warning btn-sm me-3"
            >
              <i className="bi bi-camera me-2"></i>
              Solicitar Permisos
            </button>
          )}

          {isScanning && (
            <div className='d-flex align-items-center text-success'>
              <span className='spinner-border spinner-border-sm me-2' role='status'></span>
              <small>Escaneando...</small>
            </div>
          )}

          <div className='d-flex align-items-center ms-3'>
            {permissionsGranted ? (
              <span className='badge bg-success'>
                <i className='bi bi-check-circle me-1'></i>
                Permisos OK
              </span>
            ) : (
              <span className='badge bg-warning'>
                <i className='bi bi-exclamation-triangle me-1'></i>
                Sin permisos
              </span>
            )}
          </div>
        </div>

        {/* Selector de cámara */}
        {cameras.length > 1 && (
          <div className='dropdown'>
            <button
              className='btn btn-light btn-sm dropdown-toggle'
              type='button'
              data-bs-toggle='dropdown'
              aria-expanded='false'
            >
              <i className='bi bi-camera-video me-2'></i>
              Cámara
            </button>
            <ul className='dropdown-menu'>
              {cameras.map((camera) => (
                <li key={camera.deviceId}>
                  <button
                    type="button"
                    className={`dropdown-item ${
                      selectedCamera === camera.deviceId ? 'active' : ''
                    }`}
                    onClick={() => handleSwitchCamera(camera.deviceId)}
                  >
                    <i className='bi bi-camera me-2'></i>
                    {camera.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Área del escáner */}
      <div className='qr-scanner-area'>
        {isActive ? (
          <div className='scanner-container position-relative'>
            <div
              className='qr-reader-wrapper'
              style={{
                width: '100%',
                maxWidth: '500px',
                margin: '0 auto',
                backgroundColor: '#1e1e2d',
                borderRadius: '12px',
                overflow: 'hidden',
                border: '2px solid #3f4254',
              }}
            >
              {/* ✅ Contenedor AISLADO que React nunca modificará después del primer render */}
              <div
                ref={qrReaderRef}
                style={{
                  width: '100%',
                  minHeight: '400px',
                  position: 'relative',
                }}
              >
                {/* ✅ Placeholder que se oculta cuando el scanner está activo */}
                {!isScanning && (
                  <div 
                    style={{ 
                      position: 'absolute', 
                      top: 0, 
                      left: 0, 
                      right: 0, 
                      bottom: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: '#1e1e2d',
                      zIndex: 1
                    }}
                  >
                    <div className='text-center text-light p-4'>
                      {error ? (
                        <div className='alert alert-danger'>
                          <i className='bi bi-exclamation-triangle me-2'></i>
                          {error}
                        </div>
                      ) : (
                        <>
                          <div className='spinner-border text-primary mb-3' role='status'>
                            <span className='visually-hidden'>Cargando...</span>
                          </div>
                          <p>Preparando cámara...</p>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Overlay con guías visuales */}
              {isScanning && (
                <div
                  className='position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center'
                  style={{pointerEvents: 'none', zIndex: 10}}
                >
                  <div
                    className='qr-target-overlay'
                    style={{
                      width: '250px',
                      height: '250px',
                      border: '3px solid #00d4aa',
                      borderRadius: '8px',
                      position: 'relative',
                      background: 'rgba(0, 212, 170, 0.1)',
                    }}
                  >
                    {/* Esquinas del marco */}
                    <div
                      className='position-absolute'
                      style={{
                        top: '-3px',
                        left: '-3px',
                        width: '30px',
                        height: '30px',
                        borderTop: '6px solid #00d4aa',
                        borderLeft: '6px solid #00d4aa',
                      }}
                    ></div>
                    <div
                      className='position-absolute'
                      style={{
                        top: '-3px',
                        right: '-3px',
                        width: '30px',
                        height: '30px',
                        borderTop: '6px solid #00d4aa',
                        borderRight: '6px solid #00d4aa',
                      }}
                    ></div>
                    <div
                      className='position-absolute'
                      style={{
                        bottom: '-3px',
                        left: '-3px',
                        width: '30px',
                        height: '30px',
                        borderBottom: '6px solid #00d4aa',
                        borderLeft: '6px solid #00d4aa',
                      }}
                    ></div>
                    <div
                      className='position-absolute'
                      style={{
                        bottom: '-3px',
                        right: '-3px',
                        width: '30px',
                        height: '30px',
                        borderBottom: '6px solid #00d4aa',
                        borderRight: '6px solid #00d4aa',
                      }}
                    ></div>
                  </div>
                </div>
              )}
            </div>

            <div className='text-center mt-3'>
              <small className='text-muted'>
                <i className='bi bi-qr-code me-2'></i>
                Posicione el código QR dentro del marco
              </small>
            </div>
          </div>
        ) : (
          <div className='text-center py-5'>
            <div className='mb-4'>
              <KTSVG
                path='/media/icons/duotune/general/gen040.svg'
                className='svg-icon-3x text-primary'
              />
            </div>
            <h5 className='text-gray-600 mb-3'>Escáner QR Inactivo</h5>
            <p className='text-muted mb-4'>
              Haga clic en "Iniciar Escáner" para comenzar a leer códigos QR
            </p>
            <button onClick={handleToggleScanner} className='btn btn-primary'>
              <i className='bi bi-play-circle me-2'></i>
              Iniciar Escáner
            </button>
          </div>
        )}
      </div>

      {/* Mensajes de error */}
      {error && (
        <div className='alert alert-danger mt-3' role='alert'>
          <i className='bi bi-exclamation-triangle me-2'></i>
          {error}
        </div>
      )}

      {/* Panel de información */}
      <div className='mt-4 p-3 bg-light rounded'>
        <div className='row text-center'>
          <div className='col-4'>
            <div className='text-primary'>
              <i className='bi bi-camera-video fs-4'></i>
            </div>
            <small className='text-muted'>Cámara</small>
          </div>
          <div className='col-4'>
            <div className='text-success'>
              <i className='bi bi-qr-code-scan fs-4'></i>
            </div>
            <small className='text-muted'>Detección automática</small>
          </div>
          <div className='col-4'>
            <div className='text-info'>
              <i className='bi bi-shield-check fs-4'></i>
            </div>
            <small className='text-muted'>Anti-duplicados</small>
          </div>
        </div>

        <div className='mt-3 pt-3 border-top'>
          <h6 className='text-muted mb-2'>Estado del Sistema:</h6>
          <div className='row'>
            <div className='col-6'>
              <small className='text-muted'>
                🔐 Permisos: <span className={permissionsGranted ? 'text-success' : 'text-danger'}>
                  {permissionsGranted ? 'Concedidos' : 'Pendientes'}
                </span>
              </small>
            </div>
            <div className='col-6'>
              <small className='text-muted'>
                📹 Cámaras: <span className='text-info'>{cameras.length} encontradas</span>
              </small>
            </div>
          </div>
          <div className='row mt-1'>
            <div className='col-6'>
              <small className='text-muted'>
                🎯 Seleccionada: <span className='text-primary'>
                  {selectedCamera ? 'Sí' : 'No'}
                </span>
              </small>
            </div>
            <div className='col-6'>
              <small className='text-muted'>
                🔄 Escaneando: <span className={isScanning ? 'text-success' : 'text-secondary'}>
                  {isScanning ? 'Activo' : 'Inactivo'}
                </span>
              </small>
            </div>
          </div>
          {selectedCamera && (
            <div className='mt-1'>
              <small className='text-muted'>
                📱 ID Cámara: <code className='text-info'>{selectedCamera.substring(0, 20)}...</code>
              </small>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}