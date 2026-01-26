import {FC, useState} from 'react'
import {Modal} from 'react-bootstrap'
import {useFormik} from 'formik'
import * as Yup from 'yup'
import clsx from 'clsx'
import {KTIcon} from 'src/_metronic/helpers'
import {DispositivoBiometrico} from '../core/_models'
import {showToast} from 'src/app/utils/toastHelper'
import axios from 'axios'
import {loginBiometrico, logoutBiometrico} from '../core/_requests'

type Props = {
  device: DispositivoBiometrico
  show: boolean
  onClose: () => void
}

// Schema de validación para credenciales
const credentialsSchema = Yup.object().shape({
  username: Yup.string()
    .min(1, 'El usuario debe tener al menos 3 caracteres')
    .required('El usuario es obligatorio'),
  password: Yup.string()
    .min(4, 'La contraseña debe tener al menos 4 caracteres')
    .required('La contraseña es obligatoria'),
})

const AdministerDeviceModal: FC<Props> = ({device, show, onClose}) => {
  const [isConnecting, setIsConnecting] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [deviceSession, setDeviceSession] = useState<any>(null)
  const [activeTab, setActiveTab] = useState<'login' | 'manage'>('login')

  const formik = useFormik({
    initialValues: {
      username: 'admin',
      password: '',
    },
    validationSchema: credentialsSchema,
    onSubmit: async (values, {setSubmitting}) => {
      setSubmitting(true)
      setIsConnecting(true)

      try {
        // Intentar conectar con credenciales
        // const response = await axios.post('/api/zkteco/login', {
        //   device_ip: device.direccion_ip,
        //   username: values.username,
        //   password: values.password,
        // })

        const response = await loginBiometrico(
          device.direccion_ip!, // 👈 pasamos la IP al backend
          values.username,
          values.password
        )

        console.log(response)

        if (response.success) {
          setIsConnected(true)
          setDeviceSession(response.session_status)
          setActiveTab('manage')
          showToast({
            message: 'Conectado exitosamente al dispositivo',
            type: 'success',
          })
        } else {
          showToast({
            message: 'Error de autenticación. Verifique las credenciales.',
            type: 'error',
          })
        }
      } catch (error: any) {
        showToast({
          message: error.response?.data?.message || 'Error al conectar con el dispositivo',
          type: 'error',
        })
      } finally {
        setIsConnecting(false)
        setSubmitting(false)
      }
    },
  })

  const handleLogout = async () => {
    try {
      const response = await logoutBiometrico()

      if (response.success) {
        setIsConnected(false)
        setDeviceSession(null)
        setActiveTab('login')
        showToast({
          message: response.message ?? 'Sesión cerrada exitosamente',
          type: 'info',
        })
      } else {
        showToast({
          message: response.message ?? 'Error al cerrar sesión',
          type: 'error',
        })
      }
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
      showToast({
        message: 'Error inesperado al cerrar sesión',
        type: 'error',
      })
    }
  }

  const handleClose = () => {
    if (isConnected) {
      handleLogout()
    }
    onClose()
  }

  const handleSyncDevice = async () => {
    try {
      showToast({
        message: 'Iniciando sincronización...',
        type: 'info',
      })

      const response = await axios.post('/api/zkteco/sync')

      if (response.data.success) {
        showToast({
          message: `Sincronización exitosa. Registros: ${response.data.data.records_count}`,
          type: 'success',
        })
      }
    } catch (error: any) {
      showToast({
        message: 'Error durante la sincronización',
        type: 'error',
      })
    }
  }

  const isFieldValid = (fieldName: string) => {
    return !(formik.touched[fieldName] && formik.errors[fieldName])
  }

  return (
    <Modal show={show} onHide={handleClose} size='xl' centered>
      <Modal.Header closeButton>
        <Modal.Title>
          <KTIcon iconName='cog' className='fs-2 me-2' />
          Administrar Dispositivo
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {/* Información del dispositivo */}
        <div className='bg-light-primary p-4 rounded mb-6'>
          <div className='d-flex align-items-center'>
            <div className='flex-grow-1'>
              <h5 className='mb-1'>{device.nombre_dispositivo}</h5>
              <p className='text-muted mb-0'>
                {device.direccion_ip}:{device.puerto} | Serial: {device.serial}
              </p>
            </div>
            <div className='ms-3'>
              <span
                className={`badge badge-lg ${isConnected ? 'badge-success' : 'badge-secondary'}`}
              >
                {isConnected ? 'Conectado' : 'Desconectado'}
              </span>
            </div>
          </div>
        </div>

        {/* Tabs de navegación */}
        <ul className='nav nav-tabs nav-line-tabs mb-6'>
          <li className='nav-item'>
            <a
              className={`nav-link ${activeTab === 'login' ? 'active' : ''}`}
              onClick={() => setActiveTab('login')}
              style={{cursor: 'pointer'}}
            >
              <KTIcon iconName='key' className='fs-2 me-2' />
              Autenticación
            </a>
          </li>
          <li className='nav-item'>
            <a
              className={`nav-link ${activeTab === 'manage' ? 'active' : ''} ${
                !isConnected ? 'disabled' : ''
              }`}
              onClick={() => isConnected && setActiveTab('manage')}
              style={{cursor: isConnected ? 'pointer' : 'not-allowed'}}
            >
              <KTIcon iconName='setting-2' className='fs-2 me-2' />
              Administrar
            </a>
          </li>
        </ul>

        {/* Contenido de las tabs */}
        {activeTab === 'login' && (
          <div className='tab-pane'>
            <form onSubmit={formik.handleSubmit}>
              <div className='row'>
                <div className='col-md-6 fv-row mb-7'>
                  <label className='required fw-bold fs-6 mb-2'>Usuario</label>
                  <input
                    {...formik.getFieldProps('username')}
                    className={clsx('form-control form-control-solid', {
                      'is-invalid': !isFieldValid('username'),
                      'is-valid': formik.touched.username && isFieldValid('username'),
                    })}
                    disabled={formik.isSubmitting || isConnecting}
                    placeholder='admin'
                  />
                  {!isFieldValid('username') && (
                    <div className='invalid-feedback'>{formik.errors.username}</div>
                  )}
                </div>

                <div className='col-md-6 fv-row mb-7'>
                  <label className='required fw-bold fs-6 mb-2'>Contraseña</label>
                  <input
                    type='password'
                    {...formik.getFieldProps('password')}
                    className={clsx('form-control form-control-solid', {
                      'is-invalid': !isFieldValid('password'),
                      'is-valid': formik.touched.password && isFieldValid('password'),
                    })}
                    disabled={formik.isSubmitting || isConnecting}
                    placeholder='Ingrese contraseña'
                  />
                  {!isFieldValid('password') && (
                    <div className='invalid-feedback'>{formik.errors.password}</div>
                  )}
                </div>
              </div>

              <div className='d-flex justify-content-end'>
                <button
                  type='submit'
                  className='btn btn-primary'
                  disabled={!formik.isValid || formik.isSubmitting || isConnecting}
                >
                  <i className='las la-plug fs-5 me-2'></i>
                  {isConnecting && <span className='spinner-border spinner-border-sm me-2' />}
                  {isConnected ? 'Reconectar' : 'Conectar'}
                </button>
              </div>
            </form>
          </div>
        )}

        {activeTab === 'manage' && isConnected && (
          <div className='tab-pane'>
            {/* Información de sesión */}
            {deviceSession && (
              <div className='alert alert-success mb-6'>
                <div className='d-flex align-items-center'>
                  <KTIcon iconName='check-circle' className='fs-2 text-success me-3' />
                  <div>
                    <strong>Sesión activa</strong>
                    <br />
                    <small>Conectado como: {formik.values.username}</small>
                  </div>
                </div>
              </div>
            )}

            {/* Acciones de administración */}
            <div className='row g-4'>
              <div className='col-md-6'>
                <div className='card card-flush h-100'>
                  <div className='card-body text-center'>
                    <KTIcon iconName='arrows-loop' className='fs-2x text-primary mb-3' />
                    <h6>Sincronizar Datos</h6>
                    <p className='text-muted fs-7 mb-4'>
                      Descarga registros de asistencia y actualiza usuarios
                    </p>
                    <button className='btn btn-sm btn-primary' onClick={handleSyncDevice}>
                      Sincronizar
                    </button>
                  </div>
                </div>
              </div>

              <div className='col-md-6'>
                <div className='card card-flush h-100'>
                  <div className='card-body text-center'>
                    <KTIcon iconName='information' className='fs-2x text-info mb-3' />
                    <h6>Información del Dispositivo</h6>
                    <p className='text-muted fs-7 mb-4'>Ver estado, capacidad y configuración</p>
                    <button className='btn btn-sm btn-info' onClick={() => console.log('Ver info')}>
                      Ver Detalles
                    </button>
                  </div>
                </div>
              </div>

              <div className='col-md-6'>
                <div className='card card-flush h-100'>
                  <div className='card-body text-center'>
                    <KTIcon iconName='user-tick' className='fs-2x text-success mb-3' />
                    <h6>Gestionar Usuarios</h6>
                    <p className='text-muted fs-7 mb-4'>Subir, descargar o eliminar usuarios</p>
                    <button
                      className='btn btn-sm btn-success'
                      onClick={() => console.log('Gestionar usuarios')}
                    >
                      Usuarios
                    </button>
                  </div>
                </div>
              </div>

              <div className='col-md-6'>
                <div className='card card-flush h-100'>
                  <div className='card-body text-center'>
                    <KTIcon iconName='setting-3' className='fs-2x text-warning mb-3' />
                    <h6>Configuración</h6>
                    <p className='text-muted fs-7 mb-4'>
                      Ajustar fecha, hora y parámetros del dispositivo
                    </p>
                    <button
                      className='btn btn-sm btn-warning'
                      onClick={() => console.log('Configurar')}
                    >
                      Configurar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal.Body>

      <Modal.Footer>
        <div className='d-flex justify-content-between w-100'>
          <div>
            {isConnected && (
              <button type='button' className='btn btn-light-warning' onClick={handleLogout}>
                <KTIcon iconName='exit-down' className='fs-2 me-2' />
                Desconectar
              </button>
            )}
          </div>
          <button type='button' className='btn btn-secondary' onClick={handleClose}>
            Cerrar
          </button>
        </div>
      </Modal.Footer>
    </Modal>
  )
}

export {AdministerDeviceModal}
