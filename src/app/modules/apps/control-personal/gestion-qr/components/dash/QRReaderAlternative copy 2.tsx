import React, {useRef, useState, useEffect, useCallback} from 'react'
import {Html5Qrcode} from 'html5-qrcode'
import { handleQRError } from '../../utils/qrUtils'

// Extender interfaces para controles avanzados
interface ExtendedMediaTrackCapabilities extends MediaTrackCapabilities {
  focusMode?: string[]
  focusDistance?: {
    max: number
    min: number
    step: number
  }
  zoom?: {
    max: number
    min: number
    step: number
  }
  brightness?: {
    max: number
    min: number
    step: number
  }
  contrast?: {
    max: number
    min: number
    step: number
  }
  saturation?: {
    max: number
    min: number
    step: number
  }
  sharpness?: {
    max: number
    min: number
    step: number
  }
  exposureCompensation?: {
    max: number
    min: number
    step: number
  }
  colorTemperature?: {
    max: number
    min: number
    step: number
  }
}

interface ExtendedMediaTrackConstraintSet {
  focusMode?: string
  focusDistance?: number
  zoom?: number
  brightness?: number
  contrast?: number
  saturation?: number
  sharpness?: number
  exposureCompensation?: number
  colorTemperature?: number
}

interface QRReaderAlternativeProps {
  onQRDetected: (result: {code: string; timestamp: number; rawData?: any}) => void
  autoStart?: boolean
  className?: string
  enableSound?: boolean
}

// Configuraciones recomendadas para QR
const QR_RECOMMENDED_SETTINGS = {
  focusMode: 'manual',
  focusDistance: 0.5, // 50% del rango
  brightness: 0,
  contrast: 0,
  saturation: 0,
  sharpness: 0
}

export const QRReaderAlternative: React.FC<QRReaderAlternativeProps> = ({
  onQRDetected,
  autoStart = true,
  className = '',
  enableSound = true,
}) => {
  // Estados básicos existentes (mantener intactos)
  const [isActive, setIsActive] = useState(autoStart)
  const [isScanning, setIsScanning] = useState(false)
  const [cameras, setCameras] = useState<Array<{deviceId: string; label: string}>>([])
  const [selectedCamera, setSelectedCamera] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [permissionsGranted, setPermissionsGranted] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(enableSound)

  // Estados nuevos para controles avanzados
  const [cameraCapabilities, setCameraCapabilities] = useState<ExtendedMediaTrackCapabilities | null>(null)
  const [currentCameraSettings, setCurrentCameraSettings] = useState<Record<string, any>>({})
  const [showAdvancedControls, setShowAdvancedControls] = useState(false)
  const [useQRRecommended, setUseQRRecommended] = useState(false)
  const [currentStream, setCurrentStream] = useState<MediaStream | null>(null)

  // Referencias críticas (mantener intactas)
  const containerRef = useRef<HTMLDivElement>(null)
  const scannerRef = useRef<Html5Qrcode | null>(null)
  const isMountedRef = useRef(true)
  const lastScannedRef = useRef<Map<string, number>>(new Map())
  const audioContextRef = useRef<AudioContext | null>(null)
  const containerIdRef = useRef(`qr-container-${Date.now()}`)

  // Función para reproducir sonido (mantener intacta)
  const playQRDetectedSound = useCallback(() => {
    if (!soundEnabled) return;

    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }

      const audioContext = audioContextRef.current;
      
      if (audioContext.state === 'suspended') {
        audioContext.resume();
      }

      const createBeep = (frequency: number, duration: number, delay: number = 0) => {
        setTimeout(() => {
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();
          
          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);
          
          oscillator.frequency.value = frequency;
          oscillator.type = 'sine';
          
          gainNode.gain.setValueAtTime(0, audioContext.currentTime);
          gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.01);
          gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + duration);
          
          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + duration);
        }, delay);
      };

      createBeep(800, 0.1);
      createBeep(600, 0.15, 100);
      
    } catch (err) {
      console.warn('No se pudo reproducir el sonido:', err);
      
      try {
        if ('vibrate' in navigator) {
          navigator.vibrate([50, 50, 100]);
        }
      } catch (fallbackErr) {
        // Silencioso
      }
    }
  }, [soundEnabled]);

  // Debounce para códigos duplicados (mantener intacto)
  const isRecentlyScanned = useCallback((code: string): boolean => {
    const now = Date.now()
    const lastScan = lastScannedRef.current.get(code)

    if (lastScan && now - lastScan < 3000) {
      return true
    }

    lastScannedRef.current.set(code, now)
    return false
  }, [])

  // Validación de soporte de medios
  const checkMediaSupport = useCallback((): string | null => {
    if (typeof navigator === 'undefined') {
      return 'Navigator no disponible'
    }
    if (!navigator.mediaDevices) {
      return 'Tu navegador no soporta acceso a cámara'
    }
    if (!navigator.mediaDevices.getUserMedia) {
      return 'getUserMedia no está disponible'
    }
    if (window.location.protocol !== 'https:' && 
        !window.location.hostname.includes('localhost') && 
        window.location.hostname !== '127.0.0.1') {
      return 'Se requiere HTTPS para acceder a la cámara'
    }
    return null
  }, [])

  // Obtener configuraciones actuales de la cámara
  const getCurrentCameraSettings = useCallback(() => {
    if (!currentStream) return {}
    
    try {
      const videoTrack = currentStream.getVideoTracks()[0]
      if (videoTrack) {
        const settings = videoTrack.getSettings()
        setCurrentCameraSettings(settings)
        return settings
      }
    } catch (err) {
      console.warn('Error obteniendo configuraciones actuales:', err)
    }
    return {}
  }, [currentStream])

  // Aplicar constraints de cámara de forma segura - SIN AFECTAR SCANNER
  const applyCameraConstraints = useCallback(async (constraints: ExtendedMediaTrackConstraintSet) => {
    if (!currentStream || !cameraCapabilities) {
      console.warn('🚫 No se pueden aplicar constraints: stream o capabilities no disponibles')
      return false
    }
    
    try {
      const videoTrack = currentStream.getVideoTracks()[0]
      if (!videoTrack || videoTrack.readyState !== 'live') {
        console.warn('🚫 VideoTrack no disponible o no activo')
        return false
      }

      console.log('⚙️ Aplicando constraints:', constraints)
      
      await videoTrack.applyConstraints({ 
        advanced: [constraints as MediaTrackConstraintSet] 
      })
      
      // Actualizar configuraciones actuales después de aplicar - CON DELAY MAYOR
      setTimeout(() => {
        if (currentStream && isMountedRef.current) {
          getCurrentCameraSettings()
        }
      }, 1000)
      
      console.log('✅ Constraints aplicadas exitosamente:', constraints)
      return true
    } catch (err: any) {
      console.warn('⚠️ Error aplicando constraints (NO CRÍTICO):', err.message)
      
      // Si es OverconstrainedError, mostrar qué constraint falló
      if (err.name === 'OverconstrainedError') {
        console.log('📝 Constraint problemática:', err.constraint)
      }
      
      // IMPORTANTE: NO detener el scanner, solo retornar false
      return false
    }
  }, [currentStream, cameraCapabilities, getCurrentCameraSettings])

  // Aplicar configuraciones recomendadas para QR
  const applyQRRecommendedSettings = useCallback(async () => {
    if (!cameraCapabilities || !currentStream) return

    const constraints: ExtendedMediaTrackConstraintSet = {}
    
    // Aplicar solo las configuraciones disponibles
    if (cameraCapabilities.focusMode?.includes('manual')) {
      constraints.focusMode = 'manual'
    }
    
    if (cameraCapabilities.focusDistance) {
      const { min = 0, max = 1 } = cameraCapabilities.focusDistance
      constraints.focusDistance = min + (max - min) * 0.5 // 50% del rango
    }
    
    if (cameraCapabilities.brightness) {
      constraints.brightness = 0
    }
    
    if (cameraCapabilities.contrast) {
      constraints.contrast = 0
    }
    
    if (cameraCapabilities.saturation) {
      constraints.saturation = 0
    }
    
    if (cameraCapabilities.sharpness) {
      constraints.sharpness = 0
    }

    if (Object.keys(constraints).length > 0) {
      const success = await applyCameraConstraints(constraints)
      if (success) {
        console.log('Configuraciones QR aplicadas')
      }
    }
  }, [cameraCapabilities, currentStream, applyCameraConstraints])

  // Cleanup seguro del scanner - CON LOGGING MEJORADO
  const cleanupScanner = useCallback(async () => {
    const stack = new Error().stack
    const caller = stack?.split('\n')[2]?.trim() || 'Desconocido'
    console.log('🛑 CLEANUP INICIADO - Llamado desde:', caller)
    
    if (scannerRef.current) {
      try {
        const state = scannerRef.current.getState()
        console.log('📹 Estado del scanner antes de cleanup:', state)
        
        if (state === 2) { // Running
          console.log('⏹️ Deteniendo scanner...')
          await scannerRef.current.stop()
        }
        
        // Pausa para estabilización
        await new Promise(resolve => setTimeout(resolve, 200))
        
        console.log('🧹 Limpiando scanner...')
        await scannerRef.current.clear()
      } catch (err: any) {
        console.warn('⚠️ Error durante cleanup del scanner (ignorando):', err.message)
      } finally {
        scannerRef.current = null
        console.log('✅ Scanner ref limpiado')
      }
    }

    if (currentStream) {
      try {
        console.log('📹 Cerrando stream de video...')
        currentStream.getTracks().forEach((track, index) => {
          console.log(`🔐 Cerrando track ${index}:`, track.kind, track.readyState)
          if (track.readyState !== 'ended') {
            track.stop()
          }
        })
      } catch (err: any) {
        console.warn('⚠️ Error deteniendo stream:', err.message)
      }
      setCurrentStream(null)
      console.log('✅ Stream limpiado')
    }

    if (isMountedRef.current) {
      setIsScanning(false)
      setCameraCapabilities(null)
      setCurrentCameraSettings({})
      console.log('✅ Estados limpiados')
    }
    
    console.log('🏁 CLEANUP COMPLETADO')
  }, [currentStream])

  // Solicitar permisos con validación mejorada
  const requestPermissions = useCallback(async (): Promise<boolean> => {
    try {
      const supportError = checkMediaSupport()
      if (supportError) {
        if (isMountedRef.current) {
          setError(supportError)
          setPermissionsGranted(false)
        }
        return false
      }

      const stream = await navigator.mediaDevices.getUserMedia({video: true})
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
  }, [checkMediaSupport])

  // Obtener cámaras (mantener lógica básica intacta)
  const getCameras = useCallback(async () => {
    try {
      const supportError = checkMediaSupport()
      if (supportError) {
        if (isMountedRef.current) {
          setError(supportError)
        }
        return
      }

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
  }, [selectedCamera, checkMediaSupport])

  // Iniciar scanner - ROBUSTO CON MEJOR ERROR HANDLING
  const startScanner = useCallback(async () => {
    console.log('🚀 INICIANDO SCANNER - Verificando condiciones...')
    
    if (!isMountedRef.current) {
      console.log('❌ Componente no montado')
      return
    }
    
    if (!permissionsGranted) {
      console.log('❌ Sin permisos de cámara')
      return
    }
    
    if (!selectedCamera) {
      console.log('❌ Sin cámara seleccionada')
      return
    }
    
    if (!containerRef.current) {
      console.log('❌ Contenedor no disponible')
      return
    }
    
    if (isScanning) {
      console.log('⚠️ Scanner ya está activo, ignorando inicio duplicado')
      return
    }

    console.log('✅ Condiciones OK, iniciando scanner...')

    try {
      await cleanupScanner()
      await new Promise((resolve) => setTimeout(resolve, 800))

      if (!isMountedRef.current) {
        console.log('❌ Componente desmontado durante inicialización')
        return
      }

      const container = containerRef.current
      container.innerHTML = ''
      container.id = containerIdRef.current

      const scanner = new Html5Qrcode(containerIdRef.current)
      scannerRef.current = scanner

      console.log('📹 Iniciando Html5Qrcode...')
      
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
            playQRDetectedSound();
            
            onQRDetected({
              code,
              timestamp: Date.now(),
              rawData: decodedText,
            })
          }
        },
        (errorMessage: string) => {
          // Filtrar errores normales de escaneo
          if (errorMessage.toLowerCase().includes('no qr code found') || 
              errorMessage.includes('NotFoundException')) {
            return // Ignorar - es normal
          }
          
          // Log solo errores importantes sin detener el scanner
          if (!errorMessage.includes('AbortError') && 
              !errorMessage.includes('removeChild')) {
            console.warn('📷 Scanner warning (no crítico):', errorMessage)
          }
        }
      )

      console.log('✅ Scanner iniciado correctamente')
      
      if (!isMountedRef.current) {
        console.log('❌ Componente desmontado después de iniciar')
        return
      }

      setIsScanning(true)
      setError(null)

      // Obtener stream y capabilities después de un tiempo de estabilización
      console.log('⏱️ Esperando estabilización para obtener capabilities...')
      setTimeout(async () => {
        try {
          console.log('🔍 Verificando condiciones para capabilities:', {
            mounted: isMountedRef.current,
            hasScanner: !!scannerRef.current,
            isScanning: isScanning,
            scannerState: scannerRef.current?.getState()
          })
          
          if (!isMountedRef.current) {
            console.log('❌ Componente no montado, cancelando capabilities')
            return
          }
          
          if (!scannerRef.current) {
            console.log('❌ Scanner ref no disponible, cancelando capabilities')
            return
          }
          
          // NO verificar isScanning aquí - puede haber un delay en el setState
          const scannerState = scannerRef.current.getState()
          if (scannerState !== 2) { // 2 = Running
            console.log('❌ Scanner no está en estado Running:', scannerState)
            return
          }

          const video = container.querySelector('video')
          if (video && video.srcObject) {
            const stream = video.srcObject as MediaStream
            console.log('📹 Stream obtenido:', stream.getTracks().length, 'tracks')
            console.log('📹 Estado de tracks:', stream.getTracks().map(t => ({ kind: t.kind, state: t.readyState })))
            
            setCurrentStream(stream)
            
            // Obtener capabilities de la cámara
            try {
              const videoTrack = stream.getVideoTracks()[0]
              if (videoTrack && videoTrack.readyState === 'live') {
                const capabilities = videoTrack.getCapabilities() as ExtendedMediaTrackCapabilities
                setCameraCapabilities(capabilities)
                
                console.log('⚙️ Capabilities obtenidas:', Object.keys(capabilities).filter(k => 
                  ['focusMode', 'focusDistance', 'brightness', 'contrast', 'saturation', 'zoom'].includes(k)
                ))
                
                // Obtener configuraciones actuales
                setTimeout(() => {
                  if (isMountedRef.current && videoTrack.readyState === 'live') {
                    const settings = videoTrack.getSettings()
                    setCurrentCameraSettings(settings)
                    console.log('✅ Configuraciones iniciales obtenidas:', Object.keys(settings))
                  }
                }, 500)
              } else {
                console.warn('⚠️ VideoTrack no disponible o no activo:', videoTrack?.readyState)
              }
            } catch (capErr: any) {
              console.warn('⚠️ Error obteniendo capabilities (no crítico):', capErr.message)
              // No detener el scanner por este error
            }
          } else {
            console.warn('⚠️ Video element o srcObject no encontrado')
            console.log('🔍 Elementos en container:', container.children.length)
            const videos = container.querySelectorAll('video')
            console.log('🔍 Videos encontrados:', videos.length)
          }
        } catch (streamErr: any) {
          console.warn('⚠️ Error obteniendo stream (no crítico):', streamErr.message)
          // No detener el scanner por este error
        }
      }, 2000) // Tiempo mayor para estabilización

    } catch (err: any) {
      console.error('🚨 Error iniciando scanner:', err)
      if (isMountedRef.current) {
        setError(`Error iniciando scanner: ${err.message}`)
        setIsScanning(false)
      }
    }
  }, [selectedCamera, permissionsGranted, onQRDetected, isRecentlyScanned, cleanupScanner, playQRDetectedSound, getCurrentCameraSettings, isScanning])

  // Toggle scanner - CON PREVENCIÓN DE ESTADOS INCONSISTENTES
  const toggleScanner = useCallback(
    async (active: boolean) => {
      console.log('Toggle scanner llamado:', { active, currentActive: isActive, scanning: isScanning })
      
      if (active === isActive) {
        console.log('Estado ya coincide, ignorando toggle')
        return
      }
      
      setIsActive(active)
      
      if (!active) {
        console.log('Deteniendo scanner por toggle...')
        await cleanupScanner()
      }
    },
    [cleanupScanner, isActive, isScanning]
  )

  // Cambiar cámara (mantener intacto)
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

  // Forzar permisos (mantener intacto)
  const forcePermissions = useCallback(async () => {
    const granted = await requestPermissions()
    if (granted) {
      await getCameras()
    }
  }, [requestPermissions, getCameras])

  // Función para probar el sonido (mantener intacta)
  const testSound = useCallback(() => {
    playQRDetectedSound();
  }, [playQRDetectedSound]);

  // Efecto para aplicar configuraciones QR recomendadas - CONTROLADO
  useEffect(() => {
    if (useQRRecommended && isScanning && cameraCapabilities && currentStream) {
      const timer = setTimeout(async () => {
        try {
          console.log('⚙️ Aplicando configuraciones QR recomendadas...')
          await applyQRRecommendedSettings()
        } catch (err) {
          console.warn('Error aplicando configuraciones QR (no crítico):', err)
          // NO detener el scanner, solo mostrar advertencia
        }
      }, 2000) // Más tiempo para estabilización
      return () => clearTimeout(timer)
    }
  }, [useQRRecommended]) // SOLO cuando cambie el checkbox manualmente

  // Efectos de inicialización - ESTABLES SIN CICLOS
  useEffect(() => {
    console.log('🔄 Efecto inicialización ejecutado:', { isActive, permissionsGranted, camerasLength: cameras.length })
    
    if (!isActive) {
      console.log('❌ Scanner inactivo, no iniciando')
      return
    }

    const init = async () => {
      try {
        if (!permissionsGranted) {
          console.log('📷 Solicitando permisos...')
          const granted = await requestPermissions()
          if (granted && isMountedRef.current) {
            console.log('✅ Permisos concedidos, obteniendo cámaras...')
            await getCameras()
          }
        } else if (cameras.length === 0) {
          console.log('📹 Ya hay permisos pero no hay cámaras, obteniendo...')
          await getCameras()
        }
      } catch (err: any) {
        console.error('🚨 Error en inicialización:', err.message)
        if (isMountedRef.current) {
          setError(`Error de inicialización: ${err.message}`)
        }
      }
    }
    
    init()
  }, [isActive]) // SOLO isActive para evitar ciclos

  // Efecto para iniciar scanner - SIN DEPENDENCIAS PROBLEMÁTICAS
  useEffect(() => {
    console.log('🔄 Efecto startScanner ejecutado:', { isActive, permissionsGranted, selectedCamera, isScanning })
    
    if (!isActive || !permissionsGranted || !selectedCamera || isScanning) {
      console.log('❌ Condiciones no cumplidas para iniciar scanner')
      return
    }

    console.log('✅ Condiciones cumplidas, programando inicio de scanner...')
    
    const timer = setTimeout(() => {
      if (isMountedRef.current && !isScanning) {
        console.log('⏰ Timer ejecutado, iniciando scanner...')
        startScanner()
      } else {
        console.log('❌ Condiciones cambiaron durante timer, cancelando inicio')
      }
    }, 1500)
    
    return () => {
      console.log('🧹 Limpiando timer de startScanner')
      clearTimeout(timer)
    }
  }, [isActive, permissionsGranted, selectedCamera]) // Sin startScanner ni isScanning para evitar ciclos

  useEffect(() => {
    return () => {
      isMountedRef.current = false
      cleanupScanner()
      
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
    }
  }, [cleanupScanner])

  return (
    <div className={`qr-reader-alternative ${className}`}>
      {/* Controles principales (mantener intactos + añadir botón de controles avanzados) */}
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

          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`btn btn-sm ${soundEnabled ? 'btn-info' : 'btn-outline-secondary'}`}
            title={soundEnabled ? 'Deshabilitar sonido' : 'Habilitar sonido'}
          >
            <i className={`bi bi-volume-${soundEnabled ? 'up' : 'mute'} me-2`}></i>
            {soundEnabled ? 'Sonido ON' : 'Sonido OFF'}
          </button>

          {soundEnabled && (
            <button
              onClick={testSound}
              className='btn btn-outline-info btn-sm'
              title='Probar sonido'
            >
              <i className='bi bi-music-note me-2'></i>
              Probar
            </button>
          )}

          {/* Botón para controles avanzados */}
          {cameraCapabilities && (
            <button
              onClick={() => setShowAdvancedControls(!showAdvancedControls)}
              className={`btn btn-sm ${showAdvancedControls ? 'btn-secondary' : 'btn-outline-secondary'}`}
              title='Controles avanzados de cámara'
            >
              <i className='bi bi-sliders me-2'></i>
              Controles
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

      {/* Panel de controles avanzados */}
      {showAdvancedControls && cameraCapabilities && isScanning && (
        <div className='card mb-4'>
          <div className='card-header d-flex justify-content-between align-items-center'>
            <h6 className='mb-0'>
              <i className='bi bi-sliders me-2'></i>
              Controles Avanzados de Cámara
            </h6>
            <button
              onClick={() => setShowAdvancedControls(false)}
              className='btn btn-sm btn-outline-secondary'
            >
              <i className='bi bi-x'></i>
            </button>
          </div>
          <div className='card-body'>
            {/* Checkbox para configuraciones recomendadas */}
            <div className='mb-3'>
              <div className='form-check'>
                <input
                  className='form-check-input'
                  type='checkbox'
                  id='qrRecommended'
                  checked={useQRRecommended}
                  onChange={(e) => setUseQRRecommended(e.target.checked)}
                />
                <label className='form-check-label' htmlFor='qrRecommended'>
                  <i className='bi bi-qr-code me-2'></i>
                  Ajustes recomendados para QR
                  <small className='text-muted d-block'>
                    Aplica enfoque manual al 50% y ajustes optimizados para códigos QR
                  </small>
                </label>
              </div>
            </div>

            {/* Información de configuraciones actuales */}
            <div className='mb-3'>
              <h6>Configuración Actual:</h6>
              <div className='row'>
                <div className='col-md-6'>
                  <small className='text-muted'>
                    <strong>Modo Enfoque:</strong> {currentCameraSettings.focusMode || 'No disponible'}
                  </small>
                </div>
                <div className='col-md-6'>
                  <small className='text-muted'>
                    <strong>Distancia Enfoque:</strong> {
                      currentCameraSettings.focusDistance !== undefined 
                        ? currentCameraSettings.focusDistance.toFixed(2) 
                        : 'No disponible'
                    }
                  </small>
                </div>
              </div>
            </div>

            {/* Controles de sliders */}
            <div className='row'>
              {/* Control de enfoque */}
              {cameraCapabilities.focusDistance && (
                <div className='col-md-6 mb-3'>
                  <label className='form-label'>
                    <i className='bi bi-camera-reels me-2'></i>
                    Distancia de Enfoque: {
                      currentCameraSettings.focusDistance !== undefined
                        ? currentCameraSettings.focusDistance.toFixed(2)
                        : 'N/A'
                    }
                  </label>
                  <input
                    type='range'
                    className='form-range'
                    min={cameraCapabilities.focusDistance.min}
                    max={cameraCapabilities.focusDistance.max}
                    step={cameraCapabilities.focusDistance.step || 0.01}
                    value={currentCameraSettings.focusDistance || cameraCapabilities.focusDistance.min}
                    onChange={async (e) => {
                      const value = parseFloat(e.target.value)
                      await applyCameraConstraints({ focusDistance: value })
                    }}
                  />
                  <div className='d-flex justify-content-between'>
                    <small className='text-muted'>Cerca ({cameraCapabilities.focusDistance.min})</small>
                    <small className='text-muted'>Lejos ({cameraCapabilities.focusDistance.max})</small>
                  </div>
                </div>
              )}

              {/* Control de brillo */}
              {cameraCapabilities.brightness && (
                <div className='col-md-6 mb-3'>
                  <label className='form-label'>
                    <i className='bi bi-brightness-high me-2'></i>
                    Brillo: {
                      currentCameraSettings.brightness !== undefined
                        ? currentCameraSettings.brightness
                        : 'N/A'
                    }
                  </label>
                  <input
                    type='range'
                    className='form-range'
                    min={cameraCapabilities.brightness.min}
                    max={cameraCapabilities.brightness.max}
                    step={cameraCapabilities.brightness.step || 1}
                    value={currentCameraSettings.brightness || 0}
                    onChange={async (e) => {
                      const value = parseInt(e.target.value)
                      await applyCameraConstraints({ brightness: value })
                    }}
                  />
                </div>
              )}

              {/* Control de contraste */}
              {cameraCapabilities.contrast && (
                <div className='col-md-6 mb-3'>
                  <label className='form-label'>
                    <i className='bi bi-circle-half me-2'></i>
                    Contraste: {
                      currentCameraSettings.contrast !== undefined
                        ? currentCameraSettings.contrast
                        : 'N/A'
                    }
                  </label>
                  <input
                    type='range'
                    className='form-range'
                    min={cameraCapabilities.contrast.min}
                    max={cameraCapabilities.contrast.max}
                    step={cameraCapabilities.contrast.step || 1}
                    value={currentCameraSettings.contrast || 0}
                    onChange={async (e) => {
                      const value = parseInt(e.target.value)
                      await applyCameraConstraints({ contrast: value })
                    }}
                  />
                </div>
              )}

              {/* Control de saturación */}
              {cameraCapabilities.saturation && (
                <div className='col-md-6 mb-3'>
                  <label className='form-label'>
                    <i className='bi bi-palette me-2'></i>
                    Saturación: {
                      currentCameraSettings.saturation !== undefined
                        ? currentCameraSettings.saturation
                        : 'N/A'
                    }
                  </label>
                  <input
                    type='range'
                    className='form-range'
                    min={cameraCapabilities.saturation.min}
                    max={cameraCapabilities.saturation.max}
                    step={cameraCapabilities.saturation.step || 1}
                    value={currentCameraSettings.saturation || 0}
                    onChange={async (e) => {
                      const value = parseInt(e.target.value)
                      await applyCameraConstraints({ saturation: value })
                    }}
                  />
                </div>
              )}
            </div>

            {/* Selector de modo de enfoque */}
            {cameraCapabilities.focusMode && (
              <div className='mb-3'>
                <label className='form-label'>
                  <i className='bi bi-eye me-2'></i>
                  Modo de Enfoque
                </label>
                <select
                  className='form-select'
                  value={currentCameraSettings.focusMode || ''}
                  onChange={async (e) => {
                    await applyCameraConstraints({ focusMode: e.target.value })
                  }}
                >
                  {cameraCapabilities.focusMode.map((mode) => (
                    <option key={mode} value={mode}>
                      {mode === 'manual' ? 'Manual' : 
                       mode === 'continuous' ? 'Continuo' :
                       mode === 'single-shot' ? 'Una vez' : mode}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Información de capabilities */}
            <div className='mt-3 p-2 bg-light rounded'>
              <small className='text-muted'>
                <strong>Capacidades disponibles:</strong>{' '}
                {Object.keys(cameraCapabilities).filter(key => 
                  ['focusMode', 'focusDistance', 'brightness', 'contrast', 'saturation', 'zoom'].includes(key)
                ).join(', ') || 'Ninguna'}
              </small>
            </div>
          </div>
        </div>
      )}

      {/* Área del scanner (mantener intacta) */}
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
                  </div>
                </>
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
                        {cameraCapabilities && <small>Obteniendo controles avanzados...</small>}
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
                {soundEnabled && (
                  <>
                    {' • '}
                    <i className='bi bi-volume-up me-1'></i>
                    Sonido habilitado
                  </>
                )}
                {useQRRecommended && (
                  <>
                    {' • '}
                    <i className='bi bi-gear me-1'></i>
                    Ajustes QR activos
                  </>
                )}
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

      {/* Info de estado (mantener intacta + añadir información de controles) */}
      <div className='mt-4 p-3 bg-light rounded'>
        <div className='row text-center'>
          <div className='col-2'>
            <i className='bi bi-camera-video fs-4 text-primary'></i>
            <br />
            <small className='text-muted'>Cámara</small>
          </div>
          <div className='col-2'>
            <i className='bi bi-qr-code-scan fs-4 text-success'></i>
            <br />
            <small className='text-muted'>Detección</small>
          </div>
          <div className='col-2'>
            <i className={`bi bi-volume-${soundEnabled ? 'up' : 'mute'} fs-4 ${soundEnabled ? 'text-info' : 'text-muted'}`}></i>
            <br />
            <small className='text-muted'>Audio</small>
          </div>
          <div className='col-2'>
            <i className={`bi bi-sliders fs-4 ${cameraCapabilities ? 'text-warning' : 'text-muted'}`}></i>
            <br />
            <small className='text-muted'>Controles</small>
          </div>
          <div className='col-2'>
            <i className={`bi bi-gear fs-4 ${useQRRecommended ? 'text-success' : 'text-muted'}`}></i>
            <br />
            <small className='text-muted'>QR Ajustes</small>
          </div>
          <div className='col-2'>
            <i className='bi bi-speedometer2 fs-4 text-warning'></i>
            <br />
            <small className='text-muted'>Tiempo real</small>
          </div>
        </div>

        <hr />

        <div className='row'>
          <div className='col-4'>
            <small className='text-muted'>
              🔐 Permisos:{' '}
              <span className={permissionsGranted ? 'text-success' : 'text-danger'}>
                {permissionsGranted ? 'Concedidos' : 'Pendientes'}
              </span>
            </small>
          </div>
          <div className='col-4'>
            <small className='text-muted'>
              📹 Cámaras: <span className='text-info'>{cameras.length}</span>
            </small>
          </div>
          <div className='col-4'>
            <small className='text-muted'>
              🔊 Sonido: <span className={soundEnabled ? 'text-success' : 'text-muted'}>{soundEnabled ? 'Habilitado' : 'Deshabilitado'}</span>
            </small>
          </div>
        </div>
        <div className='row mt-1'>
          <div className='col-4'>
            <small className='text-muted'>
              🔄 Estado:{' '}
              <span className={isScanning ? 'text-success' : 'text-secondary'}>
                {isScanning ? 'Activo' : 'Inactivo'}
              </span>
            </small>
          </div>
          <div className='col-4'>
            <small className='text-muted'>
              ⚙️ Controles: <span className={cameraCapabilities ? 'text-success' : 'text-muted'}>
                {cameraCapabilities ? 'Disponibles' : 'No disponibles'}
              </span>
            </small>
          </div>
          <div className='col-4'>
            <small className='text-muted'>
              🎯 Ajustes QR: <span className={useQRRecommended ? 'text-success' : 'text-muted'}>
                {useQRRecommended ? 'Activos' : 'Inactivos'}
              </span>
            </small>
          </div>
        </div>
      </div>
    </div>
  )
}