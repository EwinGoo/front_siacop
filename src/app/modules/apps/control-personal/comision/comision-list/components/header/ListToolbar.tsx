import {useQueryClient, useMutation} from 'react-query'
import {KTIcon, QUERIES} from '../../../../../../../../_metronic/helpers'
import {useListView} from '../../core/ListViewProvider'
import {ListFilter} from './ListFilter'
import Button from 'react-bootstrap/Button'
import {toast} from 'react-toastify'
import Tooltip from '@mui/material/Tooltip'
import Swal from 'sweetalert2'
import {useQueryResponse} from '../../core/QueryResponseProvider'
import {aprobarComisiones, procesarEstadoComision, verficarAsignacion} from '../../core/_requests'
import {ApiResponse} from '../../core/_models'
import {useQueryRequest} from '../../core/QueryRequestProvider'
import {initialQueryState} from '../../../../../../../../_metronic/helpers'
import {usePermissions} from 'src/app/modules/auth/core/usePermissions'
import {showAlert} from 'src/app/utils/swalHelpers.ts'
import {useAuth} from 'src/app/modules/auth'

const textApproveHTML = `
  Esta acción cambiará el estado de 
  <span class="badge badge-light-info">RECEPCIONADO</span> a 
  <span class="badge badge-light-success">APROBADO</span>
`

const ListToolbar = () => {
  const {setItemIdForUpdate, setIsShow, setAccion} = useListView()
  const queryClient = useQueryClient()
  const {query, refetch} = useQueryResponse()
  const {updateState} = useQueryRequest()
  const {isAdminComision} = usePermissions()
  const {currentUser} = useAuth()

  const openAddModal = async () => {
    if (!currentUser) {
      await showAlert({
        title: 'Error',
        text: 'Debes iniciar sesión para realizar esta acción',
        icon: 'error',
      })
      return
    }

    // 3. Usar optional chaining para propiedades anidadas
    if (currentUser.active_asignacion?.active) {
      setItemIdForUpdate(null)
      setAccion('editar')
      setIsShow(true)
    } else {
      await showAlert({
        title: 'Sin asignación activa',
        text:
          currentUser.active_asignacion?.message || 'No cumples con los requisitos para esta acción',
        icon: 'info',
      })
    }
  }
  const openReportModal = () => {
    setAccion('report')
    setIsShow(true)
  }

  const approveItem = useMutation(() => aprobarComisiones(), {
    onSuccess: (data) => {
      // data es la respuesta del backend: { status, error, message, data }
      queryClient.invalidateQueries([`${QUERIES.COMISIONES_LIST}-${query}`])
      updateState({filter: undefined, ...initialQueryState})

      console.log(data?.message)

      toast.success(data?.message || 'Comisión aprobada correctamente', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      })
    },
    onError: (error) => {
      throw error
      // toast.error('Ocurrió un error al aprobar las comisiones')
    },
  })

  const handleApprove = async () => {
    try {
      const result = await Swal.fire({
        title: '¿Aprobar comisiónes?',
        html: textApproveHTML,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: '<i class="bi bi-check me-2"></i>Sí, aprobar',
        cancelButtonText: '<i class="bi bi-x me-2"></i>Cancelar',
        reverseButtons: true,
        customClass: {
          confirmButton: 'btn btn-primary',
          cancelButton: 'btn btn-danger',
        },
      })

      if (result.isConfirmed) {
        await approveItem.mutateAsync()
      }
    } catch (error) {
      toast.error('Error al aprobar la comisión')
    }
  }

  return (
    <div className='row g-2'>
      {isAdminComision && (
        <>
          <div className='col-12 col-md-auto'>
            <Button className='btn-light-warning w-100' onClick={openReportModal}>
              <i className='bi bi-file-earmark-text me-2'></i>
              Generar Reporte
            </Button>
          </div>

          <div className='col-6 col-md-auto'>
            <Tooltip title='Aprobar todas las comisiones' arrow placement='top'>
              <Button className='btn-light-success w-100' onClick={handleApprove}>
                <KTIcon iconName='check' className='fs-2 me-1' />
                Aprobar
              </Button>
            </Tooltip>
          </div>
        </>
      )}

      <div className='col-6 col-md-auto text-end'>
        <ListFilter />
      </div>

      <div className='col-12 col-md-auto'>
        <Button variant='primary' className='w-100' onClick={openAddModal}>
          <KTIcon iconName='plus' className='fs-2' />
          Agregar Comisión
        </Button>
      </div>
    </div>
  )
}

export {ListToolbar}
