import { useQuery } from 'react-query'
import { EditModalForm } from './EditModalForm'
import { isNotEmpty, QUERIES } from '../../../../../../../../_metronic/helpers'
import { useListView } from '../core/ListViewProvider'
import { getAsistenciaPermisoById } from '../core/_requests'

const EditModalFormWrapper = ({ onClose }) => {
  const { itemIdForUpdate, setItemIdForUpdate } = useListView()
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

  if (!itemIdForUpdate) {
    return (
      <EditModalForm 
        onClose={onClose} 
        isAsistenciaPermisoLoading={isLoading} 
        asistenciaPermiso={{ id_asistencia_permiso: undefined }} 
      />
    )
  }

  if (isLoading) {
    return <div className='text-center p-10'>Cargando permiso...</div>
  }

  if (error) {
    return (
      <div className='alert alert-danger'>
        Error al cargar el permiso. Intente nuevamente.
      </div>
    )
  }

  if (!isLoading && !error && asistenciaPermiso) {
    return (
      <EditModalForm 
        onClose={onClose} 
        isAsistenciaPermisoLoading={isLoading} 
        asistenciaPermiso={asistenciaPermiso} 
      />
    )
  }

  return null
}

export { EditModalFormWrapper }