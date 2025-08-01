import {useEffect, useState} from 'react'
import {ReportModalHeader} from './ReportModalHeader'
import {ReportModalFormWrapper} from './ReportModalFormWrapper'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import {useListView} from '../core/ListViewProvider'
import {KTIcon} from '../../../../../../../_metronic/helpers'

const ReportModal = () => {
  const {accion, setItemIdForUpdate, setIsShow, isShow, itemIdForUpdate} = useListView()
  const [selectedType, setSelectedType] = useState<string | null>(null)

  // Resetear estado cuando se cierra el modal
  const handleClose = () => {
    setIsShow(false)
    setItemIdForUpdate(undefined)
    setSelectedType(null)
  }

  if ((isShow && accion === 'report')) {
    return (
      <Modal
        show={isShow}
        onHide={handleClose}
        centered
        size='lg'
        backdrop='static'
        keyboard={false}
      >
        <Modal.Header>
          <ReportModalHeader onClose={handleClose} />
        </Modal.Header>

        <Modal.Body>
          <ReportModalFormWrapper onClose={handleClose} />
        </Modal.Body>
      </Modal>
    )
  }
  return null // o simplemente return
}

export {ReportModal}
