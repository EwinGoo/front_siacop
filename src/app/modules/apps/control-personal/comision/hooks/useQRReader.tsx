import {useState, useRef, useEffect, useCallback, useLayoutEffect} from 'react'
import {Html5Qrcode} from 'html5-qrcode'

interface CameraDevice {
  deviceId: string
  label: string
}

interface QRResult {
  code: string
  timestamp: number
  rawData?: any
}

interface UseQRReaderOptions {
  onCodeDetected: (result: QRResult) => void
  debounceTime?: number
  autoStart?: boolean
}

export const useQRReader = ({
  onCodeDetected,
  debounceTime = 2000,
  autoStart = false,
}: UseQRReaderOptions) => {
  // ✅ Estados básicos
  const [isActive, setIsActive] = useState(autoStart)
  const [isScanning, setIsScanning] = useState(false)
  const [cameras, setCameras] = useState<CameraDevice[]>([])
  const [selectedCamera, setSelectedCamera] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [permissionsGranted, setPermissionsGranted] = useState(false)

  // ✅ Referencias críticas
  const qrReaderRef = useRef<HTMLDivElement>(null)
  const qrScannerRef = useRef<Html5Qrcode | null>(null)
  const isMountedRef = useRef(true)
  const isInitializingRef = useRef(false)
  const lastScannedRef = useRef<Map<string, number>>(new Map())
  const cleanupPromiseRef = useRef<Promise<void> | null>(null)

  // ✅ ID único que NUNCA cambia durante el ciclo de vida del componente
  const containerIdRef = useRef<string>()
  if (!containerIdRef.current) {
    containerIdRef.current = `qr-scanner-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  // ✅ Verificar si el código ya fue escaneado recientemente
  const isRecentlyScanned = useCallback((code: string): boolean => {
    const now = Date.now()
    const lastScan = lastScannedRef.current.get(code)

    if (lastScan && now - lastScan < debounceTime) {
      return true
    }

    lastScannedRef.current.set(code, now)

    // Limpiar códigos antiguos
    for (const [key, timestamp] of lastScannedRef.current.entries()) {
      if (now - timestamp > debounceTime * 2) {
        lastScannedRef.current.delete(key)
      }
    }

    return false
  }, [debounceTime])

  // ✅ Extraer código de URL
  const extractCodeFromURL = useCallback((url: string): string => {
    try {
      if (url.includes('/')) {
        const parts = url.split('/')
        return parts[parts.length - 1]
      }
      return url
    } catch {
      return url
    }
  }, [])

  // ✅ Cleanup DEFINITIVO del scanner
  const destroyScanner = useCallback(async (): Promise<void> => {
    // Si ya hay un cleanup en progreso, esperar a que termine
    if (cleanupPromiseRef.current) {
      await cleanupPromiseRef.current
      return
    }

    cleanupPromiseRef.current = new Promise<void>(async (resolve) => {
      try {
        if (qrScannerRef.current) {
          console.log('🧹 Destruyendo scanner...')
          
          try {
            // Intentar obtener el estado del scanner
            const state = qrScannerRef.current.getState()
            console.log('📊 Estado del scanner:', state)
            
            if (state === 2) { // Scanner corriendo
              console.log('⏹️ Deteniendo scanner...')
              await qrScannerRef.current.stop()
              console.log('✅ Scanner detenido')
            }
          } catch (stateError) {
            console.warn('⚠️ Error al verificar/detener scanner:', stateError)
            // Continuar con cleanup aunque falle
          }

          try {
            // Limpiar la instancia
            await qrScannerRef.current.clear()
            console.log('🧽 Scanner limpiado')
          } catch (clearError) {
            console.warn('⚠️ Error al limpiar scanner:', clearError)
          }

          qrScannerRef.current = null
        }

        // Limpiar el contenedor de forma BRUTAL pero segura
        if (qrReaderRef.current && isMountedRef.current) {
          console.log('🗑️ Limpiando contenedor DOM...')
          
          // Estrategia: Crear un nuevo div hijo y reemplazar el contenido completamente
          const container = qrReaderRef.current
          const newDiv = document.createElement('div')
          newDiv.style.width = '100%'
          newDiv.style.height = '100%'
          newDiv.style.display = 'flex'
          newDiv.style.alignItems = 'center'
          newDiv.style.justifyContent = 'center'
          
          // Remover TODO el contenido actual
          try {
            container.innerHTML = ''
            container.appendChild(newDiv)
            console.log('✅ Contenedor limpiado')
          } catch (domError) {
            console.warn('⚠️ Error al limpiar DOM:', domError)
          }
        }

        if (isMountedRef.current) {
          setIsScanning(false)
        }

        console.log('🎯 Cleanup completado')
      } catch (error) {
        console.error('❌ Error en cleanup:', error)
      } finally {
        cleanupPromiseRef.current = null
        resolve()
      }
    })

    await cleanupPromiseRef.current
  }, [])

  // ✅ Solicitar permisos de cámara
  const requestCameraPermissions = useCallback(async (): Promise<boolean> => {
    if (!isMountedRef.current) return false
    
    console.log('🔐 Solicitando permisos de cámara...')
    
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error('getUserMedia no disponible')
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 }
        }
      })
      
      console.log('✅ Permisos obtenidos')
      
      // Cerrar inmediatamente
      stream.getTracks().forEach(track => track.stop())
      
      if (isMountedRef.current) {
        setPermissionsGranted(true)
        setError(null)
      }
      
      return true
    } catch (err: any) {
      console.error('❌ Error permisos:', err)
      
      let errorMessage = 'Error desconocido al acceder a la cámara'
      
      switch (err.name) {
        case 'NotAllowedError':
          errorMessage = 'Permisos denegados. Habilite la cámara en su navegador.'
          break
        case 'NotFoundError':
          errorMessage = 'No se encontró cámara.'
          break
        case 'NotReadableError':
          errorMessage = 'Cámara en uso por otra aplicación.'
          break
        case 'SecurityError':
          errorMessage = 'Error de seguridad. Use HTTPS o localhost.'
          break
        default:
          errorMessage = `Error: ${err.message || err.name}`
      }
      
      if (isMountedRef.current) {
        setError(errorMessage)
        setPermissionsGranted(false)
      }
      return false
    }
  }, [])

  // ✅ Obtener lista de cámaras
  const getCameras = useCallback(async (): Promise<CameraDevice[]> => {
    if (!isMountedRef.current) return []
    
    console.log('📹 Obteniendo cámaras...')
    
    try {
      const devices = await navigator.mediaDevices!.enumerateDevices()
      const videoDevices = devices
        .filter(device => device.kind === 'videoinput')
        .map((device, index) => ({
          deviceId: device.deviceId,
          label: device.label || `Cámara ${index + 1}`,
        }))

      console.log('📱 Cámaras encontradas:', videoDevices.length)
      
      if (isMountedRef.current) {
        setCameras(videoDevices)
        
        if (videoDevices.length > 0 && !selectedCamera) {
          console.log('🎯 Seleccionando primera cámara')
          setSelectedCamera(videoDevices[0].deviceId)
        }
        
        if (videoDevices.length === 0) {
          setError('No se encontraron cámaras')
        }
      }
      
      return videoDevices
    } catch (err: any) {
      console.error('❌ Error obteniendo cámaras:', err)
      if (isMountedRef.current) {
        setError(`Error al obtener cámaras: ${err.message}`)
      }
      return []
    }
  }, [selectedCamera])

  // ✅ Iniciar scanner con máxima seguridad
  const startScanner = useCallback(async () => {
    if (!isMountedRef.current || isInitializingRef.current) {
      console.log('⏸️ Inicio cancelado - componente no montado o inicializando')
      return
    }
    
    if (!permissionsGranted || !selectedCamera || !qrReaderRef.current) {
      console.log('⏸️ Inicio cancelado - requisitos no cumplidos', {
        permissionsGranted,
        selectedCamera: !!selectedCamera,
        containerReady: !!qrReaderRef.current
      })
      return
    }

    isInitializingRef.current = true

    try {
      console.log('🚀 Iniciando scanner...')
      
      // Destruir cualquier instancia previa
      await destroyScanner()
      
      // Esperar a que el DOM se estabilice
      await new Promise(resolve => setTimeout(resolve, 300))
      
      if (!isMountedRef.current) {
        console.log('⏸️ Componente desmontado durante inicialización')
        return
      }

      // Asegurar que el contenedor está listo
      const container = qrReaderRef.current!
      container.id = containerIdRef.current!
      
      // Limpiar completamente el contenedor
      container.innerHTML = ''
      
      console.log('🎬 Creando instancia Html5Qrcode...')
      
      const scanner = new Html5Qrcode(containerIdRef.current!)
      qrScannerRef.current = scanner

      const config = {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0,
        experimentalFeatures: {
          useBarCodeDetectorIfSupported: true,
        },
      }

      console.log('📡 Iniciando stream de cámara...')
      
      await scanner.start(
        selectedCamera,
        config,
        (decodedText: string) => {
          if (!isMountedRef.current) return
          
          try {
            const extractedCode = extractCodeFromURL(decodedText)

            if (!isRecentlyScanned(extractedCode)) {
              const result: QRResult = {
                code: extractedCode,
                timestamp: Date.now(),
                rawData: decodedText,
              }

              console.log('🎯 QR detectado:', extractedCode)
              onCodeDetected(result)
            }
          } catch (err) {
            console.error('❌ Error procesando QR:', err)
          }
        },
        (errorMessage: string) => {
          // Solo logear errores importantes
          if (!errorMessage.toLowerCase().includes('no qr code found')) {
            console.warn('📟 Scanner warning:', errorMessage)
          }
        }
      )

      if (isMountedRef.current) {
        setIsScanning(true)
        setError(null)
        console.log('✅ Scanner iniciado exitosamente')
      }

    } catch (err: any) {
      console.error('❌ Error iniciando scanner:', err)
      
      if (isMountedRef.current) {
        let errorMessage = 'Error al iniciar la cámara'
        
        if (err.message?.includes('permission') || err.message?.includes('NotAllowed')) {
          errorMessage = 'Permisos de cámara denegados'
        } else if (err.message?.includes('NotFound')) {
          errorMessage = 'Cámara no encontrada'
        } else if (err.message?.includes('NotReadable')) {
          errorMessage = 'Cámara en uso por otra aplicación'
        } else if (err.message?.includes('OverConstrained')) {
          errorMessage = 'Configuración de cámara no soportada'
        }
        
        setError(errorMessage)
        setIsScanning(false)
      }
    } finally {
      isInitializingRef.current = false
    }
  }, [selectedCamera, permissionsGranted, onCodeDetected, isRecentlyScanned, extractCodeFromURL, destroyScanner])

  // ✅ Cambiar cámara
  const switchCamera = useCallback(async (deviceId: string) => {
    if (!isMountedRef.current) return
    
    console.log('🔄 Cambiando cámara a:', deviceId)
    
    await destroyScanner()
    
    setTimeout(() => {
      if (isMountedRef.current) {
        setSelectedCamera(deviceId)
      }
    }, 500)
  }, [destroyScanner])

  // ✅ Toggle scanner
  const toggleScanner = useCallback(async (active: boolean) => {
    if (!isMountedRef.current) return
    
    console.log('🎛️ Toggle scanner:', active)
    setIsActive(active)
    
    if (!active) {
      await destroyScanner()
    }
  }, [destroyScanner])

  // ✅ Forzar permisos
  const forceRequestPermissions = useCallback(async () => {
    if (!isMountedRef.current) return false
    
    console.log('🔄 Forzando permisos...')
    setError(null)
    
    const granted = await requestCameraPermissions()
    if (granted && isMountedRef.current) {
      await getCameras()
    }
    
    return granted
  }, [requestCameraPermissions, getCameras])

  // ✅ Efecto de inicialización principal
  useEffect(() => {
    if (!isActive || !isMountedRef.current) return

    const initialize = async () => {
      console.log('🎬 Inicializando sistema de cámara...')
      
      try {
        if (!permissionsGranted) {
          const granted = await requestCameraPermissions()
          if (granted && isMountedRef.current) {
            await getCameras()
          }
        } else if (cameras.length === 0) {
          await getCameras()
        }
      } catch (err) {
        console.error('❌ Error en inicialización:', err)
        if (isMountedRef.current) {
          setError(`Error de inicialización: ${err instanceof Error ? err.message : 'Error desconocido'}`)
        }
      }
    }

    initialize()
  }, [isActive])

  // ✅ Efecto para iniciar scanner cuando todo está listo
  useEffect(() => {
    if (isActive && permissionsGranted && selectedCamera && !isInitializingRef.current && isMountedRef.current) {
      console.log('⏰ Programando inicio de scanner...')
      
      const timer = setTimeout(() => {
        if (isMountedRef.current) {
          startScanner()
        }
      }, 1000) // Aumentamos el delay para mayor estabilidad

      return () => clearTimeout(timer)
    }
  }, [isActive, permissionsGranted, selectedCamera, startScanner])

  // ✅ Efecto para asegurar que el contenedor tiene el ID correcto
  useLayoutEffect(() => {
    if (qrReaderRef.current && containerIdRef.current) {
      qrReaderRef.current.id = containerIdRef.current
    }
  })

  // ✅ Cleanup definitivo al desmontar
  useEffect(() => {
    return () => {
      console.log('🏁 Desmontando componente QR Scanner...')
      isMountedRef.current = false
      
      // Cleanup asíncrono sin esperar
      destroyScanner().catch(err => {
        console.warn('Error en cleanup final:', err)
      })
    }
  }, [destroyScanner])

  return {
    qrReaderRef,
    isActive,
    isScanning,
    cameras,
    selectedCamera,
    error,
    permissionsGranted,
    toggleScanner,
    switchCamera,
    forceRequestPermissions,
  }
}