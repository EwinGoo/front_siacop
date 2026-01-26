import {FC, useState, useEffect} from 'react'
import {KTIcon} from 'src/_metronic/helpers'
import {showToast} from 'src/app/utils/toastHelper'
import {getDeviceInfo} from '../../core/_requests'

type DeviceInfo = {
  device_name: string
  serial_number: string
  produce_date: string
  ip_address: string
  user_capacity: string
  transaction_capacity: string
  finger_capacity: string
  lock: string
  rf_card: string
  short_message_management: string
  usb_disk: string
  usb_client: string
  remote_identification_server: string
}

type Props = {
  isConnected: boolean
}

const DeviceInfoComponent: FC<Props> = ({isConnected}) => {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo | null>(null)
  const [loading, setLoading] = useState(false)

  const loadDeviceInfo = async () => {
    if (!isConnected) return

    setLoading(true)
    try {
      const response = await getDeviceInfo()
      if (response.success) {
        setDeviceInfo(response.data)
        showToast({
          message: 'Información del dispositivo cargada exitosamente',
          type: 'success',
        })
      } else {
        showToast({
          message: 'Error al cargar información del dispositivo',
          type: 'error',
        })
      }
    } catch (error: any) {
      showToast({
        message: error.message || 'Error al cargar información del dispositivo',
        type: 'error',
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isConnected) {
      loadDeviceInfo()
    }
  }, [isConnected])

  const getStatusBadge = (status: string) => {
    const isEnabled = status.toLowerCase() === 'enable'
    return (
      <span className={`badge ${isEnabled ? 'badge-success' : 'badge-secondary'}`}>
        {status}
      </span>
    )
  }

  const parseCapacity = (capacity: string) => {
    if (capacity.includes('/')) {
      const [total, used] = capacity.split('/')
      const percentage = used && total ? Math.round((parseInt(used) / parseInt(total)) * 100) : 0
      return {total: parseInt(total), used: parseInt(used), percentage}
    }
    return {total: 0, used: 0, percentage: 0}
  }

  const renderCapacityCard = (title: string, icon: string, capacity: string, color: string) => {
    const {total, used, percentage} = parseCapacity(capacity)
    
    return (
      <div className='col-md-4'>
        <div className='card card-flush h-100'>
          <div className='card-body text-center'>
            <KTIcon iconName={icon} className={`fs-2x text-${color} mb-3`} />
            <h6 className='mb-2'>{title}</h6>
            <div className='fs-2 fw-bold mb-2'>{used.toLocaleString()}</div>
            <div className='text-muted fs-7 mb-3'>de {total.toLocaleString()}</div>
            <div className='progress mb-2' style={{height: '8px'}}>
              <div
                className={`progress-bar bg-${color}`}
                role='progressbar'
                style={{width: `${percentage}%`}}
                aria-valuenow={percentage}
                aria-valuemin={0}
                aria-valuemax={100}
              ></div>
            </div>
            <span className='text-muted fs-8'>{percentage}% utilizado</span>
          </div>
        </div>
      </div>
    )
  }

  if (!isConnected) {
    return (
      <div className='text-center py-10'>
        <KTIcon iconName='information' className='fs-2x text-muted mb-3' />
        <p className='text-muted'>Debe estar conectado al dispositivo para ver la información</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className='text-center py-10'>
        <div className='spinner-border' role='status'>
          <span className='visually-hidden'>Cargando...</span>
        </div>
        <p className='text-muted mt-3'>Cargando información del dispositivo...</p>
      </div>
    )
  }

  if (!deviceInfo) {
    return (
      <div className='text-center py-10'>
        <KTIcon iconName='cross-circle' className='fs-2x text-danger mb-3' />
        <p className='text-muted'>No se pudo cargar la información del dispositivo</p>
        <button className='btn btn-sm btn-primary' onClick={loadDeviceInfo}>
          Reintentar
        </button>
      </div>
    )
  }

  return (
    <div className='card card-flush'>
      <div className='card-header'>
        <div className='card-title'>
          <h3 className='fw-bold m-0'>Información del Dispositivo</h3>
        </div>
        <div className='card-toolbar'>
          <button type='button' className='btn btn-sm btn-primary' onClick={loadDeviceInfo}>
            <KTIcon iconName='arrows-loop' className='fs-5 me-1' />
            Actualizar
          </button>
        </div>
      </div>

      <div className='card-body py-4'>
        {/* Información General */}
        <div className='row mb-6'>
          <div className='col-md-6'>
            <div className='card bg-light-info'>
              <div className='card-body'>
                <div className='d-flex align-items-center'>
                  <KTIcon iconName='tablet' className='fs-2x text-info me-4' />
                  <div>
                    <h5 className='mb-1'>{deviceInfo.device_name}</h5>
                    <p className='text-muted mb-0'>S/N: {deviceInfo.serial_number}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='col-md-6'>
            <div className='card bg-light-primary'>
              <div className='card-body'>
                <div className='d-flex align-items-center'>
                  <KTIcon iconName='network' className='fs-2x text-primary me-4' />
                  <div>
                    <h5 className='mb-1'>{deviceInfo.ip_address}</h5>
                    <p className='text-muted mb-0'>
                      Fabricado: {new Date(deviceInfo.produce_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Capacidades */}
        <div className='mb-6'>
          <h6 className='mb-4'>Capacidades</h6>
          <div className='row g-4'>
            {renderCapacityCard(
              'Usuarios',
              'user-tick',
              deviceInfo.user_capacity,
              'primary'
            )}
            {renderCapacityCard(
              'Transacciones',
              'chart-line-up',
              deviceInfo.transaction_capacity,
              'success'
            )}
            {renderCapacityCard(
              'Huellas',
              'fingerprint-scanning',
              deviceInfo.finger_capacity,
              'warning'
            )}
          </div>
        </div>

        {/* Configuraciones */}
        <div className='mb-6'>
          <h6 className='mb-4'>Estado de Funciones</h6>
          <div className='row g-3'>
            <div className='col-md-3'>
              <div className='d-flex justify-content-between align-items-center p-3 bg-light rounded'>
                <span>Bloqueo</span>
                {getStatusBadge(deviceInfo.lock)}
              </div>
            </div>
            <div className='col-md-3'>
              <div className='d-flex justify-content-between align-items-center p-3 bg-light rounded'>
                <span>Tarjeta RF</span>
                {getStatusBadge(deviceInfo.rf_card)}
              </div>
            </div>
            <div className='col-md-3'>
              <div className='d-flex justify-content-between align-items-center p-3 bg-light rounded'>
                <span>Mensajes</span>
                {getStatusBadge(deviceInfo.short_message_management)}
              </div>
            </div>
            <div className='col-md-3'>
              <div className='d-flex justify-content-between align-items-center p-3 bg-light rounded'>
                <span>USB Disk</span>
                {getStatusBadge(deviceInfo.usb_disk)}
              </div>
            </div>
            <div className='col-md-3'>
              <div className='d-flex justify-content-between align-items-center p-3 bg-light rounded'>
                <span>USB Client</span>
                {getStatusBadge(deviceInfo.usb_client)}
              </div>
            </div>
            <div className='col-md-3'>
              <div className='d-flex justify-content-between align-items-center p-3 bg-light rounded'>
                <span>Servidor Remoto</span>
                {getStatusBadge(deviceInfo.remote_identification_server)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export {DeviceInfoComponent}