import {useQuery} from 'react-query'
import {EditModalForm} from './EditModalForm'
import {isNotEmpty, QUERIES} from '../../../../../../../_metronic/helpers'
import {useListView} from '../core/ListViewProvider'
import {getFeriadoAsuetoById} from '../core/_requests'
import {Spinner} from 'react-bootstrap'

const EditModalFormWrapper = ({onClose}) => {
  const {itemIdForUpdate, setItemIdForUpdate} = useListView()
  const enabledQuery: boolean = isNotEmpty(itemIdForUpdate)

  const {
    isLoading,
    data: feriadoAsueto,
    error,
  } = useQuery(
    `${QUERIES.FERIADOS_ASUETOS_LIST}-feriado-asueto-${itemIdForUpdate}`,
    () => {
      return getFeriadoAsuetoById(itemIdForUpdate)
    },
    {
      cacheTime: 0,
      enabled: enabledQuery,
      onError: (err) => {
        setItemIdForUpdate(undefined)
        console.error(err)
      },
      meta: {
        entity: 'feriado-asueto',
        action: 'getById',
      },
    }
  )

  if (!itemIdForUpdate) {
    return (
      <EditModalForm
        onClose={onClose}
        isFeriadoAsuetoLoading={isLoading}
        feriadoAsueto={{id_asistencia_feriado_asueto: undefined}}
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
    return (
      <div className='alert alert-danger'>
        Error al cargar el feriado/asueto. Intente nuevamente.
      </div>
    )
  }

  if (!isLoading && !error && feriadoAsueto) {
    return (
      <EditModalForm
        onClose={onClose}
        isFeriadoAsuetoLoading={isLoading}
        feriadoAsueto={feriadoAsueto}
      />
    )
  }

  return null
}

export {EditModalFormWrapper}
