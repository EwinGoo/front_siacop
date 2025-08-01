import React from 'react';
import { HistoryList } from './HistoryList';

interface ControlPanelProps {
  loading: boolean;
  lastScannedCode?: string;
  scannedHistory: Array<{code: string; timestamp: number}>;
  onManualEntry: () => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  loading,
  lastScannedCode,
  scannedHistory,
  onManualEntry
}) => {
  return (
    <>
      {/* Controles adicionales */}
      <div className='card mb-6'>
        <div className='card-header'>
          <h3 className='card-title'>Controles</h3>
        </div>
        <div className='card-body'>
          <button
            onClick={onManualEntry}
            className='btn btn-light-primary w-100 mb-3'
            disabled={loading}
          >
            <i className='bi bi-keyboard me-2'></i>
            Ingreso Manual
          </button>

          {loading && (
            <div className='text-center'>
              <div className='spinner-border text-primary' role='status'>
                <span className='visually-hidden'>Procesando...</span>
              </div>
              <p className='text-muted mt-2'>Procesando recepción...</p>
            </div>
          )}
        </div>
      </div>

      {/* Último código escaneado */}
      {lastScannedCode && (
        <div className='card mb-6'>
          <div className='card-header'>
            <h3 className='card-title'>Último Código</h3>
          </div>
          <div className='card-body'>
            <div className='d-flex align-items-center'>
              <div className='symbol symbol-40px me-4'>
                <div className='symbol-label bg-light-success'>
                  <i className='bi bi-qr-code text-success fs-4'></i>
                </div>
              </div>
              <div className='flex-grow-1'>
                <div className='fw-bold text-gray-800'>{lastScannedCode}</div>
                <div className='text-muted fs-7'>{new Date().toLocaleTimeString('es-BO')}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Historial de códigos */}
      <HistoryList scannedHistory={scannedHistory} />
    </>
  );
};