import React from 'react'
import { ModoRecepcion, TipoPermiso, QRResult } from '../../core/types'
import { getDocumentTypeByKey } from '../../config/documentTypes.config'

interface QRScannerPanelProps {
  modoRecepcion: ModoRecepcion
  tipoPermiso: TipoPermiso
  onQRDetected: (result: QRResult) => void
}

/**
 * Panel del escáner QR con información contextual
 */
export const QRScannerPanel: React.FC<QRScannerPanelProps> = ({
  modoRecepcion,
  tipoPermiso,
  onQRDetected,
}) => {
  // Obtener configuración del tipo actual
  const getCurrentTypeConfig = () => {
    const keyMap: Record<TipoPermiso, 'COMISION' | 'PERMISO' | 'VACACION'> = {
      hora: 'COMISION',
      dia: 'PERMISO',
      vacacion: 'VACACION'
    }
    return getDocumentTypeByKey(keyMap[tipoPermiso])
  }

  const config = getCurrentTypeConfig()

  return (
    <div className='card'>
      <div className='card-header'>
        <div className='card-title'>
          <h3 className='fw-bold'>
            <i className='bi bi-qr-code-scan me-3 text-primary'></i>
            Escáner de Códigos QR
          </h3>
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

        {/* Alerta del tipo actual */}
        <div className={`alert alert-${config.color} d-flex align-items-center py-2 mb-3`}>
          <i className={`${config.icon} me-2`}></i>
          <small>
            <strong>Procesando:</strong> {config.description}
          </small>
        </div>

        {/* Componente del escáner QR */}
        {/* TODO: Importar QRReaderAlternative aquí */}
        <div className="p-5 bg-light rounded text-center">
          <i className="bi bi-qr-code-scan display-1 text-muted mb-3"></i>
          <p className="text-muted">Componente QR Scanner aquí</p>
          <small className="text-muted">Apunte la cámara al código QR</small>
        </div>

        {/* Información adicional */}
        <div className='mt-4'>
          <div className='row'>
            <div className='col-md-6'>
              <div className='bg-light p-3 rounded'>
                <h6 className='fw-bold text-gray-700 mb-2'>
                  <i className='bi bi-gear me-2'></i>
                  Configuración Actual
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
                  <span className={`badge ${config.badgeColor}`}>
                    {config.label}
                  </span>
                </div>
              </div>
            </div>
            <div className='col-md-6'>
              <div className='bg-light p-3 rounded'>
                <h6 className='fw-bold text-gray-700 mb-2'>
                  <i className='bi bi-info-circle me-2'></i>
                  Instrucciones
                </h6>
                <ul className='list-unstyled mb-0 small text-muted'>
                  <li>
                    <i className='bi bi-dot'></i> Apunte la cámara al código QR
                  </li>
                  <li>
                    <i className='bi bi-dot'></i> Use los controles de enfoque para mayor precisión
                  </li>
                  <li>
                    <i className='bi bi-dot'></i> Distancia óptima: 20-50cm del QR
                  </li>
                  <li>
                    <i className='bi bi-dot'></i> El escaneo es automático y sin duplicados
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
