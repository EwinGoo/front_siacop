import {useCallback, useState} from 'react'
import {PermisoPDFData} from '../core/_models'

const usePermisoPDFModal = () => {
  const [showPDFModal, setShowPDFModal] = useState(false)
  const [currentPDFData, setCurrentPDFData] = useState<PermisoPDFData | null>(null)

  const handleShowPDF = useCallback((pdfData: PermisoPDFData) => {
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
      title: currentPDFData?.title || 'Permiso',
    },
  }
}

export {usePermisoPDFModal}
