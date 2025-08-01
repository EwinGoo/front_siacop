import React from 'react';

interface HistoryListProps {
  scannedHistory: Array<{code: string; timestamp: number}>;
}

export const HistoryList: React.FC<HistoryListProps> = ({ scannedHistory }) => {
  if (scannedHistory.length === 0) return null;

  return (
    <div className='card'>
      <div className='card-header'>
        <h3 className='card-title'>Historial Reciente</h3>
      </div>
      <div className='card-body'>
        <div className='scroll-y' style={{maxHeight: '300px'}}>
          {scannedHistory.map((item, index) => (
            <div key={index} className='d-flex align-items-center py-2'>
              <div className='symbol symbol-30px me-3'>
                <div className='symbol-label bg-light-primary'>
                  <i className='bi bi-clock text-primary fs-6'></i>
                </div>
              </div>
              <div className='flex-grow-1'>
                <div className='fw-semibold text-gray-800 fs-7'>{item.code}</div>
                <div className='text-muted fs-8'>
                  {new Date(item.timestamp).toLocaleTimeString('es-BO')}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};