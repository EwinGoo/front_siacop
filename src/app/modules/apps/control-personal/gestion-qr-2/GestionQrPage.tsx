import React, { useEffect } from 'react'
import { PageLink, PageTitle } from 'src/_metronic/layout/core'
import { DocumentProcessorProvider, useDocumentProcessor } from './context'
import { useQRScanner } from './hooks'
// import { formatToBolivianDate } from 'src/app/utils/dateTimeFormater'

// Components
import { QRScannerPanel } from './components/QRScanner'
import { ControlPanel } from './components/ControlPanel'
import { UltimoCodigoCard, HistorialCard } from './components/Cards'
import {
  DocumentModal,
  ObservacionModal,
  LoadingModal,
  SuccessModal,
  ErrorModal,
  IngresoManualModal
} from './components/Modal'
import useDateFormatter from 'src/app/hooks/useDateFormatter'

/**
 * Componente interno con acceso al Context
 */
const GestionQrPageContent: React.FC = () => {
  const scanner = useQRScanner()
  const {formatToBolivianDate} = useDateFormatter()

  // Efecto para manejar el atajo de teclado Ctrl + M
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key.toLowerCase() === 'm') {
        event.preventDefault()
        scanner.handleIngresoManual()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [scanner.handleIngresoManual])

  return (
    <>
      <div className='row g-6'>
        {/* Panel principal del escáner */}
        <div className='col-xl-8'>
          <QRScannerPanel
            modoRecepcion={scanner.modoRecepcion}
            tipoPermiso={scanner.tipoPermiso}
            onQRDetected={scanner.handleQRDetected}
          />
        </div>

        {/* Panel de información y controles */}
        <div className='col-xl-4'>
          <ControlPanel
            modoRecepcion={scanner.modoRecepcion}
            tipoPermiso={scanner.tipoPermiso}
            fechaHora={scanner.fechaHora}
            isPaused={scanner.isPaused}
            loading={scanner.loading}
            onModoRecepcionChange={scanner.setModoRecepcion}
            onTipoPermisoChange={scanner.setTipoPermiso}
            onFechaHoraChange={scanner.setFechaHora}
            onPausedChange={scanner.setIsPaused}
            onIngresoManual={scanner.handleIngresoManual}
            onTimeUpdate={scanner.actualizarTiempo}
          />

          <UltimoCodigoCard lastScanned={scanner.lastScanned} />
          <HistorialCard scannedHistory={scanner.scannedHistory} />
        </div>
      </div>

      {/* Modal principal de documento */}
      <DocumentModal
        show={scanner.modalState.show}
        document={scanner.modalState.document}
        onHide={scanner.hideModal}
        onAction={scanner.handleModalAction}
        formatDate={formatToBolivianDate}
      />

      {/* Modal de observación */}
      <ObservacionModal
        show={scanner.observacionModal}
        document={scanner.modalState.document}
        onConfirm={scanner.handleObservacionConfirm}
        onCancel={scanner.closeObservacionModal}
      />

      {/* Modal de ingreso manual */}
      <IngresoManualModal
        show={scanner.ingresoManualModal}
        onConfirm={scanner.handleIngresoManualConfirm}
        onCancel={scanner.closeIngresoManualModal}
      />

      {/* Modales de feedback */}
      <LoadingModal
        show={scanner.feedbackModal.loading}
        message={scanner.feedbackModal.message}
      />

      <SuccessModal
        show={scanner.feedbackModal.success}
        title={scanner.feedbackModal.title}
        message={scanner.feedbackModal.message}
        onClose={scanner.closeFeedbackModal}
      />

      <ErrorModal
        show={scanner.feedbackModal.error}
        title={scanner.feedbackModal.title}
        message={scanner.feedbackModal.message}
        onClose={scanner.closeFeedbackModal}
      />
    </>
  )
}

/**
 * Componente principal con Provider
 */
const GestionQrPage: React.FC = () => {
  const gestionQRBreadcrumbs: Array<PageLink> = [
    {
      title: 'Control Personal',
      path: '/apps/comisiones/gestion-qr',
      isSeparator: false,
      isActive: false,
    },
  ]

  return (
    <DocumentProcessorProvider>
      <PageTitle breadcrumbs={gestionQRBreadcrumbs}>Gestión por QR</PageTitle>
      <GestionQrPageContent />
    </DocumentProcessorProvider>
  )
}

export default GestionQrPage
