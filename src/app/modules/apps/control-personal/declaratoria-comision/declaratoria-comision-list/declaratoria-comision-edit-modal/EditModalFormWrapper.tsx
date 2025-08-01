import {useQuery} from 'react-query'
import {EditModalForm} from './EditModalForm'
import {isNotEmpty, QUERIES} from '../../../../../../../_metronic/helpers'
import {useListView} from '../core/ListViewProvider'
import {getDeclaratoriaComisionById} from '../core/_requests'
import Spinner from 'react-bootstrap/Spinner'
import {initialDeclaratoriaComision} from '../core/_models'
import {parseTipoViaticoFromApi, parseTipoViaticoToApi} from '../helpers/viatico'

const EditModalFormWrapper = ({onClose}) => {
  const {itemIdForUpdate, setItemIdForUpdate} = useListView()
  const enabledQuery: boolean = isNotEmpty(itemIdForUpdate)

  const {
    isLoading,
    data: comision,
    error,
  } = useQuery(
    `${QUERIES.COMISIONES_LIST}-comision-${itemIdForUpdate}`,
    () => {
      return getDeclaratoriaComisionById(itemIdForUpdate)
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
        isDeclaratoriaLoading={isLoading}
        declaratoria={{
          ...initialDeclaratoriaComision,
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
    return (
      <EditModalForm
        onClose={onClose}
        isDeclaratoriaLoading={isLoading}
        declaratoria={{
          ...comision,
          tipo_viatico: parseTipoViaticoFromApi(comision.tipo_viatico as string),
        }}
      />
    )
  }

  return null
}

export {EditModalFormWrapper}
