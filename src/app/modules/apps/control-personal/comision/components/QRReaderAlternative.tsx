import React, {useRef, useState, useEffect, useCallback} from 'react'
import {Html5Qrcode} from 'html5-qrcode'
import {handleQRError} from '../comision-list/core/qrUtils'

interface QRReaderAlternativeProps {
  onQRDetected: (result: {code: string; timestamp: number; rawData?: any}) => void
  autoStart?: boolean
  className?: string
}

export const QRReaderAlternative: React.FC<QRReaderAlternativeProps> = ({
  onQRDetected,
  autoStart = true,
  className = '',
}) => {
  // Estados básicos
  const [isActive, setIsActive] = useState(autoStart)
  const [isScanning, setIsScanning] = useState(false)
  const [cameras, setCameras] = useState<Array<{deviceId: string; label: string}>>([])
  const [selectedCamera, setSelectedCamera] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [permissionsGranted, setPermissionsGranted] = useState(false)

  // Referencias críticas
  const containerRef = useRef<HTMLDivElement>(null)
  const scannerRef = useRef<Html5Qrcode | null>(null)
  const isMountedRef = useRef(true)
  const lastScannedRef = useRef<Map<string, number>>(new Map())

  // ID único y estable
  const containerIdRef = useRef(`qr-container-${Date.now()}`)

  // Debounce para códigos duplicados
  const isRecentlyScanned = useCallback((code: string): boolean => {
    const now = Date.now()
    const lastScan = lastScannedRef.current.get(code)

    if (lastScan && now - lastScan < 3000) {
      return true
    }

    lastScannedRef.current.set(code, now)
    return false
  }, [])

  // Cleanup seguro del scanner
  const cleanupScanner = useCallback(async () => {
    if (scannerRef.current) {
      try {
        const state = scannerRef.current.getState()
        if (state === 2) {
          // Running
          await scannerRef.current.stop()
        }
        await scannerRef.current.clear()
      } catch (err) {
        console.warn('Error during cleanup:', err)
      } finally {
        scannerRef.current = null
      }
    }

    if (isMountedRef.current) {
      setIsScanning(false)
    }
  }, [])

  // Solicitar permisos
  const requestPermissions = useCallback(async (): Promise<boolean> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({video: true})
      stream.getTracks().forEach((track) => track.stop())

      if (isMountedRef.current) {
        setPermissionsGranted(true)
        setError(null)
      }
      return true
    } catch (err: any) {
      console.log(err.name)
      console.error('→ Error de permisos:', err) // 👈 importante
      if (isMountedRef.current) {
        setError(`Error de permisos: ${handleQRError(err.name)}`)
        setPermissionsGranted(false)
      }
      return false
    }
  }, [])

  // Obtener cámaras
  const getCameras = useCallback(async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices()
      const videoDevices = devices
        .filter((device) => device.kind === 'videoinput')
        .map((device, index) => ({
          deviceId: device.deviceId,
          label: device.label || `Cámara ${index + 1}`,
        }))

      if (isMountedRef.current) {
        setCameras(videoDevices)
        if (videoDevices.length > 0 && !selectedCamera) {
          setSelectedCamera(videoDevices[0].deviceId)
        }
      }
    } catch (err: any) {
      if (isMountedRef.current) {
        setError(`Error obteniendo cámaras: ${err.message}`)
      }
    }
  }, [selectedCamera])

  // Iniciar scanner
  const startScanner = useCallback(async () => {
    if (!isMountedRef.current || !permissionsGranted || !selectedCamera || !containerRef.current) {
      return
    }

    try {
      await cleanupScanner()

      // Esperar un poco para que se complete el cleanup
      await new Promise((resolve) => setTimeout(resolve, 500))

      if (!isMountedRef.current) return

      // Limpiar el contenedor
      const container = containerRef.current
      container.innerHTML = ''
      container.id = containerIdRef.current

      const scanner = new Html5Qrcode(containerIdRef.current)
      scannerRef.current = scanner

      await scanner.start(
        selectedCamera,
        {
          fps: 10,
          qrbox: {width: 250, height: 250},
        },
        (decodedText: string) => {
          if (!isMountedRef.current) return

          const code = decodedText.includes('/')
            ? decodedText.split('/').pop() || decodedText
            : decodedText

          if (!isRecentlyScanned(code)) {
            onQRDetected({
              code,
              timestamp: Date.now(),
              rawData: decodedText,
            })
          }
        },
        (errorMessage: string) => {
          // Ignorar errores menores
          if (!errorMessage.toLowerCase().includes('no qr code found')) {
            // console.warn('QR Scanner:', errorMessage)
          }
        }
      )

      if (isMountedRef.current) {
        setIsScanning(true)
        setError(null)
      }
    } catch (err: any) {
      if (isMountedRef.current) {
        setError(`Error iniciando scanner: ${err.message}`)
        setIsScanning(false)
      }
    }
  }, [selectedCamera, permissionsGranted, onQRDetected, isRecentlyScanned, cleanupScanner])

  // Toggle scanner
  const toggleScanner = useCallback(
    async (active: boolean) => {
      setIsActive(active)
      if (!active) {
        await cleanupScanner()
      }
    },
    [cleanupScanner]
  )

  // Cambiar cámara
  const switchCamera = useCallback(
    async (deviceId: string) => {
      await cleanupScanner()
      setTimeout(() => {
        if (isMountedRef.current) {
          setSelectedCamera(deviceId)
        }
      }, 500)
    },
    [cleanupScanner]
  )

  // Forzar permisos
  const forcePermissions = useCallback(async () => {
    const granted = await requestPermissions()
    if (granted) {
      await getCameras()
    }
  }, [requestPermissions, getCameras])

  // Efecto de inicialización
  useEffect(() => {
    if (!isActive) return

    const init = async () => {
      if (!permissionsGranted) {
        const granted = await requestPermissions()
        if (granted) {
          await getCameras()
        }
      } else if (cameras.length === 0) {
        await getCameras()
      }
    }

    init()
  }, [isActive, permissionsGranted, requestPermissions, getCameras, cameras.length])

  // Efecto para iniciar scanner
  useEffect(() => {
    if (isActive && permissionsGranted && selectedCamera) {
      const timer = setTimeout(startScanner, 1000)
      return () => clearTimeout(timer)
    }
  }, [isActive, permissionsGranted, selectedCamera, startScanner])

  // Cleanup al desmontar
  useEffect(() => {
    return () => {
      isMountedRef.current = false
      cleanupScanner()
    }
  }, [cleanupScanner])

  return (
    <div className={`qr-reader-alternative ${className}`}>
      {/* Controles */}
      <div className='row d-flex justify-content-between align-items-center mb-4'>
        <div className='col-md-6 d-flex align-items-center gap-3'>
          <button
            onClick={() => toggleScanner(!isActive)}
            className={`btn btn-sm ${isActive ? 'btn-danger' : 'btn-success'}`}
          >
            <i className={`bi bi-${isActive ? 'stop' : 'play'}-circle me-2`}></i>
            {isActive ? 'Detener' : 'Iniciar'}
          </button>

          {error && !permissionsGranted && (
            <button onClick={forcePermissions} className='btn btn-warning btn-sm'>
              <i className='bi bi-camera me-2'></i>
              Dar Permisos
            </button>
          )}

          {isScanning && (
            <div className='d-flex align-items-center text-success'>
              <span className='spinner-border spinner-border-sm me-2'></span>
              <small>Escaneando...</small>
            </div>
          )}

          <span className={`badge ${permissionsGranted ? 'bg-success' : 'bg-warning'}`}>
            {permissionsGranted ? '✓ Permisos OK' : '⚠ Sin permisos'}
          </span>
        </div>

        {cameras.length > 1 && (
          <div className='col-md-6 mt-3 mt-md-0 d-flex justify-content-end'>
            <select
              className='form-select form-select-sm'
              style={{width: 'auto'}}
              value={selectedCamera || ''}
              onChange={(e) => switchCamera(e.target.value)}
            >
              {cameras.map((camera) => (
                <option key={camera.deviceId} value={camera.deviceId}>
                  {camera.label}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Área del scanner */}
      <div className='scanner-area'>
        {isActive ? (
          <div className='position-relative'>
            <div
              style={{
                width: '100%',
                maxWidth: '500px',
                margin: '0 auto',
                backgroundColor: '#000',
                borderRadius: '12px',
                overflow: 'hidden',
                border: '2px solid #333',
                minHeight: '400px',
                position: 'relative',
              }}
            >
              {/* Contenedor para Html5Qrcode - React NUNCA modifica esto después del primer render */}
              <div
                ref={containerRef}
                style={{
                  width: '100%',
                  height: '100%',
                  minHeight: '400px',
                }}
              />

              {/* Overlay solo cuando está escaneando */}
              {isScanning && (
                <>
                  <div
                    className='position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center'
                    style={{pointerEvents: 'none', zIndex: 10}}
                  >
                    <div
                      style={{
                        width: '250px',
                        height: '250px',
                        border: '3px solid #00ff00',
                        borderRadius: '8px',
                        background: 'rgba(0, 255, 0, 0.1)',
                      }}
                    />
                  {/* <div className='scan-line' /> */}
                  </div>
                </>
              )}

              {/* Mensaje de estado */}
              {!isScanning && (
                <div
                  className='position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center'
                  style={{zIndex: 5}}
                >
                  <div className='text-center text-white'>
                    {error ? (
                      <div className='alert alert-danger'>
                        <i className='bi bi-exclamation-triangle me-2'></i>
                        {error}
                      </div>
                    ) : (
                      <>
                        <div className='spinner-border text-primary mb-3'></div>
                        <p>Iniciando cámara...</p>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className='text-center mt-3'>
              <small className='text-muted'>
                <i className='bi bi-qr-code me-2'></i>
                Posicione el código QR en el centro
              </small>
            </div>
          </div>
        ) : (
          <div className='text-center py-5'>
            <div className='mb-4'>
              <i className='bi bi-qr-code-scan' style={{fontSize: '4rem', color: '#6c757d'}}></i>
            </div>
            <h5 className='text-muted mb-3'>Escáner QR Inactivo</h5>
            <p className='text-muted mb-4'>
              Haga clic en "Iniciar" para comenzar a escanear códigos QR
            </p>
            <button onClick={() => toggleScanner(true)} className='btn btn-primary'>
              <i className='bi bi-play-circle me-2'></i>
              Iniciar Escáner
            </button>
          </div>
        )}
      </div>

      {/* Error general */}
      {/* {error && (
        <div className="alert alert-danger mt-3">
          <i className="bi bi-exclamation-triangle me-2"></i>
          {error}
        </div>
      )} */}

      {/* Info de estado */}
      <div className='mt-4 p-3 bg-light rounded'>
        <div className='row text-center'>
          <div className='col-3'>
            <i className='bi bi-camera-video fs-4 text-primary'></i>
            <br />
            <small className='text-muted'>Cámara</small>
          </div>
          <div className='col-3'>
            <i className='bi bi-qr-code-scan fs-4 text-success'></i>
            <br />
            <small className='text-muted'>Detección</small>
          </div>
          <div className='col-3'>
            <i className='bi bi-shield-check fs-4 text-info'></i>
            <br />
            <small className='text-muted'>Anti-duplicados</small>
          </div>
          <div className='col-3'>
            <i className='bi bi-speedometer2 fs-4 text-warning'></i>
            <br />
            <small className='text-muted'>Tiempo real</small>
          </div>
        </div>

        <hr />

        <div className='row'>
          <div className='col-6'>
            <small className='text-muted'>
              🔐 Permisos:{' '}
              <span className={permissionsGranted ? 'text-success' : 'text-danger'}>
                {permissionsGranted ? 'Concedidos' : 'Pendientes'}
              </span>
            </small>
          </div>
          <div className='col-6'>
            <small className='text-muted'>
              📹 Cámaras: <span className='text-info'>{cameras.length}</span>
            </small>
          </div>
        </div>
        <div className='row mt-1'>
          <div className='col-6'>
            <small className='text-muted'>
              🎯 Seleccionada: <span className='text-primary'>{selectedCamera ? 'Sí' : 'No'}</span>
            </small>
          </div>
          <div className='col-6'>
            <small className='text-muted'>
              🔄 Estado:{' '}
              <span className={isScanning ? 'text-success' : 'text-secondary'}>
                {isScanning ? 'Activo' : 'Inactivo'}
              </span>
            </small>
          </div>
        </div>
      </div>
    </div>
  )
}
