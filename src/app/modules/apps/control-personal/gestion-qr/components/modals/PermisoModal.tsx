import React, {useState} from 'react'
import {ModuleModalProps, ModuleModalResult} from '../../modules/types'
import BaseModal from './shared/BaseModal'
import EmpleadoInfo from './shared/EmpleadoInfo'
import EstadoBadge from './shared/EstadoBadge'

const PermisoModal: React.FC<ModuleModalProps> = ({
  data,
  accionesDisponibles,
  formatToBolivianDate,
  onClose,
}) => {
  const [step, setStep] = useState<'data' | 'observe'>('data')
  const [observacion, setObservacion] = useState('')
  const [obsError, setObsError] = useState('')

  const handleClose = () => onClose({confirmed: false})

  const handleAction = (action: ModuleModalResult['action']) => {
    onClose({confirmed: true, action})
  }

  const handleObserveSubmit = () => {
    if (!observacion.trim()) {
      setObsError('La observación es requerida')
      return
    }
    if (observacion.trim().length < 10) {
      setObsError('La observación debe tener al menos 10 caracteres')
      return
    }
    onClose({confirmed: true, action: 'observe', observacion: observacion.trim()})
  }

  const title = (
    <div className='text-center'>
      <h4 className='text-primary fw-bold mb-1'>
        <i className='bi bi-calendar-check me-2'></i>LICENCIA ESPECIAL
      </h4>
      <h5 className='text-gray-700 mb-0'>PERMISO: {data.tipo_permiso || data.tipo_permiso_nombre}</h5>
      {data.nro_correlativo && (
        <small className='text-muted'>N° CORRELATIVO: {data.nro_correlativo}</small>
      )}
    </div>
  )

  if (step === 'observe') {
    return (
      <BaseModal
        title={
          <h5 className='text-warning fw-bold'>
            <i className='bi bi-exclamation-triangle me-2'></i>Registrar Observación
          </h5>
        }
        onClose={handleClose}
        footer={
          <>
            <button className='btn btn-secondary btn-sm' onClick={() => setStep('data')}>
              <i className='bi bi-arrow-left me-1'></i>Volver
            </button>
            <button className='btn btn-danger btn-sm' onClick={handleObserveSubmit}>
              <i className='bi bi-send me-1'></i>Registrar Observación
            </button>
          </>
        }
      >
        <div className='alert alert-warning py-2 mb-3'>
          <strong>Código:</strong> {data.codigo} &nbsp;|&nbsp;
          <strong>Empleado:</strong> {data.nombre_generador}
        </div>
        <label className='form-label fw-bold'>Motivos de la observación:</label>
        <textarea
          className={`form-control ${obsError ? 'is-invalid' : ''}`}
          rows={4}
          placeholder='Describa detalladamente los motivos de la observación...'
          value={observacion}
          onChange={(e) => {
            setObservacion(e.target.value)
            setObsError('')
          }}
          style={{resize: 'vertical'}}
          autoFocus
        />
        {obsError && <div className='invalid-feedback'>{obsError}</div>}
        <small className='text-muted mt-1 d-block'>
          <i className='bi bi-info-circle me-1'></i>
          La observación será registrada y notificada al empleado.
        </small>
      </BaseModal>
    )
  }

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
            <button className='btn btn-success btn-sm' onClick={() => handleAction('reception')}>
              <i className='bi bi-check-circle me-1'></i>Recepcionar Permiso
            </button>
          )}
          {accionesDisponibles.includes('observe') && (
            <button className='btn btn-danger btn-sm' onClick={() => setStep('observe')}>
              <i className='bi bi-exclamation-triangle me-1'></i>Observar
            </button>
          )}
          {accionesDisponibles.includes('approve') && (
            <button className='btn btn-success btn-sm' onClick={() => handleAction('approve')}>
              <i className='bi bi-check-circle me-1'></i>Aprobar Permiso
            </button>
          )}
        </>
      }
    >
      <EmpleadoInfo data={data} />

      <div className='bg-primary bg-opacity-10 p-3 rounded'>
        <h6 className='text-primary mb-2 fw-semibold'>
          <i className='bi bi-calendar-check me-2'></i>Detalles del Permiso
        </h6>
        <div className='row g-1 small'>
          <div className='col-4 fw-bold'>Código</div>
          <div className='col-8'>: {data.codigo}</div>

          {data.tipo_permiso_nombre && (
            <>
              <div className='col-4 fw-bold'>Tipo</div>
              <div className='col-8'>
                : <span className='badge badge-md bg-primary'>{data.tipo_permiso_nombre}</span>
              </div>
            </>
          )}

          <div className='col-4 fw-bold'>Fecha {data.fecha_fin ? 'inicio' : ''}</div>
          <div className='col-8'>: {formatToBolivianDate(data.fecha_inicio, {dateStyle: 'full'})}</div>

          {data.fecha_fin && (
            <>
              <div className='col-4 fw-bold'>Fecha fin</div>
              <div className='col-8'>: {formatToBolivianDate(data.fecha_fin, {dateStyle: 'full'})}</div>
            </>
          )}

          {data.turno_permiso && (
            <>
              <div className='col-4 fw-bold'>Turno</div>
              <div className='col-8'>
                : <span className='badge bg-secondary'>{data.turno_permiso}</span>
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

export default PermisoModal
