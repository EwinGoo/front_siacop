import {useState} from 'react'
import {ReportModalHeader} from './ReportModalHeader'
import {ReportModalFormWrapper} from './ReportModalFormWrapper'
import Modal from 'react-bootstrap/Modal'
import {useListView} from '../core/ListViewProvider'
import {PermisoPDFData} from '../core/_models'

type Props = {
  onShowPDF: (pdfData: PermisoPDFData) => void
}

const ReportModal = ({onShowPDF}: Props) => {
  const {accion, setItemIdForUpdate, setIsShow, isShow} = useListView()
  const [, setSelectedType] = useState<string | null>(null)

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
          <ReportModalFormWrapper onClose={handleClose} onShowPDF={onShowPDF} />
        </Modal.Body>
      </Modal>
    )
  }
  return null // o simplemente return
}

export {ReportModal}
