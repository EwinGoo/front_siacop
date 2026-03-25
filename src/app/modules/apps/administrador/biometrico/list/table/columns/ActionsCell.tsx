import {FC, useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
import {useMutation, useQueryClient} from 'react-query'
import {MenuComponent} from '../../../../../../../../_metronic/assets/ts/components'
import {ID, KTIcon, QUERIES} from '../../../../../../../../_metronic/helpers'
import {useListView} from '../../core/ListViewProvider'
import {useQueryResponse} from '../../core/QueryResponseProvider'
import {deleteDispositivoBiometrico} from '../../core/_requests'
import {showToast} from 'src/app/utils/toastHelper'
import {showConfirmDialog} from 'src/app/utils/swalHelpers.ts'

type Props = {
  id: ID
}

const ActionsCell: FC<Props> = ({id}) => {
  const navigate = useNavigate()
  const {setItemIdForUpdate, setIsShow} = useListView()
  const {query} = useQueryResponse()
  const queryClient = useQueryClient()

  useEffect(() => {
    MenuComponent.reinitialization()
  }, [])

  const openEditModal = () => {
    setItemIdForUpdate(id)
    setIsShow(true)
  }

  const deleteItem = useMutation(() => deleteDispositivoBiometrico(id), {
    onSuccess: () => {
      queryClient.invalidateQueries([`${QUERIES.DISPOSITIVOS_BIOMETRICOS_LIST}-${query}`])
      showToast({message: 'Dispositivo biométrico eliminado correctamente', type: 'success'})
    },
    onError: (error: any) => {
      showToast({
        message: error.response?.data?.message || 'Error al eliminar el dispositivo biométrico',
        type: 'error',
      })
    },
  })

  const handleDelete = async () => {
    const result = await showConfirmDialog({
      title: '¿Estás seguro?',
      text: '¡Esta acción eliminará permanentemente el dispositivo biométrico!',
      icon: 'warning',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    })
    if (result.isConfirmed) {
      await deleteItem.mutateAsync()
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

      <div
        className='menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg-light-primary fw-bold fs-7 w-175px py-4'
        data-kt-menu='true'
      >
        <div className='menu-item px-3'>
          <a className='menu-link px-3' onClick={openEditModal}>
            <i className='las la-edit fs-5 me-2' />
            Editar dispositivo
          </a>
        </div>

        <div className='menu-item px-3'>
          <a
            className='menu-link px-3'
            onClick={() => navigate(`/apps/biometricos/${id}/administrar`)}
          >
            <i className='las la-cog fs-5 me-2' />
            Administrar
          </a>
        </div>

        <div className='menu-item px-3'>
          <a className='menu-link px-3 text-danger' onClick={handleDelete}>
            <i className='las la-trash-alt fs-5 me-2' />
            Eliminar
          </a>
        </div>
      </div>
    </>
  )
}

export {ActionsCell}
