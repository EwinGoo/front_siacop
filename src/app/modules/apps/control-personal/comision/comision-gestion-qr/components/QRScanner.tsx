import { QRReaderAlternative } from '../../components/QRReaderAlternative';
import { QRResult } from '../core/_models';

interface QRScannerProps {
  onQRDetected: (result: QRResult) => void;
  autoStart?: boolean;
}

export const QRScanner = ({ onQRDetected, autoStart = true }: QRScannerProps) => {
  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">
          <h3 className="fw-bold">
            <i className="bi bi-qr-code-scan me-3 text-primary"></i>
            Escáner de Códigos QR
          </h3>
        </div>
      </div>
      <div className="card-body">
        <QRReaderAlternative onQRDetected={onQRDetected} autoStart={autoStart} />
      </div>
    </div>
  );
};