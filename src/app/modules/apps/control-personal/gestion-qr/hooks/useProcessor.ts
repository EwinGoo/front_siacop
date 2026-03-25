import {useCallback} from 'react'
import {toast} from 'react-toastify'
import {ModoRecepcion, TipoPermiso} from '../types'
import {moduleRegistry} from '../modules'
import {showModal} from '../utils/showModal'
import useDateFormatter from 'src/app/hooks/useDateFormatter'
import {parseIDNumeric} from 'src/app/utils/parseID'

interface ProcessQRCodeParams {
  code: string
  modoRecepcion: ModoRecepcion
  tipoPermiso: TipoPermiso
  fechaHora: string
  onUpdatedScannedHistory: (code: string, timestamp: number) => void
}

function parseErrorMessage(error: any): string {
  if (error?.response?.status === 404) return 'Solicitud no encontrada en el sistema'
  if (error?.response?.data?.message) return error.response.data.message
  if (error?.response?.data?.messages?.error) return error.response.data.messages.error
  if (error?.message) return error.message
  return 'Ocurrió un error inesperado'
}

export const useProcessor = () => {
  const {formatToBolivianDate} = useDateFormatter()

  const processQRCode = useCallback(
    async (params: ProcessQRCodeParams) => {
      const {code, modoRecepcion, tipoPermiso, fechaHora, onUpdatedScannedHistory} = params

      if (!moduleRegistry.has(tipoPermiso)) {
        toast.error(`Tipo de documento no soportado: ${tipoPermiso}`)
        return
      }

      const module = moduleRegistry.get(tipoPermiso)

      try {
        const unifiedData = await module.getById(parseIDNumeric(code))

        if (!unifiedData) {
          toast.warning(
            `No se encontró registro en ${module.config.label} para el código: ${code}`
          )
          // toast.warning(
          //   `No se encontró registro en ${module.config.label} para el código: ${code}`,
          //   {icon: '🔍'}
          // )
          return
        }

        // Asignar código con prefijo correcto para mostrar (ej: V1, C5, P3)
        unifiedData.codigo = `${module.config.prefijo}${unifiedData.id}`

        const estado = unifiedData.estado.toUpperCase()
        const acciones = module.getAccionesPorEstado(estado)

        // Modo automático: recepcionar directamente sin mostrar modal
        if (modoRecepcion === 'automatico' && acciones.includes('reception')) {
          try {
            const result = await module.recepcionar(code, fechaHora)
            toast.success(
              `${module.config.label}: ${unifiedData.codigo} recepcionado` +
                (result.nro_correlativo ? ` | Correlativo: ${result.nro_correlativo}` : ''),
              {autoClose: 4000}
            )
            onUpdatedScannedHistory(code, Date.now())
          } catch (error) {
            toast.error(`Error al recepcionar: ${parseErrorMessage(error)}`)
          }
          return
        }

        // Modo manual: mostrar modal específico del módulo
        const result = await showModal(module.Modal, {
          data: unifiedData,
          accionesDisponibles: acciones,
          formatToBolivianDate,
        })

        if (!result.confirmed || !result.action) return

        switch (result.action) {
          case 'reception':
            try {
              const recepResult = await module.recepcionar(code, fechaHora)
              toast.success(
                `${unifiedData.codigo} recepcionado` +
                  (recepResult.nro_correlativo ? ` | N° ${recepResult.nro_correlativo}` : ''),
                {autoClose: 4000}
              )
              onUpdatedScannedHistory(code, Date.now())
            } catch (error) {
              toast.error(`Error al recepcionar: ${parseErrorMessage(error)}`)
            }
            break

          case 'approve':
            try {
              await module.aprobar(code, {numero_tramite: result.numero_tramite})
              toast.success(`Aprobado correctamente: ${unifiedData.codigo}`)
              onUpdatedScannedHistory(code, Date.now())
            } catch (error) {
              toast.error(`Error al aprobar: ${parseErrorMessage(error)}`)
            }
            break

          case 'observe':
            if (!result.observacion || !module.observar) break
            try {
              await module.observar(code, result.observacion)
              toast.warning(`Observación registrada para ${unifiedData.codigo}`)
              onUpdatedScannedHistory(code, Date.now())
            } catch (error) {
              toast.error(`Error al registrar observación: ${parseErrorMessage(error)}`)
            }
            break
        }
      } catch (error) {
        toast.error(`Error al procesar QR: ${parseErrorMessage(error)}`)
        console.error('Error en processQRCode:', error)
      }
    },
    [formatToBolivianDate]
  )

  return {processQRCode}
}
