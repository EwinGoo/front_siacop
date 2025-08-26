import React, {useRef, useState, useEffect, useCallback} from 'react'
import {Html5Qrcode} from 'html5-qrcode'
import { handleQRError } from '../../utils/qrUtils'

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

  // Estados de capacidades y valores aplicados
  const [cameraCaps, setCameraCaps] = useState<any | null>(null)
  const [cameraValues, setCameraValues] = useState<Record<string, any>>({})

  // Referencias
  const containerRef = useRef<HTMLDivElement>(null)
  const scannerRef = useRef<Html5Qrcode | null>(null)
  const isMountedRef = useRef(true)
  const lastScannedRef = useRef<Map<string, number>>(new Map())
  const containerIdRef = useRef(`qr-container-${Date.now()}`)

  // Debounce para códigos duplicados
  const isRecentlyScanned = useCallback((code: string): boolean => {
    const now = Date.now()
    const lastScan = lastScannedRef.current.get(code)
    if (lastScan && now - lastScan < 3000) return true
    lastScannedRef.current.set(code, now)
    return false
  }, [])

  // Limpieza
  const cleanupScanner = useCallback(async () => {
    if (scannerRef.current) {
      try {
        const state = scannerRef.current.getState()
        if (state === 2) await scannerRef.current.stop()
        await scannerRef.current.clear()
      } catch (err) {
        console.warn('Error during cleanup:', err)
      } finally {
        scannerRef.current = null
      }
    }
    if (isMountedRef.current) setIsScanning(false)
  }, [])

  // Pedir permisos
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
      if (isMountedRef.current) setError(`Error obteniendo cámaras: ${err.message}`)
    }
  }, [selectedCamera])

  // Helper para aplicar constraints
  const applyCam = async (constraints: MediaTrackConstraints) => {
    if (!scannerRef.current) return
    try {
      await scannerRef.current.applyVideoConstraints(constraints)
      // await scannerRef.current.applyVideoConstraints(c
      //   {advanced: [{ focusMode: "continuous" }] as any}
      // )
      console.log('Constraints aplicadas (promesa resuelta).')
      // alert('Se aplicaron los cambios, verifica visualmente el video.')
    } catch (err) {
      console.warn('Error al aplicar constraints', err)
    }
  }

  useEffect(() => {
    if (!scannerRef.current) return
    setTimeout(() => {
      console.log(scannerRef)

      // const currentValues =  scannerRef.current!.getRunningTrackSettings()
      // setCameraValues(currentValues)
      // console.log('Valores actuales de la cámara:', currentValues)
    }, 2000)
  }, [scannerRef])

  // Iniciar scanner
  const startScanner = useCallback(async () => {
    if (!isMountedRef.current || !permissionsGranted || !selectedCamera || !containerRef.current)
      return
    try {
      await cleanupScanner()
      await new Promise((resolve) => setTimeout(resolve, 500))
      if (!isMountedRef.current) return

      const container = containerRef.current
      container.innerHTML = ''
      container.id = containerIdRef.current
      const scanner = new Html5Qrcode(containerIdRef.current)
      scannerRef.current = scanner


      await scanner.start(
        selectedCamera,
        {fps: 10, qrbox: {width: 250, height: 250}},
        (decodedText: string) => {
          if (!isMountedRef.current) return
          const code = decodedText.includes('/')
            ? decodedText.split('/').pop() || decodedText
            : decodedText
          // if (!isRecentlyScanned(code)) {
          //   onQRDetected({ code, timestamp: Date.now(), rawData: decodedText })
          // }
        },
        (errorMessage: string) => {}
      )
      
      const currentValues = scannerRef.current!.getRunningTrackSettings()
      console.log(currentValues);
      

      // Leer capabilities
      const caps = scannerRef.current!.getRunningTrackCapabilities()
      setCameraCaps(caps)
      setCameraValues({}) // limpiar valores aplicados

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

  // Toggle
  const toggleScanner = useCallback(
    async (active: boolean) => {
      setIsActive(active)
      if (!active) await cleanupScanner()
    },
    [cleanupScanner]
  )

  // Cambiar cámara
  const switchCamera = useCallback(
    async (deviceId: string) => {
      await cleanupScanner()
      setTimeout(() => {
        if (isMountedRef.current) setSelectedCamera(deviceId)
      }, 500)
    },
    [cleanupScanner]
  )

  // Forzar permisos
  const forcePermissions = useCallback(async () => {
    const granted = await requestPermissions()
    if (granted) await getCameras()
  }, [requestPermissions, getCameras])

  // Init
  useEffect(() => {
    if (!isActive) return
    const init = async () => {
      if (!permissionsGranted) {
        const granted = await requestPermissions()
        if (granted) await getCameras()
      } else if (cameras.length === 0) {
        await getCameras()
      }
    }
    init()
  }, [isActive, permissionsGranted, requestPermissions, getCameras, cameras.length])

  // Auto-start scanner
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
      {/* Controles básicos */}
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
              <i className='bi bi-camera me-2'></i>Dar Permisos
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

      {/* Área scanner */}
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
                border: true ? '2px solid #0d6efd' : '2px solid #333',
                minHeight: '400px',
                position: 'relative',
              }}
            >
              <div ref={containerRef} style={{width: '100%', height: '100%', minHeight: '400px'}} />
            </div>
          </div>
        ) : (
          <div className='text-center py-5'>
            <div className='mb-4'>
              <i className='bi bi-qr-code-scan' style={{fontSize: '4rem', color: '#6c757d'}}></i>
            </div>
            <h5 className='text-muted mb-3'>Escáner QR Inactivo</h5>
            <p className='text-muted mb-4'>Haga clic en "Iniciar" para comenzar a escanear</p>
            <button onClick={() => toggleScanner(true)} className='btn btn-primary'>
              <i className='bi bi-play-circle me-2'></i>Iniciar Escáner
            </button>
          </div>
        )}
      </div>

      {/* Panel de controles de cámara */}
      {cameraCaps && (
        <div className='mt-4 p-3 bg-light rounded'>
          <h6>🎛️ Controles de Cámara</h6>
          {[
            'brightness',
            'contrast',
            'saturation',
            'sharpness',
            'exposureCompensation',
            'colorTemperature',
            'focusDistance',
          ].map((prop) => {
            const cap = cameraCaps[prop]
            if (!cap) return null
            return (
              <div key={prop} className='mb-2'>
                <label className='form-label'>{prop}</label>
                <input
                  type='range'
                  className='form-range'
                  min={cap.min}
                  max={cap.max}
                  step={cap.step || 1}
                  value={cameraValues[prop] ?? cap.min}
                  onChange={async (e) => {
                    const val = Number(e.target.value)
                    setCameraValues((v) => ({...v, [prop]: val}))
                    await applyCam({advanced: [{[prop]: val}]})
                  }}
                />
              </div>
            )
          })}
          {/* Modes */}
          {cameraCaps.focusMode && (
            <div className='mb-2'>
              <label className='form-label'>Focus Mode</label>
              <select
                className='form-select'
                onChange={(e) => applyCam({advanced: [{focusMode: e.target.value} as any]})}
              >
                {cameraCaps.focusMode.map((m: string) => (
                  <option key={m}>{m}</option>
                ))}
              </select>
            </div>
          )}
          {cameraCaps.exposureMode && (
            <div className='mb-2'>
              <label className='form-label'>Exposure Mode</label>
              <select
                className='form-select'
                onChange={(e) => applyCam({advanced: [{exposureMode: e.target.value} as any]})}
              >
                {cameraCaps.exposureMode.map((m: string) => (
                  <option key={m}>{m}</option>
                ))}
              </select>
            </div>
          )}
          {cameraCaps.whiteBalanceMode && (
            <div className='mb-2'>
              <label className='form-label'>White Balance</label>
              <select
                className='form-select'
                onChange={(e) => applyCam({advanced: [{whiteBalanceMode: e.target.value} as any]})}
              >
                {cameraCaps.whiteBalanceMode.map((m: string) => (
                  <option key={m}>{m}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
