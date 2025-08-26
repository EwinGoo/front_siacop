import {useState, useCallback, useRef, useEffect} from 'react'
import {QRResult, ModoRecepcion, TipoPermiso} from '../types'
import {useFechaHora} from './useFechaHora'
import {useProcessor} from './useProcessor'
import {showIngresoManualModal} from 'src/app/utils/swalHelpers.ts'
import {parseCode} from 'src/app/utils/parseID'

export const useQRScanner = () => {
  const [loading, setLoading] = useState<boolean>(false)
  const [lastScanned, setLastScanned] = useState<{
    code: string
    timestamp: number
    tipoPermiso: string
  } | null>(null)
  const [scannedHistory, setScannedHistory] = useState<
    Array<{code: string; timestamp: number; tipoPermiso: string}>
  >([])
  const [modoRecepcion, setModoRecepcion] = useState<ModoRecepcion>('manual')
  const [tipoPermiso, setTipoPermiso] = useState<TipoPermiso>('hora')
  const modoRecepcionRef = useRef(modoRecepcion)

  const {fechaHora, isPaused, setFechaHora, setIsPaused, actualizarTiempo} = useFechaHora()
  const {processQRCode} = useProcessor()

  // Mantener referencia actualizada
  useEffect(() => {
    modoRecepcionRef.current = modoRecepcion
  }, [modoRecepcion])

  // ✅ SOLUCION 1: Callback actualizado que usa el tipo detectado directamente
  const onUpdatedScannedHistory = useCallback(
    (code: string, timestamp: number, detectedType?: TipoPermiso) => {
      // Usar el tipo detectado si se proporciona, sino usar el del estado
      const typeToUse = detectedType || tipoPermiso

      console.log('📝 Actualizando historial:', {code, timestamp, tipo: typeToUse})

      setLastScanned({code, timestamp, tipoPermiso: typeToUse})
      setScannedHistory((prev) => [{code, timestamp, tipoPermiso: typeToUse}, ...prev.slice(0, 9)])
    },
    [tipoPermiso]
  )

  const handleQRDetected = useCallback(
    async (result: QRResult) => {
      const {code} = result

      // ✅ SOLUCION 2: Detectar el tipo y usarlo directamente sin esperar el estado
      const detectedTipoPermiso = parseCode(code)

      // Actualizar el estado para la UI (pero no esperar a que se actualice)
      if (detectedTipoPermiso !== tipoPermiso) {
        setTipoPermiso(detectedTipoPermiso)
      }

      // Verificar duplicados usando el tipo detectado
      const isDuplicate = scannedHistory.some(
        (item) =>
          item.code === code &&
          item.tipoPermiso === detectedTipoPermiso &&
          Date.now() - item.timestamp < 5000
      )

      if (isDuplicate) {
        console.log('⚠️ Código duplicado, ignorando...', code)
        return
      }

      setLoading(true)
      try {
        await processQRCode({
          code,
          modoRecepcion: modoRecepcionRef.current,
          tipoPermiso: detectedTipoPermiso,
          fechaHora,
          onUpdatedScannedHistory: (code: string, timestamp: number) =>
            onUpdatedScannedHistory(code, timestamp, detectedTipoPermiso),
        })

        console.log('✅ Procesamiento exitoso')
      } catch (error) {
        console.error('❌ Error en procesamiento:', error)
      } finally {
        setLoading(false)
      }
    },
    [scannedHistory, processQRCode, tipoPermiso, fechaHora, onUpdatedScannedHistory]
  )

  const handleIngresoManual = useCallback(async () => {
    const codigo = await showIngresoManualModal()
    if (codigo) {
      await handleQRDetected({code: codigo.toString(), timestamp: Date.now()})
    }
  }, [handleQRDetected])

  return {
    // Estados
    loading,
    lastScanned,
    scannedHistory,
    modoRecepcion,
    tipoPermiso,
    fechaHora,
    isPaused,

    // Handlers
    handleQRDetected,
    handleIngresoManual,
    setModoRecepcion,
    setTipoPermiso,
    setFechaHora,
    setIsPaused,
    actualizarTiempo,
    onUpdatedScannedHistory,
  }
}
