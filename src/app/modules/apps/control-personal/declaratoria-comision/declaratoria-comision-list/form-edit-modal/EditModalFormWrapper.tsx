import {useQuery} from 'react-query'
import {EditModalForm} from './EditModalForm'
import {isNotEmpty, QUERIES} from '../../../../../../../_metronic/helpers'
import {useListView} from '../core/ListViewProvider'
import {getDeclaratoriaComisionById, getUnidades} from '../core/_requests'
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
    `${QUERIES.DECLARATORIA_COMISION_LIST}-declaratoria-comision-${itemIdForUpdate}`,
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
      meta: {
        entity: 'comision',
        action: 'getById',
      },
    }
  )

  const {data: unidades =[]} = useQuery(
    'tipos-permiso',
    getUnidades,
    {
      staleTime: 1000 * 60 * 5, // 5 minutos de cache
    }
  )

  if (!itemIdForUpdate) {
    return (
      <EditModalForm
        onClose={onClose}
        isDeclaratoriaLoading={isLoading}
        unidades={unidades}
        declaratoria={{
          ...initialDeclaratoriaComision,
        }}
      />
    )
  }

  if (isLoading) {
    return (
      <div className='d-flex flex-column align-items-center justify-content-center py-10 px-5'>
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
        unidades={unidades}
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
