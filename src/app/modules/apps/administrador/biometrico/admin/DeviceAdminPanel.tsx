import {FC, useState} from 'react'
import clsx from 'clsx'
import {KTIcon} from 'src/_metronic/helpers'
import {UsersManagementComponent} from '../list/administer-modal/components/UsersManagementComponent'
import {DeviceInfoComponent} from '../list/administer-modal/components/DeviceInfoComponent'

type Tab = 'usuarios' | 'informacion'

const DeviceAdminPanel: FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('usuarios')

  return (
    <div className='card'>
      <div className='card-header border-0 pt-5'>
        <ul className='nav nav-stretch nav-line-tabs nav-line-tabs-2x border-transparent fs-5 fw-bold'>
          <li className='nav-item'>
            <button
              className={clsx('nav-link text-active-primary pb-4', {active: activeTab === 'usuarios'})}
              onClick={() => setActiveTab('usuarios')}
            >
              <KTIcon iconName='people' className='fs-3 me-2' />
              Usuarios del Dispositivo
            </button>
          </li>
          <li className='nav-item'>
            <button
              className={clsx('nav-link text-active-primary pb-4', {active: activeTab === 'informacion'})}
              onClick={() => setActiveTab('informacion')}
            >
              <KTIcon iconName='information' className='fs-3 me-2' />
              Información del Dispositivo
            </button>
          </li>
        </ul>
      </div>

      <div className='card-body pt-4'>
        {activeTab === 'usuarios' && <UsersManagementComponent isConnected={true} />}
        {activeTab === 'informacion' && <DeviceInfoComponent isConnected={true} />}
      </div>
    </div>
  )
}

export {DeviceAdminPanel}
