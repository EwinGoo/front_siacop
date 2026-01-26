/* eslint-disable jsx-a11y/anchor-is-valid */
import {FC, useEffect, useState} from 'react'
import {useMutation, useQueryClient} from 'react-query'
import {MenuComponent} from '../../../../../../../../_metronic/assets/ts/components'
import {ID, KTIcon, QUERIES} from '../../../../../../../../_metronic/helpers'
import {useListView} from '../../core/ListViewProvider'
import {useQueryResponse} from '../../core/QueryResponseProvider'
import {
  deleteDispositivoBiometrico,
  getDispositivoBiometricoById,
  testDeviceConnection,
} from '../../core/_requests'
import {showToast} from 'src/app/utils/toastHelper'
import {showConfirmDialog, showErrorModal} from 'src/app/utils/swalHelpers.ts'
import {AdministerDeviceModal} from '../../administer-modal/AdministerDeviceModal'
import axios from 'axios'
import {API_ROUTES} from 'src/app/config/apiRoutes'
import { DispositivoBiometrico } from '../../core/_models'

const BIOMETRICO_URL = API_ROUTES.CONTROL_PERSONAL + '/biometrico'

type Props = {
  id: ID
}

const ActionsCell: FC<Props> = ({id}) => {
  const {setItemIdForUpdate, setIsShow} = useListView()
  const {query} = useQueryResponse()
  const queryClient = useQueryClient()
  const [showAdminModal, setShowAdminModal] = useState(false)
  const [deviceData, setDeviceData] = useState<DispositivoBiometrico | undefined>({})
  // const state

  useEffect(() => {
    MenuComponent.reinitialization()
  }, [])

  const openEditModal = async () => {
    setItemIdForUpdate(id)
    setIsShow(true)
  }

  const deleteItem = useMutation(() => deleteDispositivoBiometrico(id), {
    onSuccess: () => {
      queryClient.invalidateQueries([`${QUERIES.DISPOSITIVOS_BIOMETRICOS_LIST}-${query}`])
      showToast({
        message: 'Dispositivo biométrico eliminado correctamente',
        type: 'success',
      })
    },
    onError: (error: any) => {
      showToast({
        message: error.response?.data?.message || 'Error al eliminar el dispositivo biométrico',
        type: 'error',
      })
    },
  })

  const handleAdministerDevice = async () => {
    try {
      showToast({
        message: 'Verificando estado del dispositivo...',
        type: 'info',
      })

      // Primero verificar si el dispositivo está en línea
      // testDeviceConnection(id)
      // const response = await axios.get(`${BIOMETRICO_URL}/${id}/ping`)
      const response = await testDeviceConnection(id);

      if (response?.status === 'reachable') {
        // Si está en línea, obtener datos del dispositivo y abrir modal
        const deviceResponse = await getDispositivoBiometricoById(id)
        setDeviceData(deviceResponse)
        setShowAdminModal(true)

        showToast({
          message: 'Dispositivo en línea. Ingrese credenciales para administrar.',
          type: 'success',
        })
      } else {
        showToast({
          message: 'El dispositivo no está en línea. Verifique la conexión de red.',
          type: 'error',
        })
      }
    } catch (error: any) {
      showToast({
        message: 'Error al verificar el estado del dispositivo',
        type: 'error',
      })
    }
  }

  const handleTestConnection = async () => {
    try {
      showToast({
        message: 'Probando conexión con el dispositivo...',
        type: 'info',
      })

      const response = await testDeviceConnection(id)

      console.log(response)

      if (response?.status === 'reachable') {
        queryClient.invalidateQueries([`${QUERIES.DISPOSITIVOS_BIOMETRICOS_LIST}-${query}`])
        showToast({
          message: response.message ?? 'Dispositivo conectado y funcionando correctamente',
          type: 'success',
        })
      } else {
        await showErrorModal(
          'Error en la conexión de red',
          response?.message ?? 'No se pudo conectar con el dispositivo'
        )
      }
    } catch (error: any) {
      showToast({
        message: 'Error al probar la conexión',
        type: 'error',
      })
    }
  }

  const handleSyncDevice = async () => {
    try {
      const result = await showConfirmDialog({
        title: 'Sincronizar dispositivo',
        text: 'Esto descargará nuevos registros y actualizará la información del dispositivo. ¿Continuar?',
        icon: 'info',
        confirmButtonText: 'Sí, sincronizar',
        cancelButtonText: 'Cancelar',
      })

      if (result.isConfirmed) {
        showToast({
          message: 'Iniciando sincronización...',
          type: 'info',
        })

        // TODO: Implementar endpoint para sincronizar
        // const response = await syncBiometricDevice(id)

        // Simulación temporal - reemplazar con llamada real al API
        setTimeout(() => {
          showToast({
            message: 'Sincronización completada exitosamente',
            type: 'success',
          })
          // Refrescar la lista para mostrar nueva fecha de sincronización
          queryClient.invalidateQueries([`${QUERIES.DISPOSITIVOS_BIOMETRICOS_LIST}-${query}`])
        }, 3000)
      }
    } catch (error: any) {
      showToast({
        message: 'Error durante la sincronización',
        type: 'error',
      })
    }
  }

  const handleDelete = async () => {
    try {
      const result = await showConfirmDialog({
        title: '¿Estás seguro?',
        text: '¡Esta acción eliminará permanentemente el dispositivo biométrico!',
        icon: 'warning',
        confirmButtonText: 'Sí, eliminar dispositivo',
        cancelButtonText: 'Cancelar',
      })

      if (result.isConfirmed) {
        await deleteItem.mutateAsync()
      }
    } catch (error) {
      // Error is already handled in onError
    }
  }

  return (
    <>
      <a
        href='#'
        className='btn btn-outline btn-outline-primary btn-sm'
        data-kt-menu-trigger='click'
        data-kt-menu-placement='bottom-end'
      >
        Acciones
        <KTIcon iconName='down' className='fs-5 m-0' />
      </a>
      {/* begin::Menu */}
      <div
        className='menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg-light-primary fw-bold fs-7 w-175px py-4'
        data-kt-menu='true'
      >
        {/* Edit action */}
        <div className='menu-item px-3'>
          <a className='menu-link px-3' onClick={openEditModal}>
            <i className='las la-edit fs-5 me-2'></i> Editar dispositivo
          </a>
        </div>

        {/* Administrar device action */}
        <div className='menu-item px-3'>
          <a className='menu-link px-3' onClick={handleAdministerDevice}>
            <i className='las la-cog fs-5 me-2'></i> Administrar
          </a>
        </div>

        {/* Test connection action */}
        <div className='menu-item px-3'>
          <a className='menu-link px-3' onClick={handleTestConnection}>
            <i className='las la-plug fs-5 me-2'></i> Probar conexión
          </a>
        </div>

        {/* Sync action */}
        <div className='menu-item px-3'>
          <a className='menu-link px-3' onClick={handleSyncDevice}>
            <i className='las la-sync fs-5 me-2'></i> Sincronizar datos
          </a>
        </div>

        {/* Delete action */}
        <div className='menu-item px-3'>
          <a className='menu-link px-3 text-danger' onClick={handleDelete}>
            <i className='las la-trash-alt fs-5 me-2'></i> Eliminar
          </a>
        </div>
      </div>
      {/* end::Menu */}

      {/* Modal de administración */}
      {showAdminModal && deviceData && (
        <AdministerDeviceModal
          device={deviceData}
          // show={showAdminModal}
          show={showAdminModal}
          onClose={() => setShowAdminModal(false)}
        />
      )}
    </>
  )
}

export {ActionsCell}
