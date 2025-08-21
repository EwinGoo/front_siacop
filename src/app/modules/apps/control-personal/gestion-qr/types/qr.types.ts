export interface QRResult {
  code: string
  timestamp: number
  rawData?: any
}

export interface QRScannerState {
  lastScannedCode: string
  scannedHistory: Array<{ code: string; timestamp: number }>
  loading: boolean
}