import {useCallback} from 'react'
import {ModoRecepcion, TipoPermiso} from '../types'
import {unifiedService} from '../services/unifiedService'
import {RecepcionProcessorService, ObservacionProcessorService} from '../components/Process'
import useDateFormatter from 'src/app/hooks/useDateFormatter'
import Swal from 'sweetalert2'
import {UnifiedModalService} from '../components/Process/UnifiedModal'

interface ProcessQRCodeParams {
  code: string
  modoRecepcion: ModoRecepcion
  tipoPermiso: TipoPermiso
  fechaHora: string
  onUpdatedScannedHistory: (code: string, timestamp: number) => void
}

export const useProcessor = () => {
  const {formatToBolivianDate} = useDateFormatter()

  const processQRCode = useCallback(
    async (params: ProcessQRCodeParams) => {
      const {code, modoRecepcion, tipoPermiso, fechaHora, onUpdatedScannedHistory} = params

      try {
        // Obtener configuración del tipo
        const typeConfig = unifiedService.getTypeConfig(tipoPermiso)

        // console.log(`Procesando con ${typeConfig.serviceName}`)

        // Obtener datos usando el servicio unificado (YA DEVUELVE UnifiedData)
        const unifiedData = await unifiedService.getDataByType(parseInt(code), tipoPermiso)

        if (!unifiedData) {
          await RecepcionProcessorService.showRecepcionError({
            response: {
              status: 404,
              data: {
                message: `No se encontraron datos en ${typeConfig.serviceName} para este código QR`,
              },
            },
          })
          return
        }

        // Procesamiento automático para estados específicos
        const estadoNormalizado = unifiedData.estado.toUpperCase()
        if (modoRecepcion === 'automatico' && ['GENERADO', 'ENVIADO'].includes(estadoNormalizado)) {
          await RecepcionProcessorService.showRecepcionProgress(code)

          try {
            const response = await unifiedService.procesarRecepcionByType(
              code,
              fechaHora,
              tipoPermiso
            )

            await RecepcionProcessorService.showRecepcionSuccess(
              code,
              `${response.message} (${typeConfig.serviceName})`,
              tipoPermiso,
              fechaHora
            )

            // ✅ Actualizar historial después del proceso exitoso
            onUpdatedScannedHistory(code, Date.now())
          } catch (error) {
            await RecepcionProcessorService.showRecepcionError(error)
          }
          return
        }

        // Mostrar modal unificado (CAMBIO PRINCIPAL)
        const response = await UnifiedModalService.showUnifiedModal({
          data: unifiedData, 
          formatToBolivianDate,
        })

        if (response.confirmed) {
          switch (response.action) {
            case 'reception':
              await RecepcionProcessorService.showRecepcionProgress(code)
              try {
                const result = await unifiedService.procesarRecepcionByType(
                  code,
                  fechaHora,
                  tipoPermiso
                )

                await RecepcionProcessorService.showRecepcionSuccess(
                  code,
                  `${result.message} (${typeConfig.serviceName})`,
                  tipoPermiso,
                  fechaHora
                )

                // ✅ Actualizar historial después del proceso exitoso
                onUpdatedScannedHistory(code, Date.now())
              } catch (error) {
                await RecepcionProcessorService.showRecepcionError(error)
              }
              break

            case 'approve':
              try {
                await unifiedService.aprobarComisionByType(code, tipoPermiso)

                const displayInfo =
                  unifiedData.tipo_documento === 'permiso'
                    ? {tipo: 'Permiso', icono: 'bi-calendar-check'}
                    : {tipo: 'Comisión', icono: 'bi-briefcase'}

                await Swal.fire({
                  icon: 'success',
                  title: `<i class="bi bi-check-circle me-2"></i>¡${displayInfo.tipo} Aprobado!`,
                  html: `
                    <div class="alert alert-success">
                      <h6 class="alert-heading">
                        <i class="${displayInfo.icono} me-2"></i>
                        Aprobación Exitosa
                      </h6>
                      <hr>
                      <div class="row text-start mb-2">
                        <div class="col-4 fw-bold">Código:</div>
                        <div class="col-8">${code}</div>
                      </div>
                      <div class="row text-start mb-2">
                        <div class="col-4 fw-bold">Tipo:</div>
                        <div class="col-8">${displayInfo.tipo}</div>
                      </div>
                      <div class="row text-start mb-2">
                        <div class="col-4 fw-bold">Empleado:</div>
                        <div class="col-8">${unifiedData.nombre_generador}</div>
                      </div>
                      <small class="text-muted">
                        <i class="bi bi-gear me-1"></i>
                        Procesado por: ${typeConfig.serviceName}
                      </small>
                    </div>
                  `,
                  confirmButtonText: '<i class="bi bi-arrow-right me-2"></i>Continuar',
                  timer: 4000,
                  timerProgressBar: true,
                  customClass: {
                    confirmButton: 'btn btn-success',
                    title: 'text-success fw-bold',
                  },
                })

                // ✅ Actualizar historial después del proceso exitoso
                onUpdatedScannedHistory(code, Date.now())
              } catch (error) {
                await Swal.fire({
                  icon: 'error',
                  title: `<i class="bi bi-x-circle me-2"></i>Error de Aprobación`,
                  html: `
                    <div class="alert alert-danger">
                      <p class="mb-2">No se pudo aprobar en ${typeConfig.serviceName}</p>
                      <small class="text-muted">Verifique la conexión y los permisos</small>
                    </div>
                  `,
                  confirmButtonText: '<i class="bi bi-arrow-clockwise me-2"></i>Entendido',
                  customClass: {
                    confirmButton: 'btn btn-danger',
                    title: 'text-danger fw-bold',
                  },
                })
              }
              break

            case 'observe':
              if (response.observacion) {
                await ObservacionProcessorService.showObservacionProgress(
                  code,
                  response.observacion
                )
                try {
                  await unifiedService.registrarObservacionByType(
                    code,
                    response.observacion,
                    tipoPermiso
                  )

                  await ObservacionProcessorService.showObservacionSuccess(
                    code,
                    response.observacion
                  )

                  // ✅ Actualizar historial después del proceso exitoso
                  onUpdatedScannedHistory(code, Date.now())
                } catch (error) {
                  await Swal.fire({
                    icon: 'error',
                    title: '<i class="bi bi-x-circle me-2"></i>Error al Registrar Observación',
                    html: `
                      <div class="alert alert-danger">
                        <p class="mb-2">No se pudo registrar la observación en ${typeConfig.serviceName}</p>
                        <small class="text-muted">Intente nuevamente o contacte soporte</small>
                      </div>
                    `,
                    confirmButtonText: '<i class="bi bi-arrow-clockwise me-2"></i>Entendido',
                    customClass: {
                      confirmButton: 'btn btn-danger',
                      title: 'text-danger fw-bold',
                    },
                  })
                }
              }
              break
          }
        }
      } catch (error) {
        await RecepcionProcessorService.showRecepcionError(error)
        console.error('Error al procesar QR:', error)
      }
    },
    [formatToBolivianDate]
  )

  return {processQRCode}
}