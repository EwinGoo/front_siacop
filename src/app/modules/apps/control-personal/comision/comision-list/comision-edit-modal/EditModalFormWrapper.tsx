import {useQuery} from 'react-query'
import {EditModalForm} from './EditModalForm'
import {isNotEmpty, QUERIES} from '../../../../../../../_metronic/helpers'
import {useListView} from '../core/ListViewProvider'
import {getComisionById, getTiposPermiso} from '../core/_requests'
import Spinner from 'react-bootstrap/Spinner'
import {toast} from 'react-toastify'
import {initialComision} from '../core/_models'
import {useEffect, useMemo} from 'react'

interface Props {
  onClose: () => void
  initialType: {
    id_tipo_permiso?: string | null
    tipoPermiso?: string | null
  }
  setSelectedType: (type: any) => void
}

const EditModalFormWrapper = ({onClose, initialType, setSelectedType}: Props) => {
  const {itemIdForUpdate, setItemIdForUpdate} = useListView()
  const enabledQuery: boolean = isNotEmpty(itemIdForUpdate)

  // Query para obtener los tipos de permiso
  const {data: tiposPermiso} = useQuery('tipos-permiso', getTiposPermiso, {
    staleTime: 1000 * 60 * 5, // 5 minutos de cache
  })

  // Query para obtener la comisión específica (solo en modo edición)
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

  // Función para obtener el objeto completo del tipo de permiso
  const getTipoPermisoCompleto = (idTipoPermiso: string | null) => {
    if (!tiposPermiso || !idTipoPermiso) return null
    return tiposPermiso.find((tipo: any) => tipo.id_tipo_permiso === idTipoPermiso) || null
  }

  // Efecto para establecer el tipo cuando se carga una comisión existente
  useEffect(() => {
    if (comision?.id_tipo_permiso && tiposPermiso) {
      const tipoCompleto = getTipoPermisoCompleto(comision.id_tipo_permiso.toString())
      if (tipoCompleto) {
        setSelectedType({
          id_tipo_permiso: tipoCompleto.id_tipo_permiso,
          tipoPermiso: tipoCompleto.nombre
        })
      }
    }
  }, [comision, tiposPermiso, setSelectedType])

  // Obtener el tipo de permiso completo para pasar al formulario
  const tipoPermisoCompleto = useMemo(() => {
    if (itemIdForUpdate && comision?.id_tipo_permiso) {
      // Modo edición: usar el tipo de la comisión existente
      return getTipoPermisoCompleto(comision.id_tipo_permiso.toString())
    } else if (initialType?.id_tipo_permiso) {
      // Modo creación: usar el tipo seleccionado
      return getTipoPermisoCompleto(initialType.id_tipo_permiso)
    }
    return null
  }, [itemIdForUpdate, comision, initialType, tiposPermiso])

  // Modo creación (nuevo registro)
  if (!itemIdForUpdate) {
    return (
      <EditModalForm
        onClose={onClose}
        isLoading={false}
        comision={{
          ...initialComision,
          id_comision: undefined,
          tipo_comision: initialType?.tipoPermiso || 'PERSONAL',
          id_tipo_permiso: parseInt(initialType?.id_tipo_permiso!),
        }}
        tipoPermiso={tipoPermisoCompleto}
      />
    )
  }

  // Modo edición - Estados de carga
  if (isLoading) {
    return (
      <div className='d-flex flex-column align-items-center justify-content-center py-10 px-5'>
        <Spinner animation='border' role='status'>
          <span className='visually-hidden'>Cargando...</span>
        </Spinner>
        <span className='text-muted mt-3'>Cargando datos de la comisión...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className='alert alert-danger m-3'>
        <h6 className='fw-bold mb-2'>Error al cargar la comisión</h6>
        <p className='mb-0'>No se pudieron cargar los datos. Intente nuevamente.</p>
      </div>
    )
  }

  // Modo edición - Datos cargados correctamente
  if (!isLoading && !error && comision) {
    return (
      <EditModalForm 
        onClose={onClose} 
        isLoading={isLoading} 
        comision={comision}
        tipoPermiso={tipoPermisoCompleto}
      />
    )
  }

  return null
}

export {EditModalFormWrapper}