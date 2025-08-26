import React, {useState, useCallback} from 'react'
import {useIntl} from 'react-intl'
import {PageTitle} from 'src/_metronic/layout/core'
import {QRScanner} from './components/QRScanner'
import {ControlPanel} from './components/ControlPanel'
import {useComisionActions} from './hooks/useComisionActions'
import useDateFormatter from '../../../../../hooks/useDateFormatter'
import {ComisionData, QRResult} from './core/_models'
import Swal from 'sweetalert2'

const GestionComisionQR: React.FC = () => {
  const intl = useIntl()
  const {formatToBolivianDate} = useDateFormatter()
  const {loading, handleComisionAction, fetchComisionData} = useComisionActions()

  const [lastScannedCode, setLastScannedCode] = useState('')
  const [scannedHistory, setScannedHistory] = useState<Array<{code: string; timestamp: number}>>([])

  const handleQRDetected = useCallback(
    async (result: QRResult) => {
      // Implementar lógica de detección similar a la original
    },
    [scannedHistory]
  )

  const handleIngresoManual = async () => {
    const {value: codigo} = await Swal.fire({
      title: 'Ingreso Manual de Código',
      input: 'text',
      inputLabel: 'Código de la comisión',
      inputPlaceholder: 'Ingrese el código...',
      showCancelButton: true,
      confirmButtonText: '<i class="las la-search fs-5 me-2"></i> Buscar',
      cancelButtonText: '<i class="bi bi-x fs-5 me-2"></i>Cancelar',
      customClass: {
        confirmButton: 'btn btn-primary',
        cancelButton: 'btn btn-danger',
      },
      inputValidator: (value) => {
        if (!value) {
          return 'Debe ingresar un código'
        }
        // if (!/^\d+$/.test(value)) {
        //   return 'El código debe ser un número entero positivo'
        // }
        if (!/^[CP]\d+$/.test(value)) {
          Swal.showValidationMessage(
            'El código debe empezar con C o P seguido de números (ej: C23, P456)'
          )
          return false
        }
        
        if (value.length < 2 || value.length > 11) {
          Swal.showValidationMessage(
            'El código debe tener entre 2 y 11 caracteres (ej: C1 hasta P1234567890)'
          )
          return false
        }

        if (!/^[A-Za-z0-9]+$/.test(value)) {
          Swal.showValidationMessage(
            'El código debe ser alfanumérico (solo letras y números, ej: ABC123, X1Y2Z3)'
          )
          return false
        }
      },
    })

    if (codigo) {
      await handleQRDetected({code: codigo, timestamp: Date.now()})
    }
  }

  return (
    <>
      <div className='row g-6'>
        <div className='col-xl-8'>
          <QRScanner onQRDetected={handleQRDetected} />
        </div>
        <div className='col-xl-4'>
          <ControlPanel
            loading={loading}
            lastScannedCode={lastScannedCode}
            scannedHistory={scannedHistory}
            onManualEntry={handleIngresoManual}
          />
        </div>
      </div>
    </>
  )
}

export {GestionComisionQR}
