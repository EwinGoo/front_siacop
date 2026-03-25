import {useState, useEffect, useCallback} from 'react'
import Modal from 'react-bootstrap/Modal'
import {KTIcon} from 'src/_metronic/helpers'
import {useListView} from '../core/ListViewProvider'
import {ReportModalFormWrapper} from './ReportModalFormWrapper'

/** En móvil (< 768px) los iframes de PDF no se renderizan bien (sobre todo iOS) */
const isMobile = (): boolean => window.innerWidth < 768

const ReportModal = () => {
  const {isShow, setIsShow, setAccion} = useListView()
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)

  // Liberar blob URL al cerrar
  useEffect(() => {
    if (!isShow && pdfUrl) {
      URL.revokeObjectURL(pdfUrl)
      setPdfUrl(null)
    }
  }, [isShow])

  const handleClose = () => {
    setIsShow(false)
    setAccion(undefined)
  }

  const handleBack = () => {
    if (pdfUrl) {
      URL.revokeObjectURL(pdfUrl)
      setPdfUrl(null)
    }
  }

  /**
   * Cuando el PDF está listo:
   * - Móvil  → descarga directa con <a download>
   * - Desktop → muestra el iframe en el modal
   */
  const handlePdfReady = useCallback((url: string) => {
    if (isMobile()) {
      // Disparar descarga y cerrar el modal
      const a = document.createElement('a')
      a.href = url
      a.download = `reporte-vacaciones-${new Date().toISOString().slice(0, 10)}.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)

      // Liberar el blob después de un tick para que el click se procese
      setTimeout(() => URL.revokeObjectURL(url), 1000)

      handleClose()
    } else {
      setPdfUrl(url)
    }
  }, [])

  if (!isShow) return null

  const showingPdf = pdfUrl !== null

  return (
    <Modal
      show={isShow}
      onHide={handleClose}
      centered
      size={showingPdf ? 'xl' : 'lg'}
      backdrop='static'
      keyboard={false}
    >
      <Modal.Header>
        <Modal.Title className='fw-bold fs-2'>
          {showingPdf ? 'Reporte de Vacaciones' : 'Generar Reporte de Vacaciones'}
        </Modal.Title>
        <div className='d-flex gap-2 align-items-center'>
          {showingPdf && (
            <button type='button' className='btn btn-sm btn-light' onClick={handleBack}>
              <i className='bi bi-arrow-left me-1'></i> Volver
            </button>
          )}
          <div
            className='btn btn-icon btn-sm btn-active-icon-primary'
            onClick={handleClose}
            style={{cursor: 'pointer'}}
          >
            <KTIcon iconName='cross' className='fs-1' />
          </div>
        </div>
      </Modal.Header>

      <Modal.Body className='p-0' style={showingPdf ? {height: '80vh'} : {}}>
        {showingPdf ? (
          <iframe
            src={pdfUrl!}
            title='Reporte de Vacaciones'
            width='100%'
            height='100%'
            style={{border: 'none', minHeight: '75vh'}}
          />
        ) : (
          <div className='p-6'>
            <ReportModalFormWrapper onClose={handleClose} onPdfReady={handlePdfReady} />
          </div>
        )}
      </Modal.Body>
    </Modal>
  )
}

export {ReportModal}
