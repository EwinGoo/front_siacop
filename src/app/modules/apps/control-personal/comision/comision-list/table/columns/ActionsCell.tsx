/* eslint-disable jsx-a11y/anchor-is-valid */
import {FC, useEffect} from 'react'
import {useMutation, useQueryClient} from 'react-query'
import {MenuComponent} from 'src/_metronic/assets/ts/components'
import {ID, KTIcon, QUERIES} from 'src/_metronic/helpers'
import {useListView} from '../../core/ListViewProvider'
import {useQueryResponse} from '../../core/QueryResponseProvider'
import {COMISION_URL, deleteComision, procesarEstadoComision} from '../../core/_requests'
import {toast} from 'react-toastify'
import {usePermissions} from 'src/app/modules/auth/core/usePermissions'
import {showToast} from 'src/app/utils/toastHelper'
import {showConfirmDialog} from 'src/app/utils/swalHelpers.ts'
import {getPermisosComision} from 'src/app/modules/auth/core/permissions'
import {API_ROUTES} from 'src/app/config/apiRoutes'

type Props = {
  id: ID
  estado?: 'GENERADO' | 'ENVIADO' | 'RECEPCIONADO' | 'APROBADO' | 'OBSERVADO' // Add estado prop for comision-specific actions
  hash?: string
}

const ActionsCell: FC<Props> = ({id, estado, hash}) => {
  const {setAccion, setItemIdForUpdate, setIsShow} = useListView()
  const {canManageComisiones} = usePermissions()
  const {query} = useQueryResponse()
  const queryClient = useQueryClient()

  const permisos = getPermisosComision({
    estado: estado || 'GENERADO',
    puedeGestionar: canManageComisiones,
  })
  // console.log(currentUser?.groups)

  useEffect(() => {
    MenuComponent.reinitialization()
  }, [])

  const openEditModal = async () => {
    setItemIdForUpdate(id)
    setAccion('editar')
    setIsShow(true)
  }

  const openObsertacionModal = async () => {
    setItemIdForUpdate(id)
    setAccion('observar')
    setIsShow(true)
  }

  const receiveItem = useMutation(() => procesarEstadoComision({code: id, action: 'receive'}), {
    onSuccess: () => {
      queryClient.invalidateQueries([`${QUERIES.COMISIONES_LIST}-${query}`])
      showToast({
        message: 'Comisión recepcionada correctamente',
        type: 'success',
      })
    },
  })

  const approveItem = useMutation(() => procesarEstadoComision({code: id, action: 'approve'}), {
    onSuccess: () => {
      queryClient.invalidateQueries([`${QUERIES.COMISIONES_LIST}-${query}`])
      showToast({
        message: 'Comisión aprobada correctamente',
        type: 'success',
      })
    },
  })

  const deleteItem = useMutation(() => deleteComision(id), {
    onSuccess: () => {
      queryClient.invalidateQueries([`${QUERIES.COMISIONES_LIST}-${query}`])
      showToast({
        message: 'Comisión eliminada correctamente',
        type: 'success',
      })
    },
    onError: (error: any) => {
      showToast({
        message: error.response?.data?.message || 'Error al eliminar la comisión',
        type: 'error',
      })
    },
  })

  const sendItem = useMutation(() => procesarEstadoComision({code: id, action: 'send'}), {
    onSuccess: () => {
      queryClient.invalidateQueries([`${QUERIES.COMISIONES_LIST}-${query}`])
      showToast({message: 'Comisión enviada correctamente', type: 'success'})
    },
    onError: () => {
      showToast({message: 'Error al enviar la comisión', type: 'error'})
    },
  })
  const handlePrintConfirm = async () => {
    try {
      if (estado !== 'GENERADO') {
        window.open(API_ROUTES.REPORTES.COMISION.FORMULARIO(hash!), '_blank')
        return
      }

      // Si está en GENERADO, mostrar confirmación
      const result = await showConfirmDialog({
        title: '¿Está seguro?',
        html: '<div>Una vez que imprima, la comisión <strong>no podrá ser modificada</strong> y se marcará como </div><span class="badge badge-light-warning fs-5 mt-3">ENVIADO</span>',
        icon: 'warning',
        confirmButtonText: 'Sí, imprimir',
      })

      if (result.isConfirmed) {
        await sendItem.mutateAsync()
        window.open(API_ROUTES.REPORTES.COMISION.FORMULARIO(hash!), '_blank')
      }
    } catch (error) {
      showToast({message: 'Error al procesar la impresión', type: 'error'})
    }
  }

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

  const handleApprove = async () => {
    try {
      const result = await showConfirmDialog({
        title: '¿Aprobar comisión?',
        html: 'Esta acción cambiará el estado a <span class="badge badge-light-success">APROBADO</span>',
        icon: 'question',
        confirmButtonText: 'Sí, aprobar',
      })

      if (result.isConfirmed) {
        await approveItem.mutateAsync()
      }
    } catch (error) {}
  }
  const handleReceive = async () => {
    try {
      const result = await showConfirmDialog({
        title: '¿Recepcionar comisión?',
        html: 'Esta acción cambiará el estado a <span class="badge badge-light-info">RECEPCIONADO</span>',
        icon: 'question',
        confirmButtonText: 'Sí, continuar',
      })

      if (result.isConfirmed) {
        await receiveItem.mutateAsync()
      }
    } catch (error) {
      toast.error('Error al recepcionar la comisión')
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
          <a href='#' className='menu-link px-3' onClick={handlePrintConfirm}>
            <i className='las la-print fs-5 me-2'></i> Imprimir
          </a>
        </div>

        {/* Edit action */}
        {permisos.puedeEditar && (
          <div className='menu-item px-3'>
            <a href='#' className='menu-link px-3' onClick={openEditModal}>
              <i className='las la-edit fs-5 me-2'></i> Editar
            </a>
          </div>
        )}
        {/* estado_boleta_comision: 'GENERADO' | 'ENVIADO' | 'RECEPCIONADO' | 'APROBADO' | 'OBSERVADO' */}

        {/* Approve action (only shown for PENDIENTE) */}
        {permisos.puedeAprobar && (
          <div className='menu-item px-3'>
            <a href='#' className='menu-link px-3' onClick={handleApprove}>
              <i className='las la-check-circle fs-5 me-2'></i> Aprobar
            </a>
          </div>
        )}

        {permisos.puedeRecepcionar && (
          <div className='menu-item px-3'>
            <a href='#' className='menu-link px-3' onClick={handleReceive}>
              <i className='las la-check-circle fs-5 me-2'></i> Recepcionar
            </a>
          </div>
        )}

        {/* Accion observar */}
        {permisos.puedeObservar && (
          <div className='menu-item px-3'>
            <a href='#' className='menu-link px-3' onClick={openObsertacionModal}>
              <i className='las la-info-circle fs-5 me-2'></i> Observar
            </a>
          </div>
        )}

        {/* Delete action */}
        {permisos.puedeEliminar && (
          <div className='menu-item px-3'>
            <a href='#' className='menu-link px-3' onClick={handleDelete}>
              <i className='las la-trash-alt fs-5 me-2'></i> Eliminar
            </a>
          </div>
        )}
      </div>
      {/* end::Menu */}
    </>
  )
}

export {ActionsCell}
