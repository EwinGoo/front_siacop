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
import {useQueryRequest} from '../../core/QueryRequestProvider'
import {initialQueryState} from '../../../../../../../../_metronic/helpers'
import {showAlert} from 'src/app/utils/swalHelpers.ts'
import {useAuth} from 'src/app/modules/auth/core/Auth'
import { canManageComisiones } from 'src/app/modules/auth/core/roles/roleDefinitions'
import { APP_ROLES } from 'src/app/modules/auth/core/roles'

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
  const {currentUser} = useAuth()

  // ✅ Lógica corregida para verificar permisos de gestión
  const canManage = currentUser?.groups 
    ? canManageComisiones(currentUser.groups) 
    : false

  // ✅ Verificar si es docente administrativo (para bloquear completamente)
  const isDocenteAdministrativo = 
    currentUser?.personal?.tipo_personal === 'DOCENTE' && 
    currentUser?.groups?.includes(APP_ROLES.ADMINISTRATIVO)


  // ✅ Si es docente administrativo, no mostrar nada (ya debería estar bloqueado en la ruta)
  // if (isDocenteAdministrativo) {
  //   return null
  // }

  const openAddModal = async () => {
    if (!currentUser) {
      await showAlert({
        title: 'Error',
        text: 'Debes iniciar sesión para realizar esta acción',
        icon: 'error',
      })
      return
    }

    // Verificar asignación activa para crear comisiones
    if (currentUser.active_asignacion?.active) {
      setItemIdForUpdate(null)
      setAccion('editar')
      setIsShow(true)
    } else {
      await showAlert({
        title: 'Sin asignación activa',
        text:
          currentUser.active_asignacion?.message ||
          'No cumples con los requisitos para esta acción',
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
      {/* ✅ Solo mostrar botones de gestión para administradores y control_personal */}
      {canManage && (
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
      
      {/* ✅ Botón crear - disponible para todos (excepto docentes administrativos) */}
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