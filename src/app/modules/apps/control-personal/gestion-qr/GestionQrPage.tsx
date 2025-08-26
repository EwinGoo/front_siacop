import React, { useEffect } from 'react'
import {useIntl} from 'react-intl'
import {PageLink, PageTitle} from 'src/_metronic/layout/core'
import {QRScannerPanel} from './components/QRScanner'
import {ControlPanel} from './components/ControlPanel'
import {UltimoCodigoCard, HistorialCard} from './components/Cards'
import {useQRScanner} from './hooks'

const GestionQrPage: React.FC = () => {
  const intl = useIntl()
  const gestionQRBreadcrumbs: Array<PageLink> = [
    {
      title: 'Control Personal',
      path: '/apps/comisiones/gestion-qr',
      isSeparator: false,
      isActive: false,
    },
  ]
  const {
    // Estados
    loading,
    lastScanned,
    scannedHistory,
    modoRecepcion,
    tipoPermiso,
    fechaHora,
    isPaused,

    // Handlers
    handleQRDetected,
    handleIngresoManual,
    setModoRecepcion,
    setTipoPermiso,
    setFechaHora,
    setIsPaused,
    actualizarTiempo,
    onUpdatedScannedHistory 
  } = useQRScanner()

  // Efecto para manejar el atajo de teclado Ctrl + M
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Verificar si se presiona Ctrl + M
      if (event.ctrlKey && event.key.toLowerCase() === 'm') {
        event.preventDefault()
        handleIngresoManual() 
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleIngresoManual])

  return (
    <>
      <PageTitle breadcrumbs={gestionQRBreadcrumbs}>Gestión por QR</PageTitle>

      <div className='row g-6'>
        {/* Panel principal del escáner */}
        <div className='col-xl-8'>
          <QRScannerPanel
            modoRecepcion={modoRecepcion}
            tipoPermiso={tipoPermiso}
            onQRDetected={handleQRDetected}
          />
        </div>

        {/* Panel de información y controles */}
        <div className='col-xl-4'>
          <ControlPanel
            modoRecepcion={modoRecepcion}
            tipoPermiso={tipoPermiso}
            fechaHora={fechaHora}
            isPaused={isPaused}
            loading={loading}
            onModoRecepcionChange={setModoRecepcion}
            onTipoPermisoChange={setTipoPermiso}
            onFechaHoraChange={setFechaHora}
            onPausedChange={setIsPaused}
            onIngresoManual={handleIngresoManual}
            onTimeUpdate={actualizarTiempo}
          />

          <UltimoCodigoCard lastScanned={lastScanned}  />
          <HistorialCard scannedHistory={scannedHistory}   />
        </div>
      </div>
    </>
  )
}

export default GestionQrPage