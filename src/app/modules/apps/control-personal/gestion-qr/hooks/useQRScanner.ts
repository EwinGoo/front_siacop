import {useState, useCallback, useRef, useEffect} from 'react'
import {QRResult, ModoRecepcion, TipoPermiso} from '../types'
import {useFechaHora} from './useFechaHora'
import {useProcessor} from './useProcessor'
import {showIngresoManualModal} from 'src/app/utils/swalHelpers.ts'

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

  const onUpdatedScannedHistory = useCallback(
    (code: string, timestamp: number) => {
      console.log('entra')
      setLastScanned({code, timestamp, tipoPermiso})
      setScannedHistory((prev) => [{code, timestamp, tipoPermiso}, ...prev.slice(0, 9)])
    },
    [tipoPermiso]
  )

  const handleQRDetected = useCallback(
    async (result: QRResult) => {
      const {code} = result

      // Verificar duplicados
      const isDuplicate = scannedHistory.some(
        (item) => item.code === code && Date.now() - item.timestamp < 5000
      )

      if (isDuplicate) {
        console.log('Código duplicado, ignorando...', code)
        return
      }

      // Actualizar historial
      // setLastScanned({code, tipoPermiso})
      // setScannedHistory((prev) => [
      //   {code, timestamp: result.timestamp, tipoPermiso},
      //   ...prev.slice(0, 9),
      // ])

      // Procesar código
      setLoading(true)
      try {
        await processQRCode({
          code,
          modoRecepcion: modoRecepcionRef.current,
          tipoPermiso,
          fechaHora,
          onUpdatedScannedHistory,
        })
      } finally {
        setLoading(false)
      }
    },
    [scannedHistory, processQRCode, tipoPermiso, fechaHora]
  )

  const handleIngresoManual = useCallback(async () => {
    const codigo = await showIngresoManualModal()
    if (codigo) {
      await handleQRDetected({code: codigo.toString(), timestamp: Date.now()})
    }
  }, [handleQRDetected])

  // const updatedScannedHistory  = (code, ) =>{
  //    setLastScanned({code, tipoPermiso})
  //     setScannedHistory((prev) => [
  //       {code, timestamp: result.timestamp, tipoPermiso},
  //       ...prev.slice(0, 9),
  //     ])
  // }

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
