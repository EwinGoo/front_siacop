/* eslint-disable jsx-a11y/anchor-is-valid */
import {FC, useEffect} from 'react'
import {useMutation, useQueryClient} from 'react-query'
import {MenuComponent} from '../../../../../../../../_metronic/assets/ts/components'
import {ID, KTIcon, QUERIES} from '../../../../../../../../_metronic/helpers'
import {useListView} from '../../core/ListViewProvider'
import {useQueryResponse} from '../../core/QueryResponseProvider'
import {deleteComision, aprobarComision} from '../../core/_requests'
import {toast} from 'react-toastify'
import Swal from 'sweetalert2'

const COMISION_URL = process.env.REACT_APP_THEME_API_URL + '/boletas-comision'

type Props = {
  id: ID
  estado?: 'PENDIENTE' | 'APROBADO' // Add estado prop for comision-specific actions
}

const ActionsCell: FC<Props> = ({id, estado}) => {
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

  const approveItem = useMutation(() => aprobarComision(id), {
    onSuccess: () => {
      queryClient.invalidateQueries([`${QUERIES.COMISIONES_LIST}-${query}`])
      toast.success('Comisión aprobada correctamente', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      })
    },
  })

  const deleteItem = useMutation(() => deleteComision(id), {
    onSuccess: () => {
      queryClient.invalidateQueries([`${QUERIES.COMISIONES_LIST}-${query}`])
      toast.success('Comisión eliminada correctamente', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      })
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Error al eliminar la comisión', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      })
    },
  })

  const handleDelete = async () => {
    try {
      const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: '¡No podrás revertir esta acción!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
        customClass: {
          confirmButton: 'btn btn-primary',
          cancelButton: 'btn btn-danger',
        },
      })

      if (result.isConfirmed) {
        await deleteItem.mutateAsync()
      }
    } catch (error) {
      // Error is already handled in onError
    }
  }

  const handleApprove = async () => {
    try {
      const result = await Swal.fire({
        title: '¿Aprobar comisión?',
        text: 'Esta acción cambiará el estado a APROBADO',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, aprobar',
        cancelButtonText: 'Cancelar',
      })

      if (result.isConfirmed) {
        await approveItem.mutateAsync()
      }
    } catch (error) {
      toast.error('Error al aprobar la comisión')
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
        {/* Imprimir action */}
        <div className='menu-item px-3'>
          <a href={COMISION_URL + '/reporte/' + id} className='menu-link px-3'>
            <i className='las la-print fs-5 me-2'></i> Imprimir
          </a>
        </div>

        {/* Edit action */}
        <div className='menu-item px-3'>
          <a className='menu-link px-3' onClick={openEditModal}>
            <i className='las la-edit fs-5 me-2'></i> Editar
          </a>
        </div>

        {/* Approve action (only shown for PENDIENTE) */}
        {estado === 'PENDIENTE' && (
          <div className='menu-item px-3'>
            <a className='menu-link px-3' onClick={handleApprove}>
              <i className='las la-check-circle fs-5 me-2'></i> Aprobar
            </a>
          </div>
        )}

        {/* Delete action */}
        <div className='menu-item px-3'>
          <a className='menu-link px-3' onClick={handleDelete}>
            <i className='las la-trash-alt fs-5 me-2'></i> Eliminar
          </a>
        </div>
      </div>
      {/* end::Menu */}
    </>
  )
}

export {ActionsCell}
