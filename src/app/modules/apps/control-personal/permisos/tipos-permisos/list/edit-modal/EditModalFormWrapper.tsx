import {useQuery} from 'react-query'
import {EditModalForm} from './EditModalForm'
import {isNotEmpty, QUERIES} from '../../../../../../../../_metronic/helpers'
import {useListView} from '../core/ListViewProvider'
import {getTipoPermisoById} from '../core/_requests'
import {initialTipoPermiso} from '../core/_models'
import {Spinner} from 'react-bootstrap'

const EditModalFormWrapper = ({onClose}) => {
  const {itemIdForUpdate, setItemIdForUpdate} = useListView()
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
        tipoPermiso={{...initialTipoPermiso}}
      />
    )
  }
  
  if (isLoading) {
    return (
      <div className='d-flex flex-column align-items-center justify-content-center py-10 px-5'>
        <Spinner animation='border' role='status'>
          <span className='visually-hidden'>Cargando...</span>
        </Spinner>
      </div>
    )
  }

  if (error) {
    return (
      <div className='alert alert-danger'>
        Error al cargar el tipo de permiso. Intente nuevamente.
      </div>
    )
  }

  if (!isLoading && !error && tipoPermiso) {
    return <EditModalForm onClose={onClose} isLoading={isLoading} tipoPermiso={tipoPermiso} />
  }

  return null
}

export {EditModalFormWrapper}
