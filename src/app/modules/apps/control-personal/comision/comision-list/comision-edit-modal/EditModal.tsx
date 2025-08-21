import {useEffect, useState} from 'react'
import {useQuery} from 'react-query'
import {EditModalHeader} from './EditModalHeader'
import {EditModalFormWrapper} from './EditModalFormWrapper'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import {useListView} from '../core/ListViewProvider'
import {KTIcon} from '../../../../../../../_metronic/helpers'
import {getTiposPermiso} from '../core/_requests'

// Mapeo de iconos por nombre de tipo de permiso
const iconMapping: Record<string, string> = {
  PERSONAL: 'briefcase',
  TRANSPORTE: 'truck',
  'CAJA SALUD': 'hospital', // FontAwesome icon para hospitales
  FISIOTERAPIA: 'hand-holding-medical',
  // Agregar más tipos según sea necesario
  CAPACITACION: 'graduation-cap',
  REUNION: 'users',
  TRAMITE: 'file-text',
  OTROS: 'gear',
}

const EditModal = () => {
  const {accion, setItemIdForUpdate, setIsShow, isShow, itemIdForUpdate} = useListView()
  const [selectedType, setSelectedType] = useState<{
    id_tipo_permiso?: string | null
    tipoPermiso?: string | null
  }>({
    id_tipo_permiso: null,
    tipoPermiso: null,
  })
  const [showForm, setShowForm] = useState(false)

  const {data: tiposPermiso, isLoading} = useQuery('comision-tipos-permiso', getTiposPermiso, {
    staleTime: 1000 * 60 * 5, // 5 minutos de cache
  })

  // Extraer el array de tipos de permiso de la respuesta
  // const tiposPermiso = tiposPermisoResponse?.data || []

  // Resetear estado cuando se cierra el modal
  const handleClose = () => {
    setIsShow(false)
    setItemIdForUpdate(undefined)
    setSelectedType({id_tipo_permiso: null, tipoPermiso: null})
    setShowForm(false)
  }

  // Si estamos editando, mostrar directamente el formulario
  useEffect(() => {
    if (itemIdForUpdate) {
      setShowForm(true)
    }
  }, [itemIdForUpdate])

  if (!(isShow && accion === 'editar')) {
    return null
  }

  const handleTypeSelect = (tipoPermiso: any) => {
    setSelectedType({
      id_tipo_permiso: tipoPermiso.id_tipo_permiso,
      tipoPermiso: tipoPermiso.nombre,
    })
    setShowForm(true)
  }

  const handleBackToSelection = () => {
    setShowForm(false)
    setSelectedType({})
  }

  const getIconForTipo = (nombreTipo: string): string => {
    return iconMapping[nombreTipo.toUpperCase()] || 'gear' // 'gear' como icono por defecto
  }

  const titleModal = () => {
    const selectedTipo =
      tiposPermiso && tiposPermiso.find((tipo: any) => tipo.id_tipo_permiso === selectedType.id_tipo_permiso)

    if (!selectedTipo) return ''

    const isComision = selectedTipo.tipo_permiso === 'COMISION'
    const prefix = itemIdForUpdate ? 'EDITAR ' : ''

    if (selectedTipo.nombre === 'PERSONAL' || selectedTipo.nombre === 'TRANSPORTE') {
      return `${prefix}BOLETA DE COMISIÓN ${selectedTipo.nombre}`
    }

    if (selectedTipo.nombre === 'CAJA SALUD' || selectedTipo.nombre === 'FISIOTERAPIA') {
      return `${prefix}PERMISO ${selectedTipo.nombre}`
    }

    // Para otros tipos, usar el tipo_permiso del backend
    return `${prefix}${isComision ? 'COMISIÓN' : 'PERMISO'} ${selectedTipo.nombre}`
  }

  if (isLoading) {
    return (
      <Modal
        show={isShow}
        onHide={handleClose}
        centered
        size='lg'
        backdrop='static'
        keyboard={false}
      >
        <Modal.Body className='text-center py-10'>
          <div className='spinner-border text-primary' role='status'>
            <span className='visually-hidden'>Cargando...</span>
          </div>
          <p className='mt-3'>Cargando tipos de permiso...</p>
        </Modal.Body>
      </Modal>
    )
  }

  return (
    <Modal show={isShow} onHide={handleClose} centered size='lg' backdrop='static' keyboard={false}>
      <Modal.Header>
        {showForm ? (
          <>
            <Modal.Title className='fw-black fs-2'>{titleModal()}</Modal.Title>
            <div
              className='btn btn-icon btn-sm btn-active-icon-primary'
              onClick={handleClose}
              style={{cursor: 'pointer'}}
            >
              <KTIcon iconName='cross' className='fs-1' />
            </div>
          </>
        ) : (
          <>
            <Modal.Title className='fw-bold fs-2 text-center m-auto'>
              Tipos de Comisiones y Permisos
            </Modal.Title>
            <div
              className='btn btn-icon btn-sm btn-active-icon-primary'
              onClick={handleClose}
              style={{cursor: 'pointer'}}
            >
              <KTIcon iconName='cross' className='fs-1' />
            </div>
          </>
        )}
      </Modal.Header>

      <Modal.Body className={`py-0 px-5 px-xl-15 ${!showForm ? 'py-10' : ''}`}>
        {!showForm ? (
          // Vista de selección de tipo
          <div className='row g-8 justify-content-center'>
            {tiposPermiso &&
              tiposPermiso.map((tipoPermiso: any) => {
                const iconName = getIconForTipo(tipoPermiso.nombre)
                const hasKTIcon = [
                  'briefcase',
                  'truck',
                  'graduation-cap',
                  'users',
                  'file-text',
                  'gear',
                ].includes(iconName)

                return (
                  <div key={tipoPermiso.id_tipo_permiso} className='col-md-6 col-lg-6'>
                    <div
                      className='card card-flush h-md-100 cursor-pointer transition-all duration-200 hover:bg-gray-100 hover:bg-opacity-50 border-hover-primary'
                      onClick={() => handleTypeSelect(tipoPermiso)}
                    >
                      <div className='card-body d-flex flex-column justify-content-center align-items-center text-center p-6'>
                        {hasKTIcon ? (
                          <KTIcon
                            iconName={iconName}
                            className='fs-6hx mx-auto text-primary hover-rotate mb-4'
                          />
                        ) : (
                          <i
                            className={`fas fa-${
                              iconName === 'hospital'
                                ? 'hospital'
                                : iconName === 'hand-holding-medical'
                                ? 'hand-holding-medical'
                                : iconName
                            } fs-4hx mx-auto text-primary mb-4 hover-rotate`}
                          ></i>
                        )}
                        <h4 className='fw-black mb-2'>{tipoPermiso.nombre}</h4>
                        {/* {tipoPermiso.descripcion && (
                          <p className='text-muted fs-7 mb-0'>{tipoPermiso.descripcion}</p>
                        )}
                        <div className='mt-2'>
                          <span
                            className={`badge ${
                              tipoPermiso.tipo_permiso === 'COMISION'
                                ? 'badge-light-primary'
                                : 'badge-light-success'
                            } fs-8`}
                          >
                            {tipoPermiso.tipo_permiso}
                          </span>
                          {tipoPermiso.requiere_hoja_ruta === '1' && (
                            <span className='badge badge-light-warning fs-8 ms-1'>
                              Requiere H.R.
                            </span>
                          )}
                        </div> */}
                      </div>
                    </div>
                  </div>
                )
              })}
          </div>
        ) : (
          // Vista del formulario
          <>
            <EditModalFormWrapper
              onClose={handleClose}
              initialType={selectedType}
              setSelectedType={setSelectedType}
            />
          </>
        )}
      </Modal.Body>

      {!showForm && (
        <Modal.Footer style={{borderTop: 'none'}}>
          <Button className='btn-sm' variant='light' onClick={handleClose}>
            <KTIcon iconName='cross' className='fs-2' />
            Cancelar
          </Button>
        </Modal.Footer>
      )}
    </Modal>
  )
}

export {EditModal}
