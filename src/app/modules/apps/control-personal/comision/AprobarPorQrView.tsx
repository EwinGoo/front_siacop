import React, {useState, useRef, useEffect} from 'react'
import {useIntl} from 'react-intl'
import {PageTitle} from '../../../../../_metronic/layout/core'
import {KTSVG} from '../../../../../_metronic/helpers'
import {Html5Qrcode} from 'html5-qrcode'
import {aprobarComisionPorQR} from './comision-list/core/_requests'

import Swal from 'sweetalert2'

// Definir interfaces para los tipos
interface ScanResultType {
  code?: string
  [key: string]: any
}

interface CameraDevice {
  deviceId: string
  label: string
}

interface response{
  message: string
}

const AprobarPorQrView: React.FC = () => {
  const intl = useIntl()
  const [scanResult, setScanResult] = useState<ScanResultType | null>(null)
  const [cameraActive, setCameraActive] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [vacationCode, setVacationCode] = useState<string>('')
  const [cameraList, setCameraList] = useState<CameraDevice[]>([])
  const [selectedCamera, setSelectedCamera] = useState<string | null>(null)
  const [isScanning, setIsScanning] = useState<boolean>(false)

  const qrScannerRef = useRef<Html5Qrcode | null>(null)
  const scannerContainerRef = useRef<HTMLDivElement | null>(null)

  // Obtener lista de cámaras disponibles
  useEffect(() => {
    const getCameras = async () => {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
          const devices = await navigator.mediaDevices.enumerateDevices()
          const videoDevices = devices
            .filter((device) => device.kind === 'videoinput')
            .map((device) => ({
              deviceId: device.deviceId,
              label: device.label || `Cámara ${device.deviceId.substring(0, 5)}`,
            }))

          setCameraList(videoDevices)
          if (videoDevices.length > 0) {
            setSelectedCamera(videoDevices[0].deviceId)
          }
        }
      } catch (error) {
        console.error('Error al obtener cámaras:', error)
      }
    }

    getCameras()
  }, [])

  // Función segura para detener el escáner
  const safelyStopScanner = async () => {
    if (qrScannerRef.current && isScanning) {
      try {
        await qrScannerRef.current.stop()
        setIsScanning(false)
      } catch (error) {
        console.warn('Error al detener el escáner (puede ser ignorado):', error)
        // Reiniciar el estado incluso si hay error
        setIsScanning(false)
      }
    }
  }

  // Iniciar escáner
  const startScanner = async () => {
    if (!selectedCamera || !scannerContainerRef.current) return

    // Asegurarse que el escáner previo esté detenido
    await safelyStopScanner()

    try {
      // Inicializar el nuevo escáner
      const html5QrCode = new Html5Qrcode('qr-reader')
      qrScannerRef.current = html5QrCode

      const config = {
        fps: 10,
        qrbox: {width: 250, height: 250},
        experimentalFeatures: {useBarCodeDetectorIfSupported: true},
      }

      await html5QrCode.start(
        selectedCamera,
        config,
        (decodedText: string, decodedResult: any) => {
          try {
            // Intentar parsear el resultado como JSON
            let parsedResult: ScanResultType
            try {
              parsedResult = JSON.parse(decodedText)
            } catch {
              // Si no es JSON válido, usar el texto como está
              parsedResult = {code: decodedText}
            }

            console.log('QR Code detected:', parsedResult)
            setScanResult(parsedResult)
            safelyStopScanner()
            setCameraActive(false)
          } catch (error) {
            console.error('Error al procesar el QR:', error)
          }
        },
        (errorMessage: string) => {
          // Solo loguear errores importantes, ignorar los mensajes regulares de "escaneo en proceso"
          if (!errorMessage.includes('scanning')) {
            console.warn('Error al escanear:', errorMessage)
          }
        }
      )

      setIsScanning(true)
    } catch (error) {
      console.error('Error al iniciar el escáner:', error)
      setIsScanning(false)
    }
  }

  // Efecto para controlar el ciclo de vida del escáner
  useEffect(() => {
    if (cameraActive && selectedCamera) {
      startScanner()
    } else {
      safelyStopScanner()
    }

    // Cleanup al desmontar
    return () => {
      safelyStopScanner()
    }
  }, [cameraActive, selectedCamera])

  const handleSwitchCamera = async (deviceId: string) => {
    // Detener el escáner actual
    await safelyStopScanner()

    // Cambiar la cámara
    setSelectedCamera(deviceId)

    // Si estaba activo, reiniciar con la nueva cámara después de un breve retraso
    if (cameraActive) {
      setTimeout(() => {
        startScanner()
      }, 300)
    }
  }

  // Función para manejar la aprobación usando SweetAlert
  const handleApprove = async () => {
    setLoading(true)
    try {
      // Obtener el código a enviar
      const rawCode = scanResult?.code || vacationCode
      const codigo = extractCodeFromURL(rawCode);
      // Llamar al servicio para aprobar la comisión
      const response = await aprobarComisionPorQR(codigo)

      // Mostrar mensaje de éxito con SweetAlert
      await Swal.fire({
        icon: 'success',
        title: 'Aprobación Exitosa',
        text: response.message || 'Comisión aprobada exitosamente',
        confirmButtonText: 'Aceptar',
      })

      // Limpiar el resultado del escaneo
      setScanResult(null)
    } catch (error: any) {
      console.error('Error al aprobar comisión:', error)

      // Mostrar mensaje de error con SweetAlert
      if (error.response && error.response.status === 404) {
        await Swal.fire({
          icon: 'error',
          title: 'Comisión No Encontrada',
          text: 'La boleta de comisión no fue encontrada en el sistema',
        })
      } else if (error.response && error.response.data && error.response.data.validation_errors) {
        // Mostrar errores de validación
        await Swal.fire({
          icon: 'error',
          title: 'Error de validación',
          html: Object.entries(error.response.data.validation_errors)
            .map(([field, message]) => `<li>${message}</li>`)
            .join(''),
        })
      } else {
        // Mostrar error genérico
        await Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.response?.data?.message || 'Ocurrió un error al procesar la solicitud',
        })
      }
    } finally {
      setLoading(false)
    }
  }

  const extractCodeFromURL = (url: string): string => {
    try {
      // Si la URL tiene formato completo (http://...)
      if (url.includes('/')) {
        // Obtener la última parte después de la última barra "/"
        const parts = url.split('/');
        return parts[parts.length - 1];
      }
      // Si es solo un código o texto simple
      return url;
    } catch (error) {
      console.error('Error al extraer código de la URL:', error);
      return url; // Devolver la URL original en caso de error
    }
  }

  return (
    <>
      {/* <PageTitle breadcrumbs={[]}>{intl.formatMessage({id: 'MENU.VACATION_APPROVAL'})}</PageTitle> */}

      <div className='card'>
        <div className='card-body py-6 mt-5'>
          <div className='text-center mb-10'>
            <h2 className='fs-1'>Escanee el código QR de la boleta de comisión</h2>
          </div>

          <div className='d-flex flex-column align-items-center justify-content-center'>
            {cameraActive ? (
              <div className='mb-10' style={{width: '100%', maxWidth: '500px'}}>
                <div
                  ref={scannerContainerRef}
                  className='position-relative'
                  style={{
                    width: '100%',
                    backgroundColor: '#1b2858',
                    borderRadius: '8px',
                    overflow: 'hidden',
                  }}
                >
                  <div id='qr-reader' style={{width: '100%', minHeight: '320px'}}></div>

                  <div className='position-absolute top-0 end-0 p-3'>
                    <div className='dropdown'>
                      <button
                        className='btn btn-sm btn-icon btn-light dropdown-toggle'
                        type='button'
                        data-bs-toggle='dropdown'
                      >
                        <i className='bi bi-camera-video'></i>
                      </button>
                      <ul className='dropdown-menu'>
                        {cameraList.map((camera) => (
                          <li key={camera.deviceId}>
                            <a
                              className={`dropdown-item ${
                                selectedCamera === camera.deviceId ? 'active' : ''
                              }`}
                              href='#'
                              onClick={(e) => {
                                e.preventDefault()
                                handleSwitchCamera(camera.deviceId)
                              }}
                            >
                              {camera.label}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className='text-center mb-10'>
                <button
                  onClick={() => setCameraActive(true)}
                  className='btn btn-light-primary btn-icon btn-lg mb-5'
                >
                  <KTSVG path='/media/icons/duotune/general/gen040.svg' className='svg-icon-3x' />
                </button>
                <p className='text-muted'>Haga clic para activar la cámara</p>
              </div>
            )}

            {/* Controles y botones */}
            <div className='d-flex justify-content-center mt-5'>
              {cameraActive && (
                <button onClick={() => setCameraActive(false)} className='btn btn-light me-5'>
                  <KTSVG
                    path='/media/icons/duotune/general/gen042.svg'
                    className='svg-icon-2 me-2'
                  />
                  Cancelar
                </button>
              )}

              <button
                onClick={handleApprove}
                className='btn btn-primary btn-lg px-10'
                disabled={loading}
              >
                {loading ? (
                  <span className='indicator-label'>
                    <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                  </span>
                ) : (
                  <>Aprobar Comisión</>
                )}
              </button>
            </div>

            {/* Resultado del escaneo */}
            {scanResult && (
              <div className='alert alert-success mt-5'>
                <h4 className='alert-heading'>¡Código QR detectado!</h4>
                <p>
                  {scanResult.code
                    ? `Código detectado: ${scanResult.code}`
                    : 'Se ha detectado correctamente el código QR'}
                </p>
                {Object.entries(scanResult)
                  .filter(([key]) => key !== 'code')
                  .map(([key, value]) => (
                    <p key={key}>
                      <strong>{key}:</strong> {String(value)}
                    </p>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export {AprobarPorQrView}
