import {FC, useState} from 'react'
import {Modal} from 'react-bootstrap'
import {KTIcon} from 'src/_metronic/helpers'
import {DispositivoBiometrico} from '../core/_models'
import {showToast} from 'src/app/utils/toastHelper'
import {loginBiometrico, logoutBiometrico} from '../core/_requests'

// Importar los componentes separados
import {LoginTab} from './components/LoginTab'
import {UsersManagementComponent} from './components/UsersManagementComponent'
import {DeviceInfoComponent} from './components/DeviceInfoComponent'
import { SyncDataComponent } from './components/SyncDataComponent'
// import {SyncDataComponent} from './SyncDataComponent'

type Props = {
  device: DispositivoBiometrico
  show: boolean
  onClose: () => void
}

type TabType = 'login' | 'users' | 'info' | 'sync' | 'config'

const AdministerDeviceModal: FC<Props> = ({device, show, onClose}) => {
  const [isConnecting, setIsConnecting] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [deviceSession, setDeviceSession] = useState<any>(null)
  const [activeTab, setActiveTab] = useState<TabType>('login')

  const handleLogin = async (username: string, password: string) => {
    setIsConnecting(true)

    try {
      const response = await loginBiometrico(
        device.direccion_ip!,
        username,
        password
      )

      console.log(response)

      if (response.success) {
        setIsConnected(true)
        setDeviceSession(response.session_status)
        setActiveTab('users') // Cambiar a la pestaña de usuarios después del login
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
      console.log('entro fail login');
      
      // showToast({
      //   message: error.response?.data?.message || 'Error al conectar con el dispositivo',
      //   type: 'error',
      // })
    } finally {
      setIsConnecting(false)
    }
  }

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

  const handleTabClick = (tab: TabType) => {
    if (tab === 'login') {
      setActiveTab(tab)
    } else if (isConnected) {
      setActiveTab(tab)
    } else {
      showToast({
        message: 'Debe estar conectado al dispositivo para acceder a esta función',
        type: 'warning',
      })
    }
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'login':
        console.log('login');
        
        return (
          <LoginTab
            isConnecting={isConnecting}
            isConnected={isConnected}
            onLogin={handleLogin}
            onLogout={handleLogout}
          />
        )
      case 'users':
        return <UsersManagementComponent isConnected={isConnected} />
      case 'info':
        return <DeviceInfoComponent isConnected={isConnected} />
      case 'sync':
        return <SyncDataComponent isConnected={isConnected} />
      case 'config':
        return (
          <div className='text-center py-10'>
            <KTIcon iconName='setting-3' className='fs-2x text-warning mb-3' />
            <h6>Configuración del Dispositivo</h6>
            <p className='text-muted'>Esta función estará disponible próximamente</p>
            <button className='btn btn-sm btn-light-warning' disabled>
              <KTIcon iconName='tools' className='fs-5 me-1' />
              En Desarrollo
            </button>
          </div>
        )
      default:
        return null
    }
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
              onClick={() => handleTabClick('login')}
              style={{cursor: 'pointer'}}
            >
              <KTIcon iconName='key' className='fs-2 me-2' />
              Autenticación
            </a>
          </li>
          <li className='nav-item'>
            <a
              className={`nav-link ${activeTab === 'users' ? 'active' : ''} ${
                !isConnected ? 'disabled' : ''
              }`}
              onClick={() => handleTabClick('users')}
              style={{cursor: isConnected ? 'pointer' : 'not-allowed'}}
            >
              <KTIcon iconName='user-tick' className='fs-2 me-2' />
              Usuarios
            </a>
          </li>
          <li className='nav-item'>
            <a
              className={`nav-link ${activeTab === 'info' ? 'active' : ''} ${
                !isConnected ? 'disabled' : ''
              }`}
              onClick={() => handleTabClick('info')}
              style={{cursor: isConnected ? 'pointer' : 'not-allowed'}}
            >
              <KTIcon iconName='information' className='fs-2 me-2' />
              Información
            </a>
          </li>
          <li className='nav-item'>
            <a
              className={`nav-link ${activeTab === 'sync' ? 'active' : ''} ${
                !isConnected ? 'disabled' : ''
              }`}
              onClick={() => handleTabClick('sync')}
              style={{cursor: isConnected ? 'pointer' : 'not-allowed'}}
            >
              <KTIcon iconName='arrows-loop' className='fs-2 me-2' />
              Sincronizar
            </a>
          </li>
          <li className='nav-item'>
            <a
              className={`nav-link ${activeTab === 'config' ? 'active' : ''} ${
                !isConnected ? 'disabled' : ''
              }`}
              onClick={() => handleTabClick('config')}
              style={{cursor: isConnected ? 'pointer' : 'not-allowed'}}
            >
              <KTIcon iconName='setting-3' className='fs-2 me-2' />
              Configuración
            </a>
          </li>
        </ul>

        {/* Contenido de las tabs */}
        <div className='tab-content'>
          {renderTabContent()}
        </div>
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