import {useQuery} from 'react-query'
import {EditModalForm} from './EditModalForm'
import {isNotEmpty, QUERIES} from '../../../../../../../_metronic/helpers'
import {useListView} from '../core/ListViewProvider'
import {getComisionById} from '../core/_requests'
import Spinner from 'react-bootstrap/Spinner'

const EditModalFormWrapper = ({onClose, initialType}) => {
  const {itemIdForUpdate, setItemIdForUpdate} = useListView()
  const enabledQuery: boolean = isNotEmpty(itemIdForUpdate)

  const {
    isLoading,
    data: comision,
    error,
  } = useQuery(
    `${QUERIES.COMISIONES_LIST}-comision-${itemIdForUpdate}`,
    () => {
      return getComisionById(itemIdForUpdate)
    },
    {
      cacheTime: 0,
      enabled: enabledQuery,
      onError: (err) => {
        setItemIdForUpdate(undefined)
        console.error(err)
      },
      // Optional: Add metadata for the query
      meta: {
        entity: 'comision',
        action: 'getById',
      },
    }
  )

  if (!itemIdForUpdate) {
    return (
      <EditModalForm
        onClose={onClose}
        isComisionLoading={isLoading}
        comision={{
          id_comision: undefined,
          tipo_comision: initialType, // Pasar el tipo seleccionado
        }}
      />
    )
  }

  if (isLoading) {
    return (
      <div className='d-flex flex-column align-items-center justify-content-center py-10 px-5'>
        {/* <Loading />
        <span className='text-muted mt-5'>Cargando datos de la comisión...</span> */}
        <Spinner animation='border' role='status'>
          <span className='visually-hidden'>Loading...</span>
        </Spinner>
      </div>
    )
  }

  if (error) {
    return (
      <div className='alert alert-danger'>Error al cargar la comisión. Intente nuevamente.</div>
    )
  }

  if (!isLoading && !error && comision) {
    return <EditModalForm onClose={onClose} isComisionLoading={isLoading} comision={comision} />
  }

  return null
}

export {EditModalFormWrapper}
