import {FC, useState, useEffect} from 'react'
import {KTIcon} from 'src/_metronic/helpers'
import {showToast} from 'src/app/utils/toastHelper'
import {getDeviceUsers} from '../../core/_requests'

type DeviceUser = {
  uid: number
  department: string
  id_number: string
  name: string
  card: string
  group: string
  privilege: string
  edit_url: string
}

type Props = {
  isConnected: boolean
}

const UsersManagementComponent: FC<Props> = ({isConnected}) => {
  const [users, setUsers] = useState<DeviceUser[]>([])
  const [loading, setLoading] = useState(false)
  const [totalUsers, setTotalUsers] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')

  const loadUsers = async () => {
    if (!isConnected) return

    setLoading(true)
    try {
      const response = await getDeviceUsers()
      if (response.success) {
        setUsers(response.data)
        setTotalUsers(response.count)
        showToast({
          message: `${response.count} usuarios cargados exitosamente`,
          type: 'success',
        })
      } else {
        showToast({
          message: 'Error al cargar usuarios del dispositivo',
          type: 'error',
        })
      }
    } catch (error: any) {
      showToast({
        message: error.message || 'Error al cargar usuarios',
        type: 'error',
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isConnected) {
      loadUsers()
    }
  }, [isConnected])

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.id_number.includes(searchTerm) ||
      user.department.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getPrivilegeBadgeClass = (privilege: string) => {
    switch (privilege) {
      case 'Super Administrator':
        return 'badge-danger'
      case 'Administrator':
        return 'badge-warning'
      default:
        return 'badge-primary'
    }
  }

  if (!isConnected) {
    return (
      <div className='text-center py-10'>
        <KTIcon iconName='user-tick' className='fs-2x text-muted mb-3' />
        <p className='text-muted'>Debe estar conectado al dispositivo para gestionar usuarios</p>
      </div>
    )
  }

  return (
    <div className='card card-flush'>
      <div className='card-header'>
        <div className='card-title'>
          <div className='d-flex align-items-center position-relative my-1'>
            <KTIcon iconName='magnifier' className='fs-3 position-absolute ms-5' />
            <input
              type='text'
              className='form-control form-control-solid w-250px ps-12'
              placeholder='Buscar usuarios...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className='card-toolbar'>
          <div className='d-flex justify-content-end' data-kt-user-table-toolbar='base'>
            <button type='button' className='btn btn-primary me-2' onClick={loadUsers}>
              <KTIcon iconName='arrows-loop' className='fs-2 me-2' />
              {loading && <span className='spinner-border spinner-border-sm me-2' />}
              Actualizar
            </button>
            <span className='badge badge-secondary fs-6'>
              Total: {totalUsers} usuarios
            </span>
          </div>
        </div>
      </div>

      <div className='card-body py-4'>
        {loading ? (
          <div className='text-center py-10'>
            <div className='spinner-border' role='status'>
              <span className='visually-hidden'>Cargando...</span>
            </div>
            <p className='text-muted mt-3'>Cargando usuarios del dispositivo...</p>
          </div>
        ) : (
          <div className='table-responsive'>
            <table className='table table-rounded table-striped border gy-5 gs-7'>
              <thead>
                <tr className='fw-bold fs-6 text-gray-800 px-7'>
                  <th>UID</th>
                  <th>Nombre</th>
                  <th>ID/Cédula</th>
                  <th>Grupo</th>
                  <th>Privilegio</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className='text-center py-5'>
                      <KTIcon iconName='user-tick' className='fs-2x text-muted mb-3' />
                      <p className='text-muted'>No se encontraron usuarios</p>
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.uid}>
                      <td>
                        <span className='badge badge-light-info'>{user.uid}</span>
                      </td>
                      <td>
                        <div className='d-flex flex-column'>
                          <a href='#' className='text-gray-800 text-hover-primary mb-1'>
                            {user.name}
                          </a>
                        </div>
                      </td>
                      <td>
                        <span className='text-gray-600'>{user.id_number}</span>
                      </td>
                      <td>
                        <span className='badge badge-light'>{user.group}</span>
                      </td>
                      <td>
                        <span className={`badge ${getPrivilegeBadgeClass(user.privilege)}`}>
                          {user.privilege}
                        </span>
                      </td>
                      <td>
                        <span className='text-gray-600'>edit</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {filteredUsers.length > 0 && (
          <div className='d-flex justify-content-between align-items-center mt-5'>
            <span className='text-muted'>
              Mostrando {filteredUsers.length} de {totalUsers} usuarios
            </span>
            <div className='d-flex gap-2'>
              <button className='btn btn-sm btn-light-primary'>
                <KTIcon iconName='cloud-download' className='fs-5 me-1' />
                Exportar
              </button>
              <button className='btn btn-sm btn-light-success'>
                <KTIcon iconName='user-plus' className='fs-5 me-1' />
                Agregar Usuario
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export {UsersManagementComponent}