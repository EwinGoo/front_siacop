import {Modal} from 'react-bootstrap'
import {KTIcon} from 'src/_metronic/helpers'

const ReportModalHeader = ({onClose}: {onClose: () => void}) => {
  return (
    <>
      <Modal.Title className='fw-bold fs-2'>Generar Reporte de Vacaciones</Modal.Title>
      <div
        className='btn btn-icon btn-sm btn-active-icon-primary'
        onClick={onClose}
        style={{cursor: 'pointer'}}
      >
        <KTIcon iconName='cross' className='fs-1' />
      </div>
    </>
  )
}

export {ReportModalHeader}
