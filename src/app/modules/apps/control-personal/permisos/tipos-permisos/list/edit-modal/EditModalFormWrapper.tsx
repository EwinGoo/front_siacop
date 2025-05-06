import { useQuery } from 'react-query'
import { EditModalForm } from './EditModalForm'
import { isNotEmpty, QUERIES } from '../../../../../../../../_metronic/helpers'
import { useListView } from '../core/ListViewProvider'
import { getTipoPermisoById } from '../core/_requests'

const EditModalFormWrapper = ({ onClose }) => {
  const { itemIdForUpdate, setItemIdForUpdate } = useListView()
  const enabledQuery: boolean = isNotEmpty(itemIdForUpdate)
  
  const {
    isLoading,
    data: tipoPermiso,
    error,
  } = useQuery(
    `${QUERIES.TIPOS_PERMISOS_LIST}-tipo-permiso-${itemIdForUpdate}`,
    () => {
      return getTipoPermisoById(itemIdForUpdate)
    },
    {
      cacheTime: 0,
      enabled: enabledQuery,
      onError: (err) => {
        setItemIdForUpdate(undefined)
        console.error(err)
      },
      meta: {
        entity: 'tipo-permiso',
        action: 'getById',
      },
    }
  )

  if (!itemIdForUpdate) {
    return (
      <EditModalForm 
        onClose={onClose} 
        isLoading={isLoading} 
        tipoPermiso={{ id_tipo_permiso: undefined }} 
      />
    )
  }

  if (isLoading) {
    return <div className='text-center p-10'>Cargando tipo de permiso...</div>
  }

  if (error) {
    return (
      <div className='alert alert-danger'>
        Error al cargar el tipo de permiso. Intente nuevamente.
      </div>
    )
  }

  if (!isLoading && !error && tipoPermiso) {
    return (
      <EditModalForm 
        onClose={onClose} 
        isLoading={isLoading} 
        tipoPermiso={tipoPermiso} 
      />
    )
  }

  return null
}

export { EditModalFormWrapper }