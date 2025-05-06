import {useState} from 'react'
import {useListView} from '../core/ListViewProvider'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import {KTIcon, KTSVG} from '../../../../../../../_metronic/helpers'

const TipoComisionModal = () => {
  const {setItemIdForUpdate, setIsShow, isShow} = useListView()
  const [selectedOption, setSelectedOption] = useState(null)

  const handleClose = () => {
    setIsShow(false)
    setItemIdForUpdate(undefined)
    setSelectedOption(null)
  }

  const handleOptionClick = (option) => {
    setSelectedOption(option)
    alert(option);
    // Aquí puedes agregar lógica para cargar el formulario correspondiente
  }

  const options = [
    {id: 1, title: 'Transporte', icon: 'truck'},
    {id: 2, title: 'Comision', icon: 'briefcase'},
    // {id: 3, title: 'Declaratoria Comision', icon: 'file'},
    // {id: 4, title: 'Cumpleaños', icon: 'cake'},
    // {id: 5, title: 'Cerrar', icon: 'cross'},
  ]

  return (
    <Modal show={isShow} onHide={handleClose} centered size='lg' backdrop='static' keyboard={false}>
      <Modal.Header>
        <Modal.Title className='fw-bold fs-2 text-center m-auto'>Tipos de Comisiones</Modal.Title>
        <div
          className='btn btn-icon btn-sm btn-active-icon-primary'
          data-kt-users-modal-action='close'
          onClick={handleClose}
          style={{cursor: 'pointer'}}
        >
          <KTIcon iconName='cross' className='fs-1' />
        </div>
      </Modal.Header>

      <Modal.Body className='py-10 px-5 px-xl-15'>
        <div className='row g-10'>
          {options.map((option) => (
            <div className='col-md-6 '>
              <div
                className={`card card-flush h-md-100 cursor-pointer transition-all duration-200 ${
                  selectedOption === option.id
                    ? 'bg-primary'
                    : 'hover:bg-gray-100 hover:bg-opacity-50' // Fondo gris claro al hover (si no está seleccionado)
                } ${
                  selectedOption === option.id
                    ? 'hover:bg-primary-dark' // Oscurece el primary si está seleccionado
                    : ''
                }`}
                onClick={() => (option.id === 5 ? handleClose() : handleOptionClick(option.id))}
              >
                <div className='card-body d-flex flex-column justify-content-between'>
                  <KTIcon
                    iconName={option.icon}
                    className={`fs-6hx mx-auto ${
                      selectedOption === option.id ? 'text-white' : 'text-primary'
                    }`}
                  />
                  <h3 className={`text-center ${selectedOption === option.id ? 'text-white' : ''}`}>
                    {option.title}
                  </h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Modal.Body>

      <Modal.Footer style={{borderTop: 'none'}}>
        <Button variant='light' onClick={handleClose} className='me-3'>
          <KTIcon iconName='cross' className='fs-2' />
          Cancelar
        </Button>
        {selectedOption && (
          <Button variant='primary' onClick={() => console.log('Formulario enviado')}>
            Continuar
            <KTIcon iconName='arrow-right' />
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  )
}

export {TipoComisionModal}
