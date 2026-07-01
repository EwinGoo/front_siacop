import {useCallback, useState} from 'react'
import {ComisionPDFData} from '../core/_models'

const useComisionPDFModal = () => {
  const [showPDFModal, setShowPDFModal] = useState(false)
  const [currentPDFData, setCurrentPDFData] = useState<ComisionPDFData | null>(null)

  const handleShowPDF = useCallback((pdfData: ComisionPDFData) => {
    setCurrentPDFData(pdfData)
    setShowPDFModal(true)
  }, [])

  const handleClosePDFModal = useCallback(() => {
    setShowPDFModal(false)
    setTimeout(() => setCurrentPDFData(null), 300)
  }, [])

  return {
    handleShowPDF,
    pdfModalProps: {
      isOpen: showPDFModal,
      onClose: handleClosePDFModal,
      pdfBlob: currentPDFData?.blob || null,
      filename: currentPDFData?.filename || '',
      title: currentPDFData?.title || 'Boleta de comisión',
    },
  }
}

export {useComisionPDFModal}
