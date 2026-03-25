import React, {useState} from 'react'
import {ModuleModalProps} from '../../modules/types'
import BaseModal from './shared/BaseModal'
import EmpleadoInfo from './shared/EmpleadoInfo'
import EstadoBadge from './shared/EstadoBadge'

type Step = 'data' | 'approve'

const VacacionModal: React.FC<ModuleModalProps> = ({
  data,
  accionesDisponibles,
  formatToBolivianDate,
  onClose,
}) => {
  const [step, setStep] = useState<Step>('data')
  const [numeroTramite, setNumeroTramite] = useState('')
  const [tramiteError, setTramiteError] = useState('')

  const handleClose = () => onClose({confirmed: false})

  const handleApproveSubmit = () => {
    if (!numeroTramite.trim()) {
      setTramiteError('El número de trámite es obligatorio')
      return
    }
    onClose({confirmed: true, action: 'approve', numero_tramite: numeroTramite.trim().toUpperCase()})
  }

  const title = (
    <div className='text-center'>
      <h4 className='text-success fw-bold mb-1'>
        <i className='bi bi-umbrella me-2'></i>VACACIÓN
      </h4>
      <h5 className='text-gray-700 mb-0'>TIPO: {data.tipo_permiso}</h5>
      {data.nro_correlativo && (
        <small className='text-muted'>N° CORRELATIVO: {data.nro_correlativo}</small>
      )}
    </div>
  )

  // Paso 2: formulario de número de trámite
  if (step === 'approve') {
    return (
      <BaseModal
        title={
          <h5 className='text-success fw-bold'>
            <i className='bi bi-check-circle me-2'></i>Aprobar Vacación
          </h5>
        }
        onClose={handleClose}
        footer={
          <>
            <button className='btn btn-secondary btn-sm' onClick={() => setStep('data')}>
              <i className='bi bi-arrow-left me-1'></i>Volver
            </button>
            <button className='btn btn-success btn-sm' onClick={handleApproveSubmit}>
              <i className='bi bi-check-circle me-1'></i>Confirmar Aprobación
            </button>
          </>
        }
      >
        <div className='alert alert-success py-2 mb-3'>
          <strong>Código:</strong> {data.codigo} &nbsp;|&nbsp;
          <strong>Empleado:</strong> {data.nombre_generador}
        </div>
        <label className='form-label fw-bold required'>Número de trámite:</label>
        <input
          type='text'
          className={`form-control form-control-solid text-uppercase ${tramiteError ? 'is-invalid' : ''}`}
          placeholder='Ej: GAD-2026-001'
          value={numeroTramite}
          onChange={(e) => {
            setNumeroTramite(e.target.value)
            setTramiteError('')
          }}
          autoFocus
        />
        {tramiteError && <div className='invalid-feedback'>{tramiteError}</div>}
      </BaseModal>
    )
  }

  // Paso 1: datos de la vacación
  return (
    <BaseModal
      title={title}
      onClose={handleClose}
      footer={
        <>
          {accionesDisponibles.length === 0 && (
            <button className='btn btn-secondary btn-sm' onClick={handleClose}>
              <i className='bi bi-eye me-1'></i>Visto
            </button>
          )}
          {accionesDisponibles.includes('reception') && (
            <button className='btn btn-success btn-sm' onClick={() => onClose({confirmed: true, action: 'reception'})}>
              <i className='bi bi-check-circle me-1'></i>Recepcionar Vacación
            </button>
          )}
          {/* Vacaciones no tiene acción Observar actualmente */}
          {accionesDisponibles.includes('approve') && (
            <button className='btn btn-success btn-sm' onClick={() => setStep('approve')}>
              <i className='bi bi-check-circle me-1'></i>Aprobar Vacación
            </button>
          )}
        </>
      }
    >
      <EmpleadoInfo data={data} />

      <div className='bg-success bg-opacity-10 p-3 rounded'>
        <h6 className='text-success mb-2 fw-semibold'>
          <i className='bi bi-umbrella me-2'></i>Detalles de la Vacación
        </h6>
        <div className='row g-1 small'>
          <div className='col-4 fw-bold'>Código</div>
          <div className='col-8'>: {data.codigo}</div>

          {data.numero_tramite && (
            <>
              <div className='col-4 fw-bold'>N° Trámite</div>
              <div className='col-8'>: {data.numero_tramite}</div>
            </>
          )}

          <div className='col-4 fw-bold'>Fecha inicio</div>
          <div className='col-8'>: {formatToBolivianDate(data.fecha_inicio, {dateStyle: 'full'})}</div>

          {data.fecha_fin && (
            <>
              <div className='col-4 fw-bold'>Fecha fin</div>
              <div className='col-8'>: {formatToBolivianDate(data.fecha_fin, {dateStyle: 'full'})}</div>
            </>
          )}

          {data.dias_solicitado != null && (
            <>
              <div className='col-4 fw-bold'>Días solicitados</div>
              <div className='col-8'>
                : <span className='badge bg-primary'>{data.dias_solicitado}</span>
              </div>
            </>
          )}

          {data.dias_disponible != null && (
            <>
              <div className='col-4 fw-bold'>Días disponibles</div>
              <div className='col-8'>
                : <span className='badge bg-info'>{data.dias_disponible}</span>
              </div>
            </>
          )}

          {data.dias_saldo != null && (
            <>
              <div className='col-4 fw-bold'>Saldo</div>
              <div className='col-8'>
                : <span className='badge bg-secondary'>{data.dias_saldo}</span>
              </div>
            </>
          )}

          <div className='col-4 fw-bold'>Estado</div>
          <div className='col-8'>
            : <EstadoBadge estado={data.estado} />
          </div>
        </div>
      </div>
    </BaseModal>
  )
}

export default VacacionModal
