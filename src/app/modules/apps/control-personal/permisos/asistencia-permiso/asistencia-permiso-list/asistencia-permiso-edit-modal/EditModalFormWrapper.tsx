import {useQuery} from 'react-query'
import {EditModalForm} from './EditModalForm'
import {isNotEmpty, QUERIES} from 'src/_metronic/helpers'
import {useListView} from '../core/ListViewProvider'
import {getAsistenciaPermisoById, getTiposPermiso} from '../core/_requests'
import { Spinner } from 'react-bootstrap'
import { initialAsistenciaPermiso } from '../core/_models'

const EditModalFormWrapper = ({onClose}) => {
  const {itemIdForUpdate, setItemIdForUpdate} = useListView()
  const enabledQuery: boolean = isNotEmpty(itemIdForUpdate)

  const {
    isLoading,
    data: asistenciaPermiso,
    error,
  } = useQuery(
    `${QUERIES.ASISTENCIAS_PERMISO_LIST}-asistencia-permiso-${itemIdForUpdate}`,
    () => {
      return getAsistenciaPermisoById(itemIdForUpdate)
    },
    {
      cacheTime: 0,
      enabled: enabledQuery,
      onError: (err) => {
        setItemIdForUpdate(undefined)
        console.error(err)
      },
      meta: {
        entity: 'asistencia-permiso',
        action: 'getById',
      },
    }
  )

  const {data: tiposPermiso =[]} = useQuery(
    'asistencia-tipos-permiso',
    getTiposPermiso,
    {
      staleTime: 1000 * 60 * 5, // 5 minutos de cache
    }
  )

  if (!itemIdForUpdate) {
    return (
      <EditModalForm
        onClose={onClose}
        isAsistenciaPermisoLoading={isLoading}
        asistenciaPermiso={{...initialAsistenciaPermiso}}
        tiposPermisos={tiposPermiso}
      />
    )
  }

 if (isLoading) {
    return (
      <div className='d-flex flex-column align-items-center justify-content-center py-10 px-5'>
        {/* <Loading />
        <span className='text-muted mt-5'>Cargando datos de la comisión...</span> */}
        <Spinner animation='border' role='status'>
          <span className='visually-hidden'>Cargando...</span>
        </Spinner>
      </div>
    )
  }

  if (error) {
    return <div className='alert alert-danger'>Error al cargar el permiso. Intente nuevamente.</div>
  }

  if (!isLoading && !error && asistenciaPermiso) {
    return (
      <EditModalForm
        onClose={onClose}
        isAsistenciaPermisoLoading={isLoading}
        asistenciaPermiso={asistenciaPermiso}
        tiposPermisos={tiposPermiso}
      />
    )
  }

  return null
}

export {EditModalFormWrapper}
