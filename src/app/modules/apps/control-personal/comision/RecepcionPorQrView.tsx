import React, {useState, useCallback, useEffect, useRef} from 'react'
import {useIntl} from 'react-intl'
import {PageTitle} from '../../../../../_metronic/layout/core'
// import { QRReaderComponent } from './components/QRReaderComponent'
import {QRReaderAlternative} from './components/QRReaderAlternative'
import {
  aprobarComisionPorQR,
  getComisionById,
  procesarEstadoComision,
} from './comision-list/core/_requests'
import useDateFormatter, {getLocalDateTime} from '../../../../hooks/useDateFormatter'

import Swal from 'sweetalert2'
import {showAxiosError} from 'src/app/utils/showAxiosErrorToast'
import {getAxiosErrorMessage} from 'src/app/utils/axiosErrorHandler'
import {Comision, ProcesarComisionParams} from './comision-list/core/_models'
import {ID} from 'src/_metronic/helpers'
import RelojTiempoReal from './components/RelojTiempoReal'

// Interfaces
// interface Comision {
//   id: string
//   codigo: string
//   empleado: string
//   descripcion_comision?: string
//   fecha_comision: string
//   nombre_cargo: string
//   // fecha_fin: string
//   // motivo: string
//   estado: string
//   // monto?: number
//   // departamento?: string
// }

interface QRResult {
  code: string
  timestamp: number
  rawData?: any
}

interface ApiResponse {
  message: string
  data?: Comision
}
// type ComisionAction = 'reception' | 'approve' | 'observe' | 'view';
type ComisionActionResponse = {
  confirmed: boolean
  action?: string
  observacion?: string
  fechaRecepcion?: string
}

const RecepcionPorQrView: React.FC = () => {
  const intl = useIntl()
  const [loading, setLoading] = useState<boolean>(false)
  const [lastScannedCode, setLastScannedCode] = useState<string>('')
  const [scannedHistory, setScannedHistory] = useState<Array<{code: string; timestamp: number}>>([])
  const {formatToBolivianDate} = useDateFormatter()
  const [modoRecepcion, setModoRecepcion] = useState<'automatico' | 'manual'>('manual')
  const modoRecepcionRef = useRef(modoRecepcion)
  // const [fechaHora, setFechaHora] = useState(() => getLocalDateTime())
  const [isPaused, setIsPaused] = useState<boolean>(false)
  const [fechaHora, setFechaHora] = useState(new Date())

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined
    console.log(isPaused)

    if (isPaused === false) {
      interval = setInterval(() => {
        console.log(fechaHora)

        // setFechaHora(getLocalDateTime())
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isPaused])
  // Función para obtener datos de la comisión (simulada o desde API)
  const getComisionData = async (codigo: string) => {
    try {
      const id = Number(codigo)
      // Validar que sea un número válido
      if (isNaN(id)) {
        throw new Error('El código QR no es válido. Debe contener un ID numérico.')
      }

      const response = await getComisionById(parseInt(codigo))

      return response
    } catch (error) {
      // showAxiosError(error, {useSwal: true})
      // console.error('Error al obtener datos de comisión:', error)
      throw error
      // return null
    }
  }

  useEffect(() => {
    modoRecepcionRef.current = modoRecepcion
  }, [modoRecepcion])

  // Mostrar datos de comisión en SweetAlert
  const showComisionData = async (comisionData: Comision): Promise<ComisionActionResponse> => {
    // Configuración base del modal
    const swalConfig: any = {
      title: 'Datos de la Comisión',
      html: getComisionHtmlContent(comisionData),
      icon: 'info',
      width: '600px',
      showCloseButton: true,
      customClass: {
        popup: 'animated fadeInDown',
      },
    }

    // Configuración según estado
    switch (comisionData.estado_boleta_comision.toUpperCase()) {
      case 'APROBADO':
        return handleAprobadoState(swalConfig)
      case 'GENERADO':
      case 'ENVIADO':
        return handleGeneradoState(swalConfig, comisionData)
      case 'RECEPCIONADO':
        return handleRecepcionadoState(swalConfig, comisionData)
      case 'OBSERVADO':
        return handleObservadoState(swalConfig)
      default:
        return handleDefaultState(swalConfig)
    }
  }

  // Estados específicos
  const handleAprobadoState = (config: any): Promise<ComisionActionResponse> => {
    Object.assign(config, {
      showConfirmButton: true,
      showCancelButton: false,
      confirmButtonText: '<i class="bi bi-eye me-1"></i>Visto',
      confirmButtonColor: '#198754',
      customClass: {
        confirmButton: 'btn btn-primary',
      },
    })
    return Swal.fire(config).then((result) => ({confirmed: result.isConfirmed, action: 'view'}))
  }

  // const handleGeneradoState = (config: any, comisionData: Comision) => {
  //   Object.assign(config, {
  //     showCancelButton: true,
  //     // showDenyButton: true,
  //     confirmButtonText: '<i class="bi bi-check-circle me-2"></i> Recepcionar',
  //     // denyButtonText: '<i class="bi bi-exclamation-triangle me-2"></i> Observar',
  //     cancelButtonText: '<i class="bi bi-x-circle me-2"></i> Cerrar',
  //     confirmButtonColor: '#198754',
  //     denyButtonColor: '#ffc107',
  //     cancelButtonColor: '#6c757d',
  //     reverseButtons: true,
  //     customClass: {
  //       confirmButton: 'btn btn-success',
  //       cancelButton: 'btn btn-danger',
  //     },
  //   })

  //   return Swal.fire(config).then(async (result) => {
  //     console.log(result)
  //     // debugger
  //     if (result.isConfirmed) {
  //       // await procesarRecepcion(comisionData.codigo)
  //       return {confirmed: true, action: 'reception'}
  //     }
  //     return {confirmed: false}
  //   })
  // }

  const handleGeneradoState = (config: any, comisionData: Comision) => {
    Object.assign(config, {
      html: getComisionHtmlContent(comisionData),
      showCancelButton: true,
      confirmButtonText: '<i class="bi bi-check-circle me-2"></i> Recepcionar',
      cancelButtonText: '<i class="bi bi-x-circle me-2"></i> Cerrar',
      confirmButtonColor: '#198754',
      cancelButtonColor: '#6c757d',
      reverseButtons: true,
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger',
      },
    })

    return Swal.fire(config).then(async (result) => {
      if (result.isConfirmed) {
        return {
          confirmed: true,
          action: 'reception',
        }
      }
      return {confirmed: false}
    })
  }

  const handleRecepcionadoState = (config: any, comisionData: Comision) => {
    Object.assign(config, {
      showCancelButton: false,
      showDenyButton: true,
      confirmButtonText: '<i class="bi bi-check-circle me-2"></i> Aprobar',
      denyButtonText: '<i class="bi bi-exclamation-triangle me-2"></i> Observar',
      cancelButtonText: '<i class="bi bi-x-circle me-2"></i> Cerrar',
      reverseButtons: true,
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-secondary',
        denyButton: 'btn btn-danger',
      },
    })

    return Swal.fire(config).then(async (result) => {
      if (result.isConfirmed) {
        // await aprobarComision(comisionData.codigo)
        return {confirmed: true, action: 'approve'}
      } else if (result.isDenied) {
        // return {confirmed: true, action: 'observe'}
        return handleObservacionModal(comisionData)
      }
      return {confirmed: false}
    })
  }

  const handleObservadoState = (config: any) => {
    Object.assign(config, {
      showConfirmButton: true,
      showCancelButton: false,
      confirmButtonText: '<i class="bi bi-eye me-1"></i> Visto',
      confirmButtonColor: '#dc3545',
      customClass: {
        confirmButton: 'btn btn-danger',
      },
    })
    return Swal.fire(config).then((result) => ({confirmed: result.isConfirmed, action: 'view'}))
  }

  const handleDefaultState = (config: any) => {
    Object.assign(config, {
      showConfirmButton: false,
      confirmButtonText: 'Cerrar',
    })
    return Swal.fire(config).then(() => ({confirmed: false}))
  }
  // Función para manejar el modal de observación
  const handleObservacionModal = async (comisionData: Comision) => {
    const {value: formValues} = await Swal.fire({
      title: 'Registrar Observación',
      html: `
      <div style="text-align: left;">
        <p><strong>Comisión:</strong> ${comisionData.id_comision}</p>
        <p><strong>Nombre:</strong> ${comisionData.nombre_generador}</p>
        <textarea id="observacion" class="swal2-textarea m-0" 
          placeholder="Ingrese los motivos de la observación..." 
          required style="width: 100%; min-height: 100px; margin-top: 10px;"></textarea>
      </div>
    `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: '<i class="bi bi-send me-2"></i> Enviar Observación',
      cancelButtonText: '<i class="bi bi-x-circle me-2"></i> Cancelar',
      width: '600px',
      reverseButtons: true,
      customClass: {
        confirmButton: 'btn btn-danger',
        cancelButton: 'btn btn-secondary',
      },
      preConfirm: () => {
        const observacion = (document.getElementById('observacion') as HTMLTextAreaElement).value
        if (!observacion.trim()) {
          Swal.showValidationMessage('La observación es requerida')
          return false
        }
        return {observacion}
      },
    })

    if (formValues) {
      try {
        // Aquí llamarías a tu API para registrar la observación
        // await registrarObservacion(comisionData.codigo, formValues.observacion)

        // Swal.fire({
        //   icon: 'success',
        //   title: 'Observación registrada',
        //   text: 'La observación ha sido guardada correctamente',
        //   confirmButtonText: 'Entendido',
        // })

        return {
          confirmed: true,
          action: 'observe',
          observacion: formValues.observacion,
        }
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo registrar la observación',
          confirmButtonText: 'Entendido',
          customClass: {
            confirmButton: 'btn btn-success',
          },
        })
      }
    }
    return {confirmed: false}
  }

  // Función para aprobar comisión
  const aprobarComision = async (codigo: string) => {
    try {
      // Aquí llamarías a tu API para aprobar la comisión
      await procesarEstadoComision({code: parseInt(codigo), action: 'approve'})

      Swal.fire({
        icon: 'success',
        title: '¡Comisión aprobada!',
        text: `La comisión ${codigo} ha sido aprobada correctamente`,
        confirmButtonText: 'Entendido',
        customClass: {
          confirmButton: 'btn btn-success',
        },
      })
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo aprobar la comisión',
        confirmButtonText: 'Entendido',
        customClass: {
          confirmButton: 'btn btn-success',
        },
      })
    }
  }

  // Función para generar el contenido HTML (separado para mejor legibilidad)
  const getComisionHtmlContent = (comisionData: Comision) => {
    return `
    <div class="bg-light p-4 rounded mb-4">
      <h6 class="text-gray-700 mb-3 fw-semibold">
        <i class="bi bi-person-badge me-2"></i>Información del Empleado
      </h6>
      <div class="row mb-2 text-start">
        <div class="col-3 col-sm-3 fw-bold">Nombre:</div>
        <div class="col-9 col-sm-9">${comisionData.nombre_generador}</div>
      </div>
      <div class="row mb-2 text-start">
        <div class="col-3 col-sm-3 fw-bold">Cargo:</div>
        <div class="col-9 col-sm-9">${comisionData.nombre_cargo}</div>
      </div>
      <div class="row mb-2 text-start">
        <div class="col-3 col-sm-3 fw-bold">Unidad:</div>
        <div class="col-9 col-sm-9">${comisionData.unidad}</div>
      </div>
    </div>

    <div class="bg-primary bg-opacity-10 p-4 rounded mb-4">
      <h6 class="text-primary mb-3 fw-semibold">
        <i class="bi bi-geo-alt me-2"></i>Detalles de la Comisión
      </h6>
      <div class="row mb-2 text-start">
        <div class="col-3 col-sm-3 fw-bold">Código:</div>
        <div class="col-9 col-sm-9">${comisionData.id_comision}</div>
      </div>
      <div class="row mb-2 text-start">
        <div class="col-3 col-sm-3 fw-bold">Fecha:</div>
        <div class="col-9 col-sm-9">${formatToBolivianDate(comisionData.fecha_comision, {
          dateStyle: 'full',
        })}</div>
      </div>
      <div class="row mb-2 text-start">
        <div class="col-3 col-sm-3 fw-bold">De:</div>
        <div class="col-9 col-sm-9">${comisionData.recorrido_de}</div>
      </div>
      <div class="row mb-2 text-start">
        <div class="col-3 col-sm-3 fw-bold">A:</div>
        <div class="col-9 col-sm-9">${comisionData.recorrido_a}</div>
      </div>
      <div class="row mb-2 text-start">
        <div class="col-3 col-sm-3 fw-bold">Motivo:</div>
        <div class="col-9 col-sm-9">${comisionData.descripcion_comision}</div>
      </div>
    </div>

    <div class="bg-info bg-opacity-10 p-4 rounded mb-4">
      <h6 class="text-info mb-3 fw-semibold">
        <i class="bi bi-info-circle me-2"></i>Estado Comisión
      </h6>
      <div class="row mb-2 text-start">
        <div class="col-3 col-sm-3 fw-bold">Estado:</div>
        <div class="col-9 col-sm-9">
          <span class="badge" style="background: ${
            getStatusColor(comisionData.estado_boleta_comision).background
          }; 
            color: ${getStatusColor(comisionData.estado_boleta_comision).color};">
            ${comisionData.estado_boleta_comision}
          </span>
        </div>
      </div>
    </div>
  `
  }

  // Helper para colores según estado
  const getStatusColor = (estado: string) => {
    const colors: Record<string, {background: string; color: string}> = {
      APROBADO: {background: '#e8f5e9', color: '#2e7d32'},
      RECEPCIONADO: {background: '#fff3e0', color: '#f57c00'},
      OBSERVADO: {background: '#ffebee', color: '#c62828'},
      GENERADO: {background: '#e3f2fd', color: '#1565c0'},
    }
    return colors[estado] || {background: '#f5f5f5', color: '#424242'}
  }

  // Procesar recepción de comisión
  const procesarRecepcion = async (codigo: string) => {
    setLoading(true)
    try {
      const response = await procesarEstadoComision({
        code: parseInt(codigo),
        action: 'receive',
        // fecha: fechaHora,
      })

      await Swal.fire({
        icon: 'success',
        title: '¡Recepción Exitosa!',
        html: `
          <div style="text-align: center;">
            <p style="font-size: 16px; color: #495057; margin-bottom: 10px;">
              ${response.message || 'La comisión ha sido recepcionada exitosamente'}
            </p>
            <p style="font-size: 14px; color: #6c757d;">
              <strong>Código:</strong> ${codigo}
            </p>
          </div>
        `,
        confirmButtonText: 'Continuar',
        timer: 3000,
        timerProgressBar: true,
        customClass: {
          confirmButton: 'btn btn-success',
        },
      })
    } catch (error: any) {
      console.error('Error al recepcionar comisión:', error)

      let errorTitle = 'Error en la Recepción'
      let errorMessage = 'Ocurrió un error al procesar la solicitud'
      let errorIcon: 'error' | 'warning' = 'error'

      if (error.response?.status === 404) {
        errorTitle = 'Comisión No Encontrada'
        errorMessage = 'La boleta de comisión no fue encontrada en el sistema'
        errorIcon = 'warning'
      } else if (error.response?.data?.validation_errors) {
        errorTitle = 'Error de Validación'
        errorMessage = Object.values(error.response.data.validation_errors).join('<br>')
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      }

      await Swal.fire({
        icon: errorIcon,
        title: errorTitle,
        html: errorMessage,
        confirmButtonText: 'Entendido',
        confirmButtonColor: '#dc3545',
        customClass: {
          confirmButton: 'btn btn-primary',
        },
      })
    } finally {
      setLoading(false)
    }
  }

  // Manejar detección de QR
  const handleQRDetected = useCallback(
    async (result: QRResult) => {
      const {code} = result

      // Verificar si el código ya fue escaneado recientemente (evitar duplicados)
      const isDuplicate = scannedHistory.some(
        (item) => item.code === code && Date.now() - item.timestamp < 5000 // 5 segundos
      )

      if (isDuplicate) {
        console.log('Código duplicado, ignorando...', code)
        return
      }

      // Actualizar historial
      setLastScannedCode(code)
      setScannedHistory((prev) => [
        {code, timestamp: result.timestamp},
        ...prev.slice(0, 9), // Mantener solo los últimos 10
      ])

      try {
        // Obtener datos de la comisión
        const comisionData = await getComisionData(code)

        if (!comisionData) {
          await Swal.fire({
            icon: 'warning',
            title: 'Código No Válido',
            text: 'No se encontraron datos para este código QR',
            confirmButtonText: 'Entendido',
            customClass: {
              confirmButton: 'btn btn-success',
            },
          })
          return
        }

        const modoActual = modoRecepcionRef.current
        console.log(modoRecepcion)
        // Modo automático para estados GENERADO o ENVIADO
        if (
          modoActual === 'automatico' &&
          ['GENERADO', 'ENVIADO'].includes(comisionData.estado_boleta_comision.toUpperCase())
        ) {
          await procesarRecepcion(code)
          return
        }

        // Mostrar datos y obtener la acción del usuario
        const response = await showComisionData(comisionData)
        // Procesar según la acción del usuario
        if (response.confirmed) {
          switch (response.action) {
            case 'reception':
              await procesarRecepcion(code)
              break
            case 'approve':
              await aprobarComision(code)
              break
            case 'observe':
              if (response.observacion) {
                await registrarObservacion(code, response.observacion)
              }
              break
            default:
              // Solo vista, no hacer nada
              break
          }
        }
      } catch (error) {
        // console.error('Error al procesar QR:111', error)
        await Swal.fire({
          icon: 'error',
          title: 'Error',
          text: getAxiosErrorMessage(error),
          confirmButtonText: 'Entendido',
          customClass: {
            confirmButton: 'btn btn-primary',
          },
        })
      }
    },
    [scannedHistory]
  )

  // Función para registrar observación (ejemplo)
  const registrarObservacion = async (codigo: string, observacion: string) => {
    try {
      // Aquí iría la llamada a tu API
      // await api.registrarObservacion(codigo, observacion);
      await procesarEstadoComision({code: parseInt(codigo), action: 'observe', observacion})

      await Swal.fire({
        icon: 'success',
        title: 'Observación registrada',
        text: `La observación para la comisión ${codigo} ha sido guardada`,
        confirmButtonText: 'Entendido',
      })
    } catch (error) {
      throw error
    }
  }

  // Función para recepcionar manualmente por código
  const handleIngresoManual = async () => {
    const {value: codigo} = await Swal.fire({
      title: 'Ingreso Manual de Código',
      input: 'text',
      inputLabel: 'Código de la comisión',
      inputPlaceholder: 'Ingrese el código...',
      showCancelButton: true,
      confirmButtonText: '<i class="las la-search fs-5 me-2"></i> Buscar',
      cancelButtonText: '<i class="bi bi-x fs-5 me-2"></i>Cancelar',
      reverseButtons: true,
      customClass: {
        confirmButton: 'btn btn-primary',
        cancelButton: 'btn btn-danger',
      },
      inputValidator: (value) => {
        if (!value) {
          return 'Debe ingresar un código'
        }
        if (!/^\d+$/.test(value)) {
          return 'El código debe ser un número entero positivo'
        }
      },
    })

    if (codigo) {
      await handleQRDetected({code: codigo, timestamp: Date.now()})
    }
  }
  useEffect(() => {
    console.log(fechaHora)
  }, [fechaHora])


  useEffect(() => {
    const timer = setInterval(() => {
      setFechaHora(new Date())
    }, 1000)

    return () => clearInterval(timer) // limpieza
  }, [])

  return (
    <>
      {/* <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: 'MENU.COMMISSION_RECEPTION' })}
      </PageTitle> */}

      <div className='row g-6'>
        {/* Panel principal del escáner */}
        <div className='col-xl-8'>
          <div className='card'>
            <div className='card-header'>
              <div className='card-title'>
                <h3 className='fw-bold'>
                  <i className='bi bi-qr-code-scan me-3 text-primary'></i>
                  Escáner de Códigos QR
                </h3>
              </div>
               {/* <RelojTiempoReal /> */}
            </div>
            <div className='card-body'>
              {modoRecepcion === 'automatico' && (
                <div className='alert alert-info d-flex align-items-center py-2 mb-3'>
                  <i className='bi bi-info-circle me-2'></i>
                  <small>Modo automático: Recepción directa para estados GENERADO/ENVIADO</small>
                </div>
              )}
              <QRReaderAlternative onQRDetected={handleQRDetected} autoStart={true} />
            </div>
          </div>
        </div>

        {/* Panel de información y controles */}
        <div className='col-xl-4'>
          {/* Controles adicionales */}
          <div className='card mb-6'>
            <div className='card-header border-0 bg-primary bg-opacity-10'>
              <h3 className='card-title text-primary fw-bold'>Controles</h3>
            </div>
            <div className='card-body'>
              <div className='d-flex justify-content-between align-items-center'>
                <label className='form-label m-0 me-2'>Recepción:</label>
                <select
                  className='form-select form-select-sm w-auto'
                  value={modoRecepcion}
                  onChange={(e) => {
                    setModoRecepcion(e.target.value as 'automatico' | 'manual')
                    console.log(modoRecepcion)
                  }}
                >
                  <option value='automatico'>Automático</option>
                  <option value='manual'>Manual</option>
                </select>
              </div>

              <div className='d-flex justify-content-between align-items-center mt-4'>
                <label htmlFor='fechaRecepcion' className='form-label mb-0 me-3'>
                  Fecha de Recepción:
                </label>
                {/* <input
                  type='datetime-local'
                  id='fechaRecepcion'
                  className='form-control form-control-sm w-auto'
                  value={fechaHora}
                  onChange={(e) => setFechaHora(e.target.value)}
                /> */}
              </div>
              <div className='d-flex justify-content-between align-items-center mt-3 mb-4'>
                <div className='form-check form-switch form-switch-sm d-flex justify-content-between align-items-center w-100 p-0'>
                  <label className='form-text mb-0' htmlFor='fechaRecepcionToggle'>
                    Sincronización de reloj
                  </label>
                  <input
                    className='form-check-input'
                    type='checkbox'
                    id='fechaRecepcionToggle'
                    checked={!isPaused}
                    onChange={(e) => setIsPaused(!e.target.checked)}
                  />
                </div>
              </div>

              <button
                onClick={handleIngresoManual}
                className='btn btn-light-primary w-100 mb-3'
                disabled={loading}
              >
                <i className='bi bi-keyboard me-2'></i>
                Ingreso Manual
              </button>

              {loading && (
                <div className='text-center'>
                  <div className='spinner-border text-primary' role='status'>
                    <span className='visually-hidden'>Procesando...</span>
                  </div>
                  <p className='text-muted mt-2'>Procesando recepción...</p>
                </div>
              )}
            </div>
          </div>

          {/* Último código escaneado */}
          {lastScannedCode && (
            <div className='card mb-6'>
              <div className='card-header border-0 bg-success bg-opacity-10'>
                <h3 className='card-title text-success fw-bold'>Último Código</h3>
              </div>
              <div className='card-body'>
                <div className='d-flex align-items-center'>
                  <div className='symbol symbol-40px me-4'>
                    <div className='symbol-label bg-light-success'>
                      <i className='bi bi-qr-code text-success fs-4'></i>
                    </div>
                  </div>
                  <div className='flex-grow-1'>
                    <div className='fw-bold text-gray-800'>{lastScannedCode}</div>
                    <div className='text-muted fs-7'>{new Date().toLocaleTimeString('es-BO')}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Historial de códigos */}
          {scannedHistory.length > 0 && (
            <div className='card'>
              <div className='card-header border-0 bg-info bg-opacity-10'>
                <h3 className='card-title text-info fw-bold'>Historial Reciente</h3>
              </div>
              <div className='card-body'>
                <div className='scroll-y' style={{maxHeight: '300px'}}>
                  {scannedHistory.map((item, index) => (
                    <div key={index} className='d-flex align-items-center py-2'>
                      <div className='symbol symbol-30px me-3'>
                        <div className='symbol-label bg-light-primary'>
                          <i className='bi bi-clock text-primary fs-6'></i>
                        </div>
                      </div>
                      <div className='flex-grow-1'>
                        <div className='fw-semibold text-gray-800 fs-7'>{item.code}</div>
                        <div className='text-muted fs-8'>
                          {new Date(item.timestamp).toLocaleTimeString('es-BO')}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export {RecepcionPorQrView}
