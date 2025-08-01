import {useEffect, useState} from 'react'
import {EditModalHeader} from './EditModalHeader'
import {EditModalFormWrapper} from './EditModalFormWrapper'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import {useListView} from '../core/ListViewProvider'
import {KTIcon} from '../../../../../../../_metronic/helpers'

const EditModal = () => {
  const {accion, setItemIdForUpdate, setIsShow, isShow, itemIdForUpdate} = useListView()
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)

  // Resetear estado cuando se cierra el modal
  const handleClose = () => {
    setIsShow(false)
    setItemIdForUpdate(undefined)
    setSelectedType(null)
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

  const handleTypeSelect = (type: string) => {
    setSelectedType(type)
    setShowForm(true)
  }

  const handleBackToSelection = () => {
    setShowForm(false)
    setSelectedType(null)
  }

  const options = [
    {id: 'COMISION', title: 'PERSONAL', icon: 'briefcase'},
    {id: 'TRANSPORTE', title: 'AUTO TRANSPORTE', icon: 'truck'},
  ]

  return (
    <Modal show={isShow} onHide={handleClose} centered size='lg' backdrop='static' keyboard={false}>
      <Modal.Header>
        {showForm ? (
          <>
            <Modal.Title className='fw-black fs-2'>
              BOLETA DE COMISIÓN
              {selectedType && ` ${selectedType === 'COMISION' ? 'PERSONAL' : 'AUTO-TRANSPORTE'}`}
            </Modal.Title>
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
              Tipos de Comisiones
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
          <div className='row g-10'>
            {options.map((option) => (
              <div key={option.id} className='col-md-6'>
                <div
                  className='card card-flush h-md-100 cursor-pointer transition-all duration-200 hover:bg-gray-100 hover:bg-opacity-50'
                  onClick={() => handleTypeSelect(option.id)}
                >
                  <div className='card-body d-flex flex-column justify-content-between'>
                    <KTIcon
                      iconName={option.icon}
                      className='fs-6hx mx-auto text-primary hover-rotate'
                    />
                    <h4 className='text-center fw-black'>{option.title}</h4>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Vista del formulario
          <>
            {/* {!itemIdForUpdate && (
              <div className='d-flex justify-content-start mb-5'>
                <button 
                  onClick={handleBackToSelection}
                  className='btn btn-light-primary btn-sm'
                >
                  <KTIcon iconName='arrow-left' className='fs-2 me-2' />
                  Cambiar tipo de comisión
                </button>
              </div>
            )} */}
            <EditModalFormWrapper onClose={handleClose} initialType={selectedType} />
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
