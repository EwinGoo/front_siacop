import {useQuery} from 'react-query'
import {EditModalForm} from './EditModalForm'
import {isNotEmpty, QUERIES} from '../../../../../../../_metronic/helpers'
import {useListView} from '../core/ListViewProvider'
import {getComisionById} from '../core/_requests'
import Spinner from 'react-bootstrap/Spinner'
import {toast} from 'react-toastify'
import {initialComision} from '../core/_models'
import { useEffect } from 'react'

const EditModalFormWrapper = ({onClose, initialType, setSelectedType}) => {
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
      retry: 1,
      onError: (err) => {
        setItemIdForUpdate(undefined)
        onClose()
        console.error(err)

        // Mostrar toast de error
        toast.error('Error al cargar la comisión. Intente nuevamente.', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        })
      },
      // Optional: Add metadata for the query
      meta: {
        entity: 'comision',
        action: 'getById',
      },
    }
  )
  
  useEffect(() => {
    if (comision?.tipo_comision) {
      setSelectedType(comision.tipo_comision)
    }
  }, [comision, setSelectedType])

  if (!itemIdForUpdate) {
    return (
      <EditModalForm
        onClose={onClose}
        isLoading={isLoading}
        comision={{
          ...initialComision,
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
          <span className='visually-hidden'>Cargando...</span>
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
    return <EditModalForm onClose={onClose} isLoading={isLoading} comision={comision} />
  }

  return null
}

export {EditModalFormWrapper}
