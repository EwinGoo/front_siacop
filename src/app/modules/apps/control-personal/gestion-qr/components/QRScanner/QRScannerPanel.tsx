// components/QRScanner/QRScannerPanel.tsx
import React from 'react'
import {ModoRecepcion, TipoPermiso, QRResult} from '../../types'
import {QRReaderAlternative} from '../QRReaderAlternative'

interface QRScannerPanelProps {
  modoRecepcion: ModoRecepcion
  tipoPermiso: TipoPermiso
  onQRDetected: (result: QRResult) => void
}

export const QRScannerPanel: React.FC<QRScannerPanelProps> = ({
  modoRecepcion,
  tipoPermiso,
  onQRDetected,
}) => {
  return (
    <div className='card'>
      <div className='card-header'>
        <div className='card-title'>
          <h3 className='fw-bold'>
            <i className='bi bi-qr-code-scan me-3 text-primary'></i>
            Escáner de Códigos QR
          </h3>
          {/* {tipoPermiso === 'hora' && (
            <div className='alert alert-info d-flex align-items-center py-2 mb-3'>
              <i className='bi bi-clock me-2'></i>
              <small>
                <strong>Procesando:</strong> Permisos por horas específicas
              </small>
            </div>
          )} */}
        </div>
      </div>
      <div className='card-body'>
        {/* Alertas de modo */}
        {modoRecepcion === 'automatico' && (
          <div className='alert alert-warning d-flex align-items-center py-2 mb-3' style={{color:'#716d11'}}>
            <i className='bi bi-info-circle me-2'></i>
            <small>
              <strong>Modo automático:</strong> Recepción directa para estados GENERADO/ENVIADO
            </small>
          </div>
        )}

        {tipoPermiso === 'dia' && (
          <div className='alert alert-primary d-flex align-items-center py-2 mb-3'>
            <i className='bi bi-calendar-day me-2'></i>
            <small>
              <strong>Procesando:</strong> Permisos por día completo
            </small>
          </div>
        )}

        {tipoPermiso === 'hora' && (
          <div className='alert alert-info d-flex align-items-center py-2 mb-3'>
            <i className='bi bi-clock me-2'></i>
            <small>
              <strong>Procesando:</strong> Permisos por horas específicas
            </small>
          </div>
        )}

        {/* Componente del escáner QR */}
        <QRReaderAlternative onQRDetected={onQRDetected} autoStart={true} />

        {/* Información adicional */}
        <div className='mt-4'>
          <div className='row'>
            <div className='col-md-6'>
              <div className='bg-light p-3 rounded'>
                <h6 className='fw-bold text-gray-700 mb-2'>
                  <i className='bi bi-gear me-2'></i>Configuración Actual
                </h6>
                <div className='d-flex justify-content-between mb-1'>
                  <span className='text-muted'>Modo:</span>
                  <span
                    className={`badge ${
                      modoRecepcion === 'automatico' ? 'bg-success' : 'bg-primary'
                    }`}
                  >
                    {modoRecepcion === 'automatico' ? 'Automático' : 'Manual'}
                  </span>
                </div>
                <div className='d-flex justify-content-between'>
                  <span className='text-muted'>Tipo:</span>
                  <span className={`badge ${tipoPermiso === 'hora' ? 'badge-light-info' : 'badge-light-primary'}`}>
                    {tipoPermiso === 'hora' ? 'Por Horas' : 'Por Día'}
                  </span>
                </div>
              </div>
            </div>
            <div className='col-md-6'>
              <div className='bg-light p-3 rounded'>
                <h6 className='fw-bold text-gray-700 mb-2'>
                  <i className='bi bi-info-circle me-2'></i>Instrucciones
                </h6>
                <ul className='list-unstyled mb-0 small text-muted'>
                  <li>
                    <i className='bi bi-dot'></i> Apunte la cámara al código QR
                  </li>
                  <li>
                    <i className='bi bi-dot'></i> Mantenga el código bien enfocado
                  </li>
                  <li>
                    <i className='bi bi-dot'></i> El escaneo es automático
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
