import React, {useEffect, useState} from 'react'
import {Modal} from 'react-bootstrap'

type Props = {
  isOpen: boolean
  onClose: () => void
  pdfBlob: Blob | null
  filename: string
  title?: string
}

const PDFModal: React.FC<Props> = ({
  isOpen,
  onClose,
  pdfBlob,
  filename,
  title = 'Vista de PDF',
}) => {
  const [pdfUrl, setPdfUrl] = useState('')
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor
      const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
        userAgent
      )
      setIsMobile(isMobileDevice || window.innerWidth <= 768)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)

    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    if (!isOpen || !pdfBlob) {
      setPdfUrl('')
      return
    }

    const url = URL.createObjectURL(pdfBlob)
    setPdfUrl(url)

    return () => {
      URL.revokeObjectURL(url)
    }
  }, [isOpen, pdfBlob])

  const handleDownload = () => {
    if (!pdfUrl) {
      return
    }

    const link = document.createElement('a')
    link.href = pdfUrl
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleOpenInNewTab = () => {
    if (pdfUrl) {
      window.open(pdfUrl, '_blank')
    }
  }

  const handlePrint = () => {
    if (!pdfUrl) {
      return
    }

    const iframe = document.createElement('iframe')
    iframe.style.position = 'absolute'
    iframe.style.top = '-1000px'
    iframe.style.left = '-1000px'
    iframe.style.width = '0'
    iframe.style.height = '0'
    iframe.style.border = 'none'

    document.body.appendChild(iframe)
    iframe.onload = () => {
      iframe.contentWindow?.print()
      setTimeout(() => document.body.removeChild(iframe), 1000)
    }
    iframe.src = pdfUrl
  }

  const renderMobileView = () => (
    <div className='text-center py-8 px-5'>
      <i className='las la-file-pdf text-danger mb-4' style={{fontSize: '4rem'}}></i>
      <h5 className='mb-3 text-gray-900'>PDF generado correctamente</h5>
      <p className='text-muted mb-5'>
        En dispositivos móviles descarga el archivo para visualizarlo correctamente.
      </p>
      <button type='button' className='btn btn-primary w-100' onClick={handleDownload}>
        <i className='las la-download fs-3 me-2'></i>
        Descargar PDF
      </button>
    </div>
  )

  return (
    <Modal
      show={isOpen}
      onHide={onClose}
      size={isMobile ? 'lg' : 'xl'}
      centered
      backdrop='static'
      keyboard={false}
      fullscreen={isMobile ? 'sm-down' : undefined}
      contentClassName='bg-white text-gray-900'
    >
      <Modal.Header closeButton className='py-4 bg-light-primary border-0'>
        <Modal.Title className='fs-4 text-gray-900 fw-bolder'>
          <i className='las la-file-pdf fs-2 text-danger me-2'></i>
          {title}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className='p-0 bg-white' style={{height: isMobile ? 'auto' : '80vh'}}>
        {!pdfUrl ? (
          <div className='d-flex justify-content-center align-items-center h-100 py-10'>
            <div className='text-center'>
              <div className='spinner-border text-primary mb-3' role='status'>
                <span className='visually-hidden'>Cargando...</span>
              </div>
              <p className='text-muted mb-0'>Cargando PDF...</p>
            </div>
          </div>
        ) : isMobile ? (
          renderMobileView()
        ) : (
          <iframe
            src={pdfUrl}
            width='100%'
            height='100%'
            style={{border: 'none'}}
            title={filename}
          />
        )}
      </Modal.Body>

      {!isMobile && (
        <Modal.Footer className='py-3 bg-light-primary border-0'>
          <small className='text-gray-700 fw-semibold me-auto'>{filename}</small>
          <button
            type='button'
            className='btn btn-sm btn-light-secondary'
            onClick={handleOpenInNewTab}
            disabled={!pdfUrl}
          >
            <i className='las la-external-link-alt fs-4'></i>
            Nueva pestaña
          </button>
          <button
            type='button'
            className='btn btn-sm btn-light-primary'
            onClick={handleDownload}
            disabled={!pdfUrl}
          >
            <i className='las la-download fs-4'></i>
            Descargar
          </button>
          <button
            type='button'
            className='btn btn-sm btn-light-info'
            onClick={handlePrint}
            disabled={!pdfUrl}
          >
            <i className='las la-print fs-4'></i>
            Imprimir
          </button>
        </Modal.Footer>
      )}
    </Modal>
  )
}

export default PDFModal
