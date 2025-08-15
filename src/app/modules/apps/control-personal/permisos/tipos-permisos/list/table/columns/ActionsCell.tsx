/* eslint-disable jsx-a11y/anchor-is-valid */
import {FC, useEffect} from 'react'
import {useMutation, useQueryClient} from 'react-query'
import {MenuComponent} from '../../../../../../../../../_metronic/assets/ts/components'
import {ID, KTIcon, QUERIES} from '../../../../../../../../../_metronic/helpers'
import {useListView} from '../../core/ListViewProvider'
import {useQueryResponse} from '../../core/QueryResponseProvider'
import {deleteTipoPermiso, toggleTipoPermisoStatus} from '../../core/_requests'
import {toast} from 'react-toastify'
import Swal from 'sweetalert2'
import { showConfirmDialog } from 'src/app/utils/swalHelpers.ts'

type Props = {
  id: ID
  isActive: boolean
}

const ActionsCell: FC<Props> = ({id, isActive}) => {
  const {setItemIdForUpdate, setIsShow} = useListView()
  const {query} = useQueryResponse()
  const queryClient = useQueryClient()

  useEffect(() => {
    MenuComponent.reinitialization()
  }, [])

  const openEditModal = async () => {
    setItemIdForUpdate(id)
    setIsShow(true)
  }

  const toggleStatus = useMutation(() => toggleTipoPermisoStatus(id), {
    onSuccess: () => {
      queryClient.invalidateQueries([`${QUERIES.TIPOS_PERMISOS_LIST}-${query}`])
      const action = isActive ? 'desactivado' : 'activado'
      toast.success(`Tipo de permiso ${action} correctamente`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      })
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Error al cambiar el estado', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      })
    }
  })

  const deleteItem = useMutation(() => deleteTipoPermiso(id), {
    onSuccess: () => {
      queryClient.invalidateQueries([`${QUERIES.TIPOS_PERMISOS_LIST}-${query}`])
      toast.success('Tipo de permiso eliminado correctamente', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      })
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Error al eliminar el tipo de permiso', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      })
    }
  })

  const handleToggleStatus = async () => {
    try {
      const action = isActive ? 'desactivar' : 'activar'
      const result = await Swal.fire({
        title: `¿${isActive ? 'Desactivar' : 'Activar'} tipo de permiso?`,
        text: `Esta acción ${action}á el tipo de permiso`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: `Sí, ${action}`,
        cancelButtonText: 'Cancelar',
        customClass: {
          confirmButton: 'btn btn-primary',
          cancelButton: 'btn btn-danger'
        },
      })

      if (result.isConfirmed) {
        await toggleStatus.mutateAsync()
      }
    } catch (error) {
      console.error(error)
    }
  }

  // const handleDelete = async () => {
  //   try {
  //     const result = await Swal.fire({
  //       title: '¿Estás seguro?',
  //       text: "¡No podrás revertir esta acción!",
  //       icon: 'warning',
  //       showCancelButton: true,
  //       confirmButtonColor: '#3085d6',
  //       cancelButtonColor: '#d33',
  //       confirmButtonText: 'Sí, eliminar',
  //       cancelButtonText: 'Cancelar'
  //     })

  //     if (result.isConfirmed) {
  //       await deleteItem.mutateAsync()
  //     }
  //   } catch (error) {
  //     console.error(error)
  //   }
  // }

    const handleDelete = async () => {
      try {
        const result = await showConfirmDialog({
          title: '¿Estás seguro?',
          text: '¡No podrás revertir esta acción!',
          icon: 'warning',
          confirmButtonText: 'Sí, eliminar',
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
        className='btn btn-light btn-active-light-primary btn-sm'
        data-kt-menu-trigger='click'
        data-kt-menu-placement='bottom-end'
      >
        Acciones
        <KTIcon iconName='down' className='fs-5 m-0' />
      </a>
      {/* begin::Menu */}
      <div
        className='menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg-light-primary fw-bold fs-7 w-150px py-4'
        data-kt-menu='true'
      >
        {/* Edit action */}
        <div className='menu-item px-3'>
          <a className='menu-link px-3' onClick={openEditModal}>
            <KTIcon iconName='pencil' className='fs-5 me-2' /> Editar
          </a>
        </div>

        {/* Toggle status action */}
        {/* <div className='menu-item px-3'>
          <a className='menu-link px-3' onClick={handleToggleStatus}>
            <KTIcon 
              iconName={isActive ? 'toggle-off' : 'toggle-on'} 
              className='fs-5 me-2' 
            />
            {isActive ? 'Desactivar' : 'Activar'}
          </a>
        </div> */}

        {/* Delete action */}
        <div className='menu-item px-3'>
          <a className='menu-link px-3' onClick={handleDelete}>
            <KTIcon iconName='trash' className='fs-5 me-2' /> Eliminar
          </a>
        </div>
      </div>
      {/* end::Menu */}
    </>
  )
}

export {ActionsCell}