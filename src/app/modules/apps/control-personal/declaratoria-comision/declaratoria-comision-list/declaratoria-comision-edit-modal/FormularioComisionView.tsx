import { FC } from 'react'
import { EditModalFormWrapper } from './EditModalFormWrapper'
import Button from 'react-bootstrap/Button'
import { KTIcon } from '../../../../../../../_metronic/helpers'
import Modal from 'react-bootstrap/Modal'

type Props = {
  onClose: () => void
  onVolver: () => void
  tipoComision?: 'TRANSPORTE' | 'PERSONAL'
  esNuevo: boolean
}

const FormularioComisionView: FC<Props> = ({ onClose, onVolver, tipoComision, esNuevo }) => {
  return (
    <>
      <Modal.Header>
        <Modal.Title className='fw-bold fs-2'>
          {esNuevo ? 'Agregar' : 'Editar'} Comisión
        </Modal.Title>
        <div
          className='btn btn-icon btn-sm btn-active-icon-primary'
          onClick={onClose}
          style={{ cursor: 'pointer' }}
        >
          <KTIcon iconName='cross' className='fs-1' />
        </div>
      </Modal.Header>

      <Modal.Body className='py-0 px-5 px-xl-15'>
        {/* <EditModalFormWrapper 
          onClose={onClose} 
          tipoComision={tipoComision}
        /> */}
      </Modal.Body>

      <Modal.Footer style={{ borderTop: 'none' }}>
        <Button variant='light' onClick={onVolver} className='me-3'>
          <KTIcon iconName='arrow-left' className='fs-2' />
          Volver
        </Button>
      </Modal.Footer>
    </>
  )
}

export { FormularioComisionView }