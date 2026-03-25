import {useState, useCallback, useRef, useEffect} from 'react'
import {QRResult, ModoRecepcion, TipoPermiso} from '../types'
import {useFechaHora} from './useFechaHora'
import {useProcessor} from './useProcessor'
import {useScannedHistory} from './useScannedHistory'
import {showIngresoManualModal} from 'src/app/utils/swalHelpers.ts'
import {parseCode} from 'src/app/utils/parseID-2'

export const useQRScanner = () => {
  const [loading, setLoading] = useState<boolean>(false)
  const [modoRecepcion, setModoRecepcion] = useState<ModoRecepcion>('manual')
  const [tipoPermiso, setTipoPermiso] = useState<TipoPermiso>('hora')
  const modoRecepcionRef = useRef(modoRecepcion)

  const {scannedHistory, lastScanned, addToHistory} = useScannedHistory()
  const {fechaHora, isPaused, setFechaHora, setIsPaused, actualizarTiempo} = useFechaHora()
  const {processQRCode} = useProcessor()

  // Mantener referencia actualizada
  useEffect(() => {
    modoRecepcionRef.current = modoRecepcion
  }, [modoRecepcion])

  const onUpdatedScannedHistory = useCallback(
    (code: string, timestamp: number, detectedType?: TipoPermiso) => {
      const typeToUse = detectedType || tipoPermiso
      addToHistory(code, timestamp, typeToUse)
    },
    [tipoPermiso, addToHistory]
  )

  const handleQRDetected = useCallback(
    async (result: QRResult) => {
      const {code} = result

      const detectedTipoPermiso = parseCode(code)

      if (detectedTipoPermiso !== tipoPermiso) {
        setTipoPermiso(detectedTipoPermiso)
      }

      // Verificar duplicados (dentro de los últimos 5 segundos)
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
