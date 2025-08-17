import { FC } from 'react'
import { KTIcon } from '../../../../../../../_metronic/helpers'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'

type Props = {
  onClose: () => void
  onTipoSeleccionado: (tipo: 'TRANSPORTE' | 'PERSONAL') => void
}

const TipoComisionView: FC<Props> = ({ onClose, onTipoSeleccionado }) => {
  const options = [
    { id: 1, title: 'Transporte', icon: 'truck', tipo: 'TRANSPORTE' },
    { id: 2, title: 'Comisión', icon: 'briefcase', tipo: 'PERSONAL' },
  ]

  return (
    <>
      <Modal.Header>
        <Modal.Title className='fw-bold fs-2 text-center m-auto'>Tipos de Comisiones</Modal.Title>
        <div
          className='btn btn-icon btn-sm btn-active-icon-primary'
          onClick={onClose}
          style={{ cursor: 'pointer' }}
        >
          <KTIcon iconName='cross' className='fs-1' />
        </div>
      </Modal.Header>

      <Modal.Body className='py-10 px-5 px-xl-15'>
        <div className='row g-10'>
          {options.map((option) => (
            <div key={option.id} className='col-md-6'>
              <div
                className='card card-flush h-md-100 cursor-pointer bg-light-hover'
                onClick={() => onTipoSeleccionado(option.tipo as 'TRANSPORTE' | 'PERSONAL')}
              >
                <div className='card-body d-flex flex-column justify-content-between'>
                  <KTIcon
                    iconName={option.icon}
                    className='fs-6hx mx-auto text-primary'
                  />
                  <h3 className='text-center'>{option.title}</h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Modal.Body>

      <Modal.Footer style={{ borderTop: 'none' }}>
        <Button variant='light' onClick={onClose} className='me-3'>
          <KTIcon iconName='cross' className='fs-2' />
          Cancelar
        </Button>
      </Modal.Footer>
    </>
  )
}

export { TipoComisionView }