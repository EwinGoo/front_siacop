import React, {useRef, useState, useEffect, useCallback} from 'react'
import {Html5Qrcode} from 'html5-qrcode'
import { 
  handleQRError, 
  getOptimalQRConfig, 
  generateQRReaderId,
  QRSettingsStorage,
  getDeviceType
} from '../../utils/qrUtils';

// ✅ SOLUCION: Extender MediaTrackCapabilities para C920
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
  // Otras propiedades avanzadas de C920
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
}

// Helper para verificar soporte de funciones
const supportsAdvancedControls = (capabilities: ExtendedMediaTrackCapabilities) => ({
  focusMode: !!(capabilities.focusMode && capabilities.focusMode.includes('manual')),
  focusDistance: !!capabilities.focusDistance,
  zoom: !!capabilities.zoom,
  brightness: !!capabilities.brightness,
  contrast: !!capabilities.contrast
})

// ✅ SOLUCION: Extender MediaTrackConstraintSet para constraints avanzadas
interface ExtendedMediaTrackConstraintSet {
  focusMode?: string
  focusDistance?: number
  zoom?: number
  brightness?: number
  contrast?: number
}

interface QRReaderAlternativeProps {
  onQRDetected: (result: {code: string; timestamp: number; rawData?: any}) => void
  autoStart?: boolean
  className?: string
}

// Configuraciones específicas para C920 - TODAS OPCIONALES
const C920_CONSTRAINTS = {
  width: { ideal: 1920 },
  height: { ideal: 1080 }, 
  frameRate: { ideal: 30 },
  // ✅ SOLUCION: Hacer todas las constraints opcionales (no obligatorias)
  // Remover constraints problemáticas de la configuración inicial
}

// ✅ NUEVA: Configuración segura para cualquier cámara
const SAFE_CONSTRAINTS = {
  width: { ideal: 1280, min: 640 },
  height: { ideal: 720, min: 480 },
  frameRate: { ideal: 15, min: 10 }
}

// Configuraciones por defecto para C920 según tipo de QR
const C920_PRESETS = {
  qr_movil: { focus: 0.2, zoom: 1.5, label: '📱 QR Móvil' },
  qr_papel: { focus: 0.3, zoom: 1.2, label: '🎫 QR Papel' },
  qr_pantalla: { focus: 0.5, zoom: 1.0, label: '📺 QR Pantalla' },
  default: { focus: 0.3, zoom: 1.0, label: '🔄 Reset' }
}

export const QRReaderAlternative: React.FC<QRReaderAlternativeProps> = ({
  onQRDetected,
  autoStart = true,
  className = '',
}) => {
  // Estados básicos existentes
  const [isActive, setIsActive] = useState(autoStart)
  const [isScanning, setIsScanning] = useState(false)
  const [cameras, setCameras] = useState<Array<{deviceId: string; label: string}>>([])
  const [selectedCamera, setSelectedCamera] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [permissionsGranted, setPermissionsGranted] = useState(false)

  // Estados para controles C920
  const [focusDistance, setFocusDistance] = useState(0.3)
  const [zoomLevel, setZoomLevel] = useState(1.0)
  const [cameraCapabilities, setCameraCapabilities] = useState<any>(null)
  const [currentStream, setCurrentStream] = useState<MediaStream | null>(null)
  const [isC920, setIsC920] = useState(false)
  const [showAdvancedControls, setShowAdvancedControls] = useState(false)

  // Referencias existentes
  const containerRef = useRef<HTMLDivElement>(null)
  const scannerRef = useRef<Html5Qrcode | null>(null)
  const isMountedRef = useRef(true)
  const lastScannedRef = useRef<Map<string, number>>(new Map())
  const containerIdRef = useRef(generateQRReaderId())

  // Cargar configuraciones guardadas al montar
  useEffect(() => {
    const savedSettings = QRSettingsStorage.load()
    if (savedSettings.focusDistance !== undefined) {
      setFocusDistance(savedSettings.focusDistance)
    }
    if (savedSettings.zoomLevel !== undefined) {
      setZoomLevel(savedSettings.zoomLevel)
    }
    if (savedSettings.showAdvancedControls !== undefined) {
      setShowAdvancedControls(savedSettings.showAdvancedControls)
    }
  }, [])

  // Guardar configuraciones cuando cambien
  const saveSettings = useCallback(() => {
    QRSettingsStorage.save({
      focusDistance,
      zoomLevel,
      showAdvancedControls,
      selectedCamera
    })
  }, [focusDistance, zoomLevel, showAdvancedControls, selectedCamera])

  // Aplicar configuraciones C920 de forma más defensiva - SIN DETENER SCANNER
  const applyCameraSettings = useCallback(async () => {
    if (!currentStream || !isC920 || !scannerRef.current) return

    const videoTrack = currentStream.getVideoTracks()[0]
    if (!videoTrack) return

    try {
      // Usar la interfaz extendida
      const capabilities = videoTrack.getCapabilities() as ExtendedMediaTrackCapabilities
      setCameraCapabilities(capabilities)

      // Verificar qué funciones están disponibles
      const support = supportsAdvancedControls(capabilities)
      console.log('Capabilities detectadas:', support)

      // Aplicar constraints una por una para evitar fallos masivos
      let successfulConstraints: string[] = []

      // Probar enfoque SOLO si está soportado
      if (support.focusMode && support.focusDistance) {
        try {
          const focusConstraints: ExtendedMediaTrackConstraintSet = {
            focusMode: 'manual',
            focusDistance: Math.max(
              capabilities.focusDistance!.min || 0.1,
              Math.min(capabilities.focusDistance!.max || 10, focusDistance)
            )
          }
          
          // Type assertion para las constraints avanzadas
          await videoTrack.applyConstraints({ 
            advanced: [focusConstraints as MediaTrackConstraintSet] 
          })
          successfulConstraints.push('focus')
          console.log('Enfoque aplicado:', focusConstraints.focusDistance)
        } catch (focusErr) {
          console.warn('No se pudo aplicar enfoque:', focusErr)
          // NO deshabilitar C920, solo continuar sin enfoque
        }
      }

      // Probar zoom SOLO si está soportado - CON PAUSA
      if (support.zoom) {
        try {
          // Pausa entre aplicaciones para evitar conflictos
          await new Promise(resolve => setTimeout(resolve, 500))
          
          const zoomConstraints: ExtendedMediaTrackConstraintSet = {
            zoom: Math.max(
              capabilities.zoom!.min || 1.0,
              Math.min(capabilities.zoom!.max || 3.0, zoomLevel)
            )
          }
          
          // Type assertion para las constraints de zoom
          await videoTrack.applyConstraints({ 
            advanced: [zoomConstraints as MediaTrackConstraintSet] 
          })
          successfulConstraints.push('zoom')
          console.log('Zoom aplicado:', zoomConstraints.zoom)
        } catch (zoomErr: unknown) {
          console.warn('No se pudo aplicar zoom:', zoomErr)
          // NO deshabilitar C920, solo continuar sin zoom
        }
      }

      // Solo guardar configuraciones si al menos una función funcionó
      if (successfulConstraints.length > 0) {
        console.log('C920 configurada exitosamente:', successfulConstraints)
        saveSettings()
      } else {
        console.log('Configuraciones avanzadas no disponibles, continuando en modo básico C920')
        // NO llamar setIsC920(false) - mantener la detección pero sin controles
      }

    } catch (err) {
      console.warn('Error aplicando configuraciones C920 (continuando):', err)
      // NO detener el scanner, solo deshabilitar controles avanzados
      // El scanner debe seguir funcionando
    }
  }, [currentStream, focusDistance, zoomLevel, isC920, saveSettings])

  // Debounce para códigos duplicados - usando utilidad existente
  const isRecentlyScanned = useCallback((code: string): boolean => {
    const now = Date.now()
    const lastScan = lastScannedRef.current.get(code)

    if (lastScan && now - lastScan < 3000) {
      return true
    }

    lastScannedRef.current.set(code, now)
    return false
  }, [])

  // Cleanup seguro del scanner - CON LOGGING MEJORADO
  const cleanupScanner = useCallback(async () => {
    // Identificar quién está llamando cleanup
    const stack = new Error().stack
    const caller = stack?.split('\n')[2]?.trim() || 'Desconocido'
    console.log('🛑 Deteniendo scanner... Llamado desde:', caller)
    
    // Evitar múltiples limpiezas concurrentes
    if (scannerRef.current) {
      try {
        const state = scannerRef.current.getState()
        if (state === 2) { // Running
          console.log('📹 Deteniendo video stream...')
          await scannerRef.current.stop()
        }
        
        // Pausa para permitir que el DOM se estabilice
        await new Promise(resolve => setTimeout(resolve, 100))
        
        // Limpiar el scanner pero manejar errores DOM
        try {
          await scannerRef.current.clear()
        } catch (clearErr) {
          console.warn('Error durante clear (ignorando):', clearErr)
          // Continuar con cleanup manual
        }
        
      } catch (err) {
        console.warn('Error durante stop (ignorando):', err)
      } finally {
        scannerRef.current = null
      }
    }

    // Limpiar stream por separado
    if (currentStream) {
      try {
        currentStream.getTracks().forEach(track => {
          if (track.readyState !== 'ended') {
            track.stop()
          }
        })
      } catch (streamErr) {
        console.warn('Error deteniendo stream:', streamErr)
      }
      setCurrentStream(null)
    }

    // Cleanup manual del DOM si es necesario
    if (containerRef.current && isMountedRef.current) {
      try {
        // Solo limpiar si el contenedor aún existe en el DOM
        if (containerRef.current.parentNode) {
          const videos = containerRef.current.querySelectorAll('video')
          videos.forEach(video => {
            try {
              video.pause()
              video.srcObject = null
              video.src = ''
              video.load()
            } catch (videoErr) {
              console.warn('Error limpiando video:', videoErr)
            }
          })
          
          // Limpiar contenido solo si es seguro
          setTimeout(() => {
            if (containerRef.current && containerRef.current.parentNode) {
              containerRef.current.innerHTML = ''
            }
          }, 200)
        }
      } catch (domErr) {
        console.warn('Error en cleanup DOM:', domErr)
      }
    }

    if (isMountedRef.current) {
      setIsScanning(false)
      setCameraCapabilities(null)
    }
  }, [currentStream])

  // ✅ SOLUCION: Verificar soporte de medios y solicitar permisos de forma segura
  const checkMediaSupport = useCallback((): string | null => {
    // Verificar si estamos en un navegador
    if (typeof navigator === 'undefined') {
      return 'Navigator no disponible (ejecutándose en servidor)'
    }

    // Verificar si el navegador soporta mediaDevices
    if (!navigator.mediaDevices) {
      return 'Tu navegador no soporta acceso a cámara'
    }

    // Verificar si getUserMedia está disponible
    if (!navigator.mediaDevices.getUserMedia) {
      return 'getUserMedia no está disponible'
    }

    // Verificar protocolo seguro (HTTPS o localhost)
    if (window.location.protocol !== 'https:' && !window.location.hostname.includes('localhost') && window.location.hostname !== '127.0.0.1') {
      return 'Se requiere HTTPS para acceder a la cámara'
    }

    return null // Todo OK
  }, [])

  const requestPermissions = useCallback(async (): Promise<boolean> => {
    try {
      // ✅ Verificar soporte antes de intentar acceso
      const supportError = checkMediaSupport()
      if (supportError) {
        if (isMountedRef.current) {
          setError(supportError)
          setPermissionsGranted(false)
        }
        return false
      }

      // ✅ SOLUCION: Usar constraints seguras para la prueba inicial
      const deviceType = getDeviceType()
      let constraints

      if (deviceType === 'mobile') {
        constraints = {
          video: { 
            facingMode: 'environment',
            width: { ideal: 1280 },
            height: { ideal: 720 }
          }
        }
      } else {
        // Para desktop, usar constraints básicas primero
        constraints = {
          video: SAFE_CONSTRAINTS
        }
      }

      console.log('🔍 Probando acceso con constraints seguras:', constraints)

      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      stream.getTracks().forEach((track) => track.stop())

      if (isMountedRef.current) {
        setPermissionsGranted(true)
        setError(null)
      }
      return true
    } catch (err: any) {
      console.error('→ Error de permisos:', err)
      if (isMountedRef.current) {
        // ✅ Mejorar el manejo de errores específicos
        if (err.name === 'OverconstrainedError') {
          setError('Las configuraciones de cámara no son compatibles. Probando modo básico...')
          // Intentar con constraints mínimas
          try {
            const basicStream = await navigator.mediaDevices.getUserMedia({ video: true })
            basicStream.getTracks().forEach(track => track.stop())
            setPermissionsGranted(true)
            setError(null)
            return true
          } catch (basicErr: any) {
            setError(`Error de permisos: ${handleQRError(basicErr)}`)
          }
        } else {
          setError(`Error de permisos: ${handleQRError(err)}`)
        }
        setPermissionsGranted(false)
      }
      return false
    }
  }, [checkMediaSupport])

  // Obtener cámaras y detectar C920 de forma segura
  const getCameras = useCallback(async () => {
    try {
      // ✅ Verificar soporte antes de enumerar dispositivos
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
        
        // Detectar C920 automáticamente
        const c920Device = videoDevices.find(camera => 
          camera.label.toLowerCase().includes('c920') ||
          camera.label.toLowerCase().includes('logitech hd pro webcam')
        )

        if (c920Device) {
          setIsC920(true)
          setSelectedCamera(c920Device.deviceId)
          console.log('🎯 C920 detectada:', c920Device.label)
        } else if (videoDevices.length > 0 && !selectedCamera) {
          setSelectedCamera(videoDevices[0].deviceId)
        }
      }
    } catch (err: any) {
      if (isMountedRef.current) {
        setError(`Error obteniendo cámaras: ${err.message}`)
      }
    }
  }, [selectedCamera, checkMediaSupport])

  // Iniciar scanner con configuración progresiva - MEJORADO
  const startScanner = useCallback(async () => {
    if (!isMountedRef.current || !permissionsGranted || !selectedCamera || !containerRef.current) {
      return
    }

    // Definir scanner fuera del try para que esté disponible en el catch
    let scanner: Html5Qrcode | null = null

    try {
      // Cleanup más agresivo antes de iniciar
      await cleanupScanner()
      await new Promise((resolve) => setTimeout(resolve, 800)) // Más tiempo para cleanup

      if (!isMountedRef.current) return

      const container = containerRef.current
      
      // Verificar que el contenedor aún existe y está en el DOM
      if (!container.parentNode) {
        console.warn('Contenedor no está en el DOM, cancelando inicio de scanner')
        return
      }

      // Limpiar contenido previo de forma más segura
      container.innerHTML = ''
      container.id = containerIdRef.current

      scanner = new Html5Qrcode(containerIdRef.current)
      scannerRef.current = scanner

      // Configuración progresiva - Empezar básico, mejorar después
      const optimalConfig = getOptimalQRConfig()
      
      // Configuración inicial segura
      let videoConstraints: any = {
        deviceId: selectedCamera
      }

      // Solo aplicar constraints mejoradas si es C920
      if (isC920) {
        videoConstraints = {
          ...videoConstraints,
          ...SAFE_CONSTRAINTS
        }
      }

      const enhancedConfig = {
        ...optimalConfig,
        fps: isC920 ? 15 : optimalConfig.fps,
        qrbox: isC920 
          ? { width: 300, height: 300 }
          : optimalConfig.qrbox,
        videoConstraints
      }

      console.log('Iniciando scanner con config:', enhancedConfig)

      await scanner.start(
        selectedCamera,
        enhancedConfig,
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
          // Filtrar mensajes de parsing normales pero mostrar problemas reales
          if (errorMessage.toLowerCase().includes('no qr code found')) {
            return // Silenciar - es normal
          }
          
          if (errorMessage.includes('NotFoundException') || 
              errorMessage.includes('No MultiFormat Readers')) {
            // Solo mostrar cada cierto tiempo para evitar spam
            const now = Date.now()
            const lastShown = (window as any).__qr_last_parse_error || 0
            if (now - lastShown > 5000) { // Mostrar solo cada 5 segundos
              console.info('🔍 Escaneando... (no encuentra QR válido en vista)')
              ;(window as any).__qr_last_parse_error = now
            }
            return
          }

          // Mostrar otros errores importantes
          if (!errorMessage.includes('AbortError') && !errorMessage.includes('removeChild')) {
            console.warn('QR Scanner warning:', errorMessage)
          }
        }
      )

      // Esperar estabilización antes de obtener el stream
      await new Promise(resolve => setTimeout(resolve, 500))

      // Verificar que todo sigue activo antes de continuar
      if (!isMountedRef.current || !scannerRef.current) {
        return
      }

      // Obtener stream y aplicar configuraciones avanzadas
      const video = container.querySelector('video')
      if (video && video.srcObject) {
        const stream = video.srcObject as MediaStream
        setCurrentStream(stream)
        
        // Solo aplicar configuraciones avanzadas si es C920
        if (isC920) {
          console.log('C920 detectada - TEMPORALMENTE DESHABILITANDO configuraciones avanzadas para debugging')
          // TEMPORALMENTE COMENTADO PARA DEBUGGING:
          // setTimeout(() => {
          //   if (isMountedRef.current && scannerRef.current) {
          //     applyCameraSettings()
          //   }
          // }, 2000)
          
          // En su lugar, solo mostrar mensaje
          setTimeout(() => {
            if (isMountedRef.current) {
              console.log('Scanner C920 funcionando en modo básico (configuraciones avanzadas deshabilitadas temporalmente)')
            }
          }, 2000)
        }
      }

      if (isMountedRef.current) {
        setIsScanning(true)
        setError(null)
      }
    } catch (err: unknown) {
      console.error('Error iniciando scanner:', err)
      if (isMountedRef.current) {
        // Manejo inteligente de errores de constraints
        if (err instanceof Error && (err.name === 'OverconstrainedError' || err.message?.includes('constraint'))) {
          console.log('Constraints no soportadas, intentando modo básico...')
          setError('Modo avanzado no soportado. Usando configuración básica...')
          
          // Reintentar con configuración mínima después de más tiempo
          try {
            await new Promise(resolve => setTimeout(resolve, 1500))
            
            // Verificar que el scanner todavía existe y el componente está montado
            if (scanner && isMountedRef.current && containerRef.current?.parentNode) {
              const basicConfig = {
                fps: 10,
                qrbox: { width: 250, height: 250 },
                // Sin videoConstraints avanzadas
              }
              
              await scanner.start(
                selectedCamera, 
                basicConfig, 
                (decodedText: string) => {
                  if (!isMountedRef.current) return
                  const code = decodedText.includes('/') 
                    ? decodedText.split('/').pop() || decodedText 
                    : decodedText
                  if (!isRecentlyScanned(code)) {
                    onQRDetected({ code, timestamp: Date.now(), rawData: decodedText })
                  }
                },
                (errorMessage: string) => {
                  // Callback de errores - filtrar errores de cleanup
                  if (!errorMessage.toLowerCase().includes('no qr code found') && 
                      !errorMessage.includes('AbortError') && 
                      !errorMessage.includes('removeChild')) {
                    console.warn('QR Scanner error (modo básico):', errorMessage)
                  }
                }
              )
              
              if (isMountedRef.current) {
                setIsScanning(true)
                setError(null)
                setIsC920(false) // Deshabilitar controles avanzados
                console.log('Scanner iniciado en modo básico')
              }
            }
            
          } catch (basicErr: unknown) {
            if (isMountedRef.current) {
              const errorMsg = basicErr instanceof Error ? basicErr.message : 'Error desconocido'
              setError(`Error iniciando scanner: ${handleQRError({ message: errorMsg })}`)
              setIsScanning(false)
            }
          }
        } else {
          const errorMsg = err instanceof Error ? err.message : 'Error desconocido'
          setError(`Error iniciando scanner: ${handleQRError({ message: errorMsg })}`)
          setIsScanning(false)
        }
      }
    }
  }, [selectedCamera, permissionsGranted, onQRDetected, isRecentlyScanned, cleanupScanner, applyCameraSettings, isC920])

  // Handlers para controles C920
  const handleFocusChange = useCallback((newFocus: number) => {
    setFocusDistance(newFocus)
  }, [])

  const handleZoomChange = useCallback((newZoom: number) => {
    setZoomLevel(newZoom)
  }, [])

  const applyPreset = useCallback((presetKey: keyof typeof C920_PRESETS) => {
    const preset = C920_PRESETS[presetKey]
    setFocusDistance(preset.focus)
    setZoomLevel(preset.zoom)
  }, [])

  // Aplicar configuraciones cuando cambien - SOLUCION: sin dependencias problemáticas
  useEffect(() => {
    console.log('🎯 Efecto applyCameraSettings ejecutado:', { isScanning, isC920, hasStream: !!currentStream })
    
    if (isScanning && currentStream && isC920) {
      console.log('⚙️ Programando aplicación de configuraciones...')
      const timer = setTimeout(() => {
        console.log('⏰ Aplicando configuraciones de cámara')
        // Llamar directamente sin usar la referencia
        if (currentStream && isC920) {
          applyCameraSettings()
        }
      }, 300)
      return () => {
        console.log('🧹 Limpiando timer de configuraciones')
        clearTimeout(timer)
      }
    }
  }, [focusDistance, zoomLevel]) // ✅ SOLO valores simples, sin funciones

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

  // Cambiar cámara y detectar si es C920
  const switchCamera = useCallback(
    async (deviceId: string) => {
      await cleanupScanner()
      
      // Detectar si la nueva cámara es C920
      const selectedCameraInfo = cameras.find(c => c.deviceId === deviceId)
      const newIsC920 = selectedCameraInfo?.label.toLowerCase().includes('c920') ||
                       selectedCameraInfo?.label.toLowerCase().includes('logitech') || false
      
      setIsC920(newIsC920)
      
      setTimeout(() => {
        if (isMountedRef.current) {
          setSelectedCamera(deviceId)
        }
      }, 500)
    },
    [cleanupScanner, cameras]
  )

  const forcePermissions = useCallback(async () => {
    // ✅ Verificar soporte antes de forzar permisos
    const supportError = checkMediaSupport()
    if (supportError) {
      setError(`❌ ${supportError}`)
      return
    }

    const granted = await requestPermissions()
    if (granted) {
      await getCameras()
    }
  }, [requestPermissions, getCameras, checkMediaSupport])

  // Efectos de inicialización - SOLUCION: sin dependencias de funciones
  useEffect(() => {
    console.log('🚀 Efecto inicialización ejecutado:', { isActive })
    
    if (!isActive) {
      console.log('❌ Scanner inactivo, no iniciando')
      return
    }

    const init = async () => {
      console.log('🔄 Inicializando permisos y cámaras...')
      
      if (!permissionsGranted) {
        console.log('📷 Solicitando permisos...')
        const granted = await requestPermissions()
        if (granted) {
          console.log('✅ Permisos concedidos, obteniendo cámaras...')
          await getCameras()
        }
      } else if (cameras.length === 0) {
        console.log('📹 Ya hay permisos pero no hay cámaras, obteniendo...')
        await getCameras()
      }
    }
    
    init()
  }, [isActive]) // ✅ SOLO isActive - sin funciones problemáticas

  // Efecto para iniciar scanner - SOLUCION: quitar startScanner de dependencias
  useEffect(() => {
    console.log('🔄 Efecto startScanner ejecutado:', { isActive, permissionsGranted, selectedCamera })
    
    if (isActive && permissionsGranted && selectedCamera) {
      console.log('✅ Condiciones cumplidas, programando inicio de scanner...')
      const timer = setTimeout(() => {
        console.log('⏰ Timer ejecutado, iniciando scanner...')
        startScanner()
      }, 1000)
      
      return () => {
        console.log('🧹 Limpiando timer de startScanner')
        clearTimeout(timer)
      }
    } else {
      console.log('❌ Condiciones no cumplidas para iniciar scanner')
    }
  }, [isActive, permissionsGranted, selectedCamera]) // ✅ SOLUCION: Removido startScanner de dependencias

  useEffect(() => {
    return () => {
      isMountedRef.current = false
      cleanupScanner()
    }
  }, [cleanupScanner])

  return (
    <div className={`qr-reader-alternative ${className}`}>
      {/* ⚠️ PANEL DE ADVERTENCIAS Y SOPORTE */}
      {!permissionsGranted && error && (
        <div className='row mb-4'>
          <div className='col-12'>
            <div className='alert alert-danger border-danger'>
              <div className='row'>
                <div className='col-md-8'>
                  <h6 className='alert-heading mb-2'>
                    <i className='bi bi-exclamation-triangle me-2'></i>
                    Error de Acceso a Cámara
                  </h6>
                  <p className='mb-2'><strong>{error}</strong></p>
                  
                  {/* Soluciones específicas según el tipo de error */}
                  {error.includes('HTTPS') && (
                    <div className='small'>
                      <strong>💡 Solución:</strong>
                      <ul className='mb-0 mt-1'>
                        <li>Usa <code>https://</code> en lugar de <code>http://</code></li>
                        <li>O accede desde <code>localhost</code> para desarrollo</li>
                      </ul>
                    </div>
                  )}
                  
                  {error.includes('no soporta') && (
                    <div className='small'>
                      <strong>💡 Soluciones:</strong>
                      <ul className='mb-0 mt-1'>
                        <li>Actualiza tu navegador a la versión más reciente</li>
                        <li>Usa Chrome, Firefox, Safari o Edge modernos</li>
                        <li>Evita navegadores muy antiguos o personalizados</li>
                      </ul>
                    </div>
                  )}
                  
                  {error.includes('denegado') && (
                    <div className='small'>
                      <strong>💡 Soluciones:</strong>
                      <ul className='mb-0 mt-1'>
                        <li>Haz clic en el icono de cámara en la barra de direcciones</li>
                        <li>Selecciona "Permitir" para este sitio</li>
                        <li>Recarga la página después de dar permisos</li>
                      </ul>
                    </div>
                  )}
                  
                  {error.includes('otra aplicación') && (
                    <div className='small'>
                      <strong>💡 Soluciones:</strong>
                      <ul className='mb-0 mt-1'>
                        <li>Cierra otras aplicaciones que usen la cámara (Zoom, Teams, etc.)</li>
                        <li>Cierra otras pestañas del navegador que puedan estar usando la cámara</li>
                        <li>Reinicia el navegador si es necesario</li>
                      </ul>
                    </div>
                  )}
                </div>
                <div className='col-md-4 text-center'>
                  <div className='bg-danger bg-opacity-10 rounded p-3'>
                    <i className='bi bi-camera-video-off fs-1 text-danger'></i>
                    <br />
                    <small className='text-muted'>Cámara no disponible</small>
                    <br />
                    <button 
                      onClick={forcePermissions} 
                      className='btn btn-outline-danger btn-sm mt-2'
                    >
                      <i className='bi bi-arrow-clockwise me-1'></i>
                      Reintentar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CONTROLES PRINCIPALES */}
      <div className='row d-flex justify-content-between align-items-center mb-4'>
        <div className='col-md-6 d-flex align-items-center gap-3'>
          <button
            onClick={() => toggleScanner(!isActive)}
            className={`btn btn-sm ${isActive ? 'btn-danger' : 'btn-success'}`}
          >
            <i className={`bi bi-${isActive ? 'stop' : 'play'}-circle me-2`}></i>
            {isActive ? 'Detener' : 'Iniciar'}
          </button>

          {/* CONTROLES DE DEBUG TEMPORALES */}
          {/* {debugMode && (
            <>
              <button
                onClick={manualStartScanner}
                className='btn btn-primary btn-sm'
                disabled={!isActive || !permissionsGranted || !selectedCamera}
              >
                <i className='bi bi-play-fill me-2'></i>
                Manual Start
              </button>
              
              <button
                onClick={manualStopScanner}
                className='btn btn-warning btn-sm'
              >
                <i className='bi bi-stop-fill me-2'></i>
                Manual Stop
              </button>
              
              <button
                onClick={() => setDebugMode(false)}
                className='btn btn-secondary btn-sm'
              >
                <i className='bi bi-bug me-2'></i>
                Disable Debug
              </button>
            </>
          )} */}
{/* 
          {!debugMode && (
            <button
              onClick={() => setDebugMode(true)}
              className='btn btn-info btn-sm'
            >
              <i className='bi bi-bug-fill me-2'></i>
              Enable Debug
            </button>
          )} */}

          {error && !permissionsGranted && (
            <button onClick={forcePermissions} className='btn btn-warning btn-sm'>
              <i className='bi bi-camera me-2'></i>
              Dar Permisos
            </button>
          )}

          {isScanning && (
            <div className='d-flex align-items-center text-success'>
              <span className='spinner-border spinner-border-sm me-2'></span>
              <small>Escaneando{isC920 ? ' con C920' : ''}...</small>
            </div>
          )}

          <span className={`badge ${permissionsGranted ? 'bg-success' : 'bg-warning'}`}>
            {permissionsGranted ? '✓ Permisos OK' : '⚠ Sin permisos'}
          </span>

          {isC920 && (
            <span className='badge bg-primary'>
              🎯 C920 {cameraCapabilities ? 'Avanzada' : 'Básica'}
            </span>
          )}

          {/* ✅ NUEVO: Indicador cuando está en modo básico por limitaciones */}
          {!isC920 && cameras.some(c => c.label.toLowerCase().includes('c920')) && (
            <span className='badge bg-warning text-dark'>
              📹 C920 (Modo Básico)
            </span>
          )}
        </div>

        <div className='col-md-6 mt-3 mt-md-0 d-flex justify-content-end gap-2'>
          {/* Toggle controles avanzados */}
          {isC920 && (
            <button
              className={`btn btn-sm ${showAdvancedControls ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setShowAdvancedControls(!showAdvancedControls)}
            >
              <i className='bi bi-sliders me-2'></i>
              Controles
            </button>
          )}

          {/* Selector de cámara */}
          {cameras.length > 1 && (
            <select
              className='form-select form-select-sm'
              style={{width: 'auto'}}
              value={selectedCamera || ''}
              onChange={(e) => switchCamera(e.target.value)}
            >
              {cameras.map((camera) => (
                <option key={camera.deviceId} value={camera.deviceId}>
                  {camera.label} 
                  {camera.label.toLowerCase().includes('c920') && ' 🎯'}
                  {camera.label.toLowerCase().includes('logitech') && !camera.label.toLowerCase().includes('c920') && ' 📹'}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* CONTROLES AVANZADOS C920 - Solo mostrar si está activo */}
      {isC920 && showAdvancedControls && isScanning && cameraCapabilities && (
        <div className='row mb-4'>
          <div className='col-12'>
            <div className='card border-primary'>
              <div className='card-header bg-primary text-white d-flex justify-content-between align-items-center'>
                <h6 className='mb-0'>
                  <i className='bi bi-camera-reels me-2'></i>
                  Controles Logitech C920
                </h6>
                <button
                  className='btn btn-sm btn-light'
                  onClick={() => setShowAdvancedControls(false)}
                >
                  <i className='bi bi-x'></i>
                </button>
              </div>
              <div className='card-body'>
                {(() => {
                  // ✅ Usar la interfaz extendida para la UI
                  const extendedCaps = cameraCapabilities as ExtendedMediaTrackCapabilities
                  const support = supportsAdvancedControls(extendedCaps)
                  
                  return (
                    <>
                      <div className='row'>
                        {/* Control de Enfoque */}
                        {support.focusDistance && (
                          <div className='col-lg-6 mb-3'>
                            <label className='form-label'>
                              <i className='bi bi-bullseye me-2'></i>
                              Distancia de Enfoque: <strong>{focusDistance.toFixed(1)}m</strong>
                            </label>
                            <input
                              type='range'
                              className='form-range'
                              min={extendedCaps.focusDistance?.min || 0.1}
                              max={extendedCaps.focusDistance?.max || 10.0}
                              step='0.1'
                              value={focusDistance}
                              onChange={(e) => handleFocusChange(parseFloat(e.target.value))}
                            />
                            <div className='d-flex justify-content-between'>
                              <small className='text-muted'>Cerca (0.1m)</small>
                              <small className='text-primary fw-bold'>QR óptimo: 0.2-0.5m</small>
                              <small className='text-muted'>Lejos (10m)</small>
                            </div>
                          </div>
                        )}

                        {/* Control de Zoom */}
                        {support.zoom && (
                          <div className='col-lg-6 mb-3'>
                            <label className='form-label'>
                              <i className='bi bi-zoom-in me-2'></i>
                              Nivel de Zoom: <strong>{zoomLevel.toFixed(1)}x</strong>
                            </label>
                            <input
                              type='range'
                              className='form-range'
                              min={extendedCaps.zoom?.min || 1.0}
                              max={extendedCaps.zoom?.max || 3.0}
                              step='0.1'
                              value={zoomLevel}
                              onChange={(e) => handleZoomChange(parseFloat(e.target.value))}
                            />
                            <div className='d-flex justify-content-between'>
                              <small className='text-muted'>1.0x</small>
                              <small className='text-primary fw-bold'>QR óptimo: 1.2-1.8x</small>
                              <small className='text-muted'>3.0x</small>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Advertencia si no hay soporte completo */}
                      {(!support.focusDistance && !support.zoom) && (
                        <div className='alert alert-warning'>
                          <i className='bi bi-exclamation-triangle me-2'></i>
                          Tu navegador o cámara no soporta controles avanzados de enfoque/zoom.
                        </div>
                      )}

                      {/* Presets rápidos - Solo mostrar si al menos una función está disponible */}
                      {(support.focusDistance || support.zoom) && (
                        <div className='row mt-3'>
                          <div className='col-12'>
                            <label className='form-label fw-bold mb-2'>
                              <i className='bi bi-lightning me-2'></i>
                              Configuraciones Rápidas:
                            </label>
                            <div className='btn-group w-100' role='group'>
                              {Object.entries(C920_PRESETS).map(([key, preset]) => (
                                <button
                                  key={key}
                                  type='button'
                                  className={`btn btn-sm ${
                                    focusDistance === preset.focus && zoomLevel === preset.zoom
                                      ? 'btn-success'
                                      : 'btn-outline-primary'
                                  }`}
                                  onClick={() => applyPreset(key as keyof typeof C920_PRESETS)}
                                  title={`Enfoque: ${preset.focus}m, Zoom: ${preset.zoom}x`}
                                >
                                  {preset.label}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Información técnica */}
                      <div className='row mt-3'>
                        <div className='col-12'>
                          <div className='alert alert-info mb-0'>
                            <div className='row text-center'>
                              <div className='col-3'>
                                <small><strong>Resolución:</strong><br/>1920x1080</small>
                              </div>
                              <div className='col-3'>
                                <small><strong>FPS:</strong><br/>15 (optimizado)</small>
                              </div>
                              <div className='col-3'>
                                <small><strong>Área QR:</strong><br/>300x300px</small>
                              </div>
                              <div className='col-3'>
                                <small><strong>Soporte:</strong><br/>
                                  {support.focusDistance && '🎯'}
                                  {support.zoom && '🔍'}
                                  {(!support.focusDistance && !support.zoom) && '⚠️'}
                                </small>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )
                })()}
              </div>
            </div>
          </div>
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
                border: isC920 ? '2px solid #0d6efd' : '2px solid #333',
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
                        width: isC920 ? '300px' : '250px',
                        height: isC920 ? '300px' : '250px',
                        border: `3px solid ${isC920 ? '#0d6efd' : '#00ff00'}`,
                        borderRadius: '8px',
                        background: `rgba(${isC920 ? '13, 110, 253' : '0, 255, 0'}, 0.1)`,
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
                        <p>Iniciando {isC920 ? 'cámara C920' : 'cámara'}...</p>
                        {isC920 && <small className='text-muted'>Configurando controles avanzados...</small>}
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
                {isC920 && (
                  <>
                    {' '}- Distancia óptima: <strong>{focusDistance.toFixed(1)}m</strong>
                    {' '}- Zoom: <strong>{zoomLevel.toFixed(1)}x</strong>
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
            <h5 className='text-muted mb-3'>
              Escáner QR {isC920 ? 'C920' : ''} Inactivo
            </h5>
            <p className='text-muted mb-4'>
              Haga clic en "Iniciar" para comenzar a escanear códigos QR
              {isC920 && ' con controles avanzados de enfoque y zoom'}
            </p>
            <button onClick={() => toggleScanner(true)} className='btn btn-primary'>
              <i className='bi bi-play-circle me-2'></i>
              Iniciar Escáner {isC920 && 'C920'}
            </button>
          </div>
        )}
      </div>

      {/* Info de estado mejorada */}
      <div className='mt-4 p-3 bg-light rounded'>
        <div className='row text-center'>
          <div className='col-2'>
            <i className={`bi bi-camera-video fs-4 ${isC920 ? 'text-primary' : 'text-secondary'}`}></i>
            <br />
            <small className='text-muted'>Cámara</small>
          </div>
          <div className='col-2'>
            <i className={`bi bi-bullseye fs-4 ${isC920 && isScanning ? 'text-info' : 'text-muted'}`}></i>
            <br />
            <small className='text-muted'>Enfoque</small>
          </div>
          <div className='col-2'>
            <i className={`bi bi-zoom-in fs-4 ${isC920 && isScanning ? 'text-warning' : 'text-muted'}`}></i>
            <br />
            <small className='text-muted'>Zoom</small>
          </div>
          <div className='col-2'>
            <i className='bi bi-qr-code-scan fs-4 text-success'></i>
            <br />
            <small className='text-muted'>Detección</small>
          </div>
          <div className='col-2'>
            <i className='bi bi-shield-check fs-4 text-info'></i>
            <br />
            <small className='text-muted'>Anti-dup</small>
          </div>
          <div className='col-2'>
            <i className='bi bi-speedometer2 fs-4 text-danger'></i>
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
              {isC920 && (
                <span className='badge bg-success ms-1'>C920 ✓</span>
              )}
            </small>
          </div>
        </div>

        {isC920 && isScanning && (
          <div className='row mt-1'>
            <div className='col-6'>
              <small className='text-muted'>
                🎯 Enfoque: <span className='text-primary'>{focusDistance.toFixed(1)}m</span>
              </small>
            </div>
            <div className='col-6'>
              <small className='text-muted'>
                🔍 Zoom: <span className='text-warning'>{zoomLevel.toFixed(1)}x</span>
              </small>
            </div>
          </div>
        )}

        <div className='row mt-1'>
          <div className='col-12'>
            <small className='text-muted'>
              🔄 Estado:{' '}
              <span className={isScanning ? 'text-success' : 'text-secondary'}>
                {isScanning 
                  ? `Activo${isC920 ? ' con controles C920' : cameras.some(c => c.label.toLowerCase().includes('c920')) ? ' C920 (modo básico)' : ' con configuración estándar'}` 
                  : 'Inactivo'
                }
              </span>
            </small>
          </div>
        </div>

        {/* ✅ NUEVO: Mostrar información de modo cuando hay limitaciones */}
        {isScanning && cameras.some(c => c.label.toLowerCase().includes('c920')) && !isC920 && (
          <div className='row mt-1'>
            <div className='col-12'>
              <small className='text-warning'>
                💡 C920 detectada pero usando modo básico (zoom/enfoque no disponibles en este navegador)
              </small>
            </div>
          </div>
        )}

        {/* Información de debugging cuando hay errores */}
        {error && !permissionsGranted && (
          <div className='row mt-2'>
            <div className='col-12'>
              <details className='small text-muted'>
                <summary style={{cursor: 'pointer'}}>🔍 Información técnica</summary>
                <div className='mt-2 p-2 bg-light rounded'>
                  <div><strong>Navegador:</strong> {navigator.userAgent?.split(' ')[0] || 'Desconocido'}</div>
                  <div><strong>Protocolo:</strong> {window.location.protocol}</div>
                  <div><strong>Host:</strong> {window.location.hostname}</div>
                  <div><strong>MediaDevices:</strong> {navigator.mediaDevices ? '✅ Disponible' : '❌ No disponible'}</div>
                  {/* <div><strong>GetUserMedia:</strong> {navigator.mediaDevices?.getUserMedia ? '✅ Disponible' : '❌ No disponible'}</div> */}
                  <div><strong>Contexto seguro:</strong> {window.location.protocol === 'https:' || window.location.hostname === 'localhost' ? '✅ Sí' : '❌ No'}</div>
                </div>
              </details>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}