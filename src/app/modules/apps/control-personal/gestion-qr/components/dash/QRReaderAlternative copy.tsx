/*
 * QR Reader - Versión Simplificada para C920
 * Esta versión evita problemas de TypeScript usando solo APIs estándar
 * El enfoque se configura mediante el software de Logitech
 */

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
  const [showFocusHelp, setShowFocusHelp] = useState(false)

  // Referencias críticas
  const containerRef = useRef<HTMLDivElement>(null)
  const scannerRef = useRef<Html5Qrcode | null>(null)
  const isMountedRef = useRef(true)
  const lastScannedRef = useRef<Map<string, number>>(new Map())

  // ID único y estable
  const containerIdRef = useRef(`qr-container-${Date.now()}`)

  // Configuración optimizada para C920 (sin casting problemático)
  const getCameraConstraints = useCallback((deviceId: string): MediaTrackConstraints => {
    return {
      deviceId: { exact: deviceId },
      width: { ideal: 640, min: 480 },
      height: { ideal: 480, min: 360 },
      aspectRatio: { ideal: 1.33 },
      frameRate: { ideal: 30, min: 10 }
    }
  }, [])

  // Función para intentar configurar enfoque usando APIs nativas (sin TypeScript)
  const tryConfigureFocus = useCallback(async (stream: MediaStream) => {
    const videoTrack = stream.getVideoTracks()[0]
    if (!videoTrack) return

    try {
      // Usar eval para evitar problemas de TypeScript con APIs experimentales
      const configureAdvancedSettings = new Function('track', 'distance', `
        try {
          const capabilities = track.getCapabilities();
          console.log('🎥 Capacidades detectadas:', Object.keys(capabilities));
          
          // Verificar soporte de enfoque
          if (capabilities.focusMode && capabilities.focusMode.includes('manual')) {
            console.log('✅ Modo de enfoque manual disponible');
            
            track.applyConstraints({
              advanced: [{
                focusMode: 'manual',
                focusDistance: distance
              }]
            }).then(() => {
              console.log('✅ Enfoque configurado a', distance * 100, 'cm');
            }).catch(err => {
              console.warn('⚠️ Error aplicando enfoque:', err.message);
            });
          } else {
            console.log('ℹ️ Enfoque manual no soportado por esta cámara');
          }
          
          return true;
        } catch (err) {
          console.warn('❌ Error en configuración avanzada:', err.message);
          return false;
        }
      `)

      // Intentar configurar a 10cm
      configureAdvancedSettings(videoTrack, 0.1)
      
    } catch (err) {
      console.warn('🔧 Configuración avanzada no disponible, usando estándar')
    }
  }, [])

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
      const constraints: MediaStreamConstraints = selectedCamera ? {
        video: getCameraConstraints(selectedCamera)
      } : {
        video: true
      }

      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      
      // Intentar configurar enfoque
      await tryConfigureFocus(stream)
      
      // Detener el stream de prueba
      stream.getTracks().forEach((track) => track.stop())

      if (isMountedRef.current) {
        setPermissionsGranted(true)
        setError(null)
      }
      return true
    } catch (err: any) {
      console.error('→ Error de permisos:', err)
      if (isMountedRef.current) {
        setError(`Error de permisos: ${handleQRError(err.name)}`)
        setPermissionsGranted(false)
      }
      return false
    }
  }, [selectedCamera, getCameraConstraints, tryConfigureFocus])

  // Obtener cámaras y detectar C920
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
        
        // Buscar específicamente la C920
        const c920Camera = videoDevices.find(cam => 
          cam.label.toLowerCase().includes('c920') ||
          cam.label.toLowerCase().includes('logitech') ||
          cam.label.toLowerCase().includes('hd pro webcam')
        )
        
        if (c920Camera && !selectedCamera) {
          setSelectedCamera(c920Camera.deviceId)
          console.log('🎯 Logitech C920 detectada:', c920Camera.label)
        } else if (videoDevices.length > 0 && !selectedCamera) {
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
      await new Promise((resolve) => setTimeout(resolve, 500))

      if (!isMountedRef.current) return

      const container = containerRef.current
      container.innerHTML = ''
      container.id = containerIdRef.current

      const scanner = new Html5Qrcode(containerIdRef.current)
      scannerRef.current = scanner

      // Configuración optimizada para QR
      const qrConfig = {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0,
        disableFlip: false
      }

      await scanner.start(
        selectedCamera,
        qrConfig,
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
          if (!errorMessage.toLowerCase().includes('no qr code found')) {
            // console.warn('QR Scanner:', errorMessage)
          }
        }
      )

      // Configurar enfoque después de iniciar
      setTimeout(async () => {
        try {
          const videoElement = container.querySelector('video') as HTMLVideoElement
          if (videoElement && videoElement.srcObject) {
            const stream = videoElement.srcObject as MediaStream
            await tryConfigureFocus(stream)
          }
        } catch (err) {
          console.warn('No se pudo reconfigurar el stream:', err)
        }
      }, 1000)

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
  }, [selectedCamera, permissionsGranted, onQRDetected, isRecentlyScanned, cleanupScanner, tryConfigureFocus])

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

  // Efectos
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

  useEffect(() => {
    if (isActive && permissionsGranted && selectedCamera) {
      const timer = setTimeout(startScanner, 1000)
      return () => clearTimeout(timer)
    }
  }, [isActive, permissionsGranted, selectedCamera, startScanner])

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
        <div className='col-md-8 d-flex align-items-center gap-3 flex-wrap'>
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

          {/* Ayuda para configurar enfoque */}
          <button 
            className="btn btn-outline-info btn-sm"
            onClick={() => setShowFocusHelp(!showFocusHelp)}
          >
            <i className="bi bi-question-circle me-2"></i>
            Configurar Enfoque
          </button>

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
          <div className='col-md-4 mt-3 mt-md-0 d-flex justify-content-end'>
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

      {/* Ayuda para configurar enfoque */}
      {showFocusHelp && (
        <div className="alert alert-info mb-4">
          <h6><i className="bi bi-lightbulb me-2"></i>Configurar Enfoque a 10cm en tu Logitech C920:</h6>
          <ol className="mb-2">
            <li><strong>Descarga</strong> Logitech Camera Settings desde la página oficial</li>
            <li><strong>Conecta</strong> tu C920 y abre el software</li>
            <li><strong>Ve a</strong> la pestaña "Imagen" o "Picture"</li>
            <li><strong>Deshabilita</strong> "Enfoque automático"</li>
            <li><strong>Ajusta</strong> el slider de enfoque para códigos QR (aproximadamente 10cm)</li>
            <li><strong>Marca</strong> "Guardar como configuración por defecto"</li>
            <li><strong>Reinicia</strong> el navegador para aplicar cambios</li>
          </ol>
          <small className="text-muted">
            <strong>Alternativa:</strong> En Windows 10/11, ve a Configuración → Cámara → Configuración de privacidad de la cámara → Configuración de la cámara
          </small>
        </div>
      )}

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
              <div
                ref={containerRef}
                style={{
                  width: '100%',
                  height: '100%',
                  minHeight: '400px',
                }}
              />

              {isScanning && (
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
                </div>
              )}

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
                        <small className="text-muted">Aplicando configuración optimizada para C920</small>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className='text-center mt-3'>
              <small className='text-muted'>
                <i className='bi bi-qr-code me-2'></i>
                Posicione el código QR en el centro - Optimizado para lectura a 10cm
              </small>
            </div>
          </div>
        ) : (
          <div className='text-center py-5'>
            <div className='mb-4'>
              <i className='bi bi-qr-code-scan' style={{fontSize: '4rem', color: '#6c757d'}}></i>
            </div>
            <h5 className='text-muted mb-3'>Escáner QR con C920 Inactivo</h5>
            <p className='text-muted mb-4'>
              Optimizado para Logitech C920 Pro HD con enfoque manual a 10cm
            </p>
            <button onClick={() => toggleScanner(true)} className='btn btn-primary'>
              <i className='bi bi-play-circle me-2'></i>
              Iniciar Escáner
            </button>
          </div>
        )}
      </div>

      {/* Info de estado */}
      <div className='mt-4 p-3 bg-light rounded'>
        <div className='row text-center'>
          <div className='col-3'>
            <i className='bi bi-camera-video fs-4 text-primary'></i>
            <br />
            <small className='text-muted'>C920 Pro</small>
          </div>
          <div className='col-3'>
            <i className='bi bi-bullseye fs-4 text-success'></i>
            <br />
            <small className='text-muted'>10cm Focus</small>
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
          <div className='col-12'>
            <small className='text-muted'>
              💡 <strong>Consejo:</strong> Para mejor rendimiento, configura el enfoque a 10cm usando el software de Logitech antes de iniciar
            </small>
          </div>
        </div>
      </div>
    </div>
  )
}