import React, {useCallback} from 'react'
import {ControlPanelProps} from '../../types'
// import { RelojTiempoReal } from '../RelojTiempoReal'

const formatDateTimeLocal = (date: Date): string => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day}T${hours}:${minutes}`
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  modoRecepcion,
  tipoPermiso,
  fechaHora,
  isPaused,
  loading,
  onModoRecepcionChange,
  onTipoPermisoChange,
  onFechaHoraChange,
  onPausedChange,
  onIngresoManual,
  onTimeUpdate,
}) => {
  const handleFechaChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onFechaHoraChange(e.target.value)
    },
    [onFechaHoraChange]
  )

  const handleSyncChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const nuevoPaused = !e.target.checked
      onPausedChange(nuevoPaused)

      if (e.target.checked) {
        const ahora = new Date()
        const fechaFormateada = formatDateTimeLocal(ahora)
        onFechaHoraChange(fechaFormateada)
        onTimeUpdate(ahora)
      }
    },
    [onPausedChange, onFechaHoraChange, onTimeUpdate]
  )

  return (
    <div className='card mb-6'>
      <div className='card-header border-0 bg-primary bg-opacity-10'>
        <h3 className='card-title text-primary fw-bold'>
          <i className='bi bi-sliders me-2'></i>
          Controles
        </h3>
      </div>
      <div className='card-body'>
        {/* Modo de Recepción */}
        <div className='row mb-4'>
          {/* Botón de ingreso manual */}
          {!loading && (
            <button
              onClick={onIngresoManual}
              className='btn btn-light-primary w-100 mb-3'
              disabled={loading}
            >
              <i className='bi bi-keyboard me-2'></i>
              Ingreso Manual de Código
            </button>
          )}

          {loading && (
            <div className='text-center p-3 bg-light rounded'>
              <div className='spinner-border text-primary mb-2' role='status'>
                <span className='visually-hidden'>Procesando...</span>
              </div>
              <p className='text-muted mb-0 small'>
                <i className='bi bi-hourglass-split me-1'></i>
                Procesando recepción...
              </p>
            </div>
          )}

          <hr className='my-4' />

          <div className='col-5'>
            <label className='form-label mb-0'>
              <i className='bi bi-gear me-1'></i>
              Recepción:
            </label>
          </div>
          <div className='col-7'>
            <select
              className='form-select form-select-sm'
              value={modoRecepcion}
              onChange={(e) => onModoRecepcionChange(e.target.value as any)}
            >
              <option value='automatico'>⚡ Automático</option>
              <option value='manual'>✋ Manual</option>
            </select>
          </div>
        </div>

        {/* Tipo de Permiso */}
        <div className='row mb-4'>
          <div className='col-5'>
            <label className='form-label mb-0'>
              <i className='bi bi-clock me-1'></i>
              Tipo:
            </label>
          </div>
          <div className='col-7'>
            <select
              className='form-select form-select-sm'
              value={tipoPermiso}
              onChange={(e) => onTipoPermisoChange(e.target.value as any)}
            >
              <option value='hora'>⏰ Permisos por hora</option>
              <option value='dia'>📅 Permisos por día</option>
            </select>
          </div>
        </div>

        {/* Separador visual */}
        <hr className='my-4' />

        {/* Fecha de Recepción */}
        <div className='mb-4'>
          <label htmlFor='fechaRecepcion' className='form-label mb-2 fw-semibold'>
            <i className='bi bi-calendar-event me-2'></i>
            Fecha de Recepción:
          </label>
          <input
            type='datetime-local'
            id='fechaRecepcion'
            className='form-control form-control-sm'
            value={fechaHora}
            onChange={handleFechaChange}
            disabled={!isPaused}
          />
          {!isPaused && (
            <small className='text-muted mt-1 d-block'>
              <i className='bi bi-info-circle me-1'></i>
              Sincronización automática activada
            </small>
          )}
        </div>

        {/* Sincronización */}
        <div className='d-flex justify-content-between align-items-center mb-4 p-3 bg-light rounded'>
          <div>
            <label className='form-label mb-0 fw-semibold' htmlFor='fechaRecepcionToggle'>
              <i className='bi bi-arrow-repeat me-2'></i>
              Sincronización automática
            </label>
            <small className='text-muted d-block'>
              {!isPaused ? 'Tiempo en vivo' : 'Fecha manual'}
            </small>
          </div>
          <div className='form-check form-switch'>
            <input
              className='form-check-input'
              type='checkbox'
              id='fechaRecepcionToggle'
              checked={!isPaused}
              onChange={handleSyncChange}
            />
          </div>
        </div>

        {/* Reloj en tiempo real */}
        {/* {!isPaused && (
          <div className='alert alert-info py-2 mb-4 d-flex align-items-center'>
            <i className='bi bi-clock me-2'></i>
            <div className='flex-grow-1'>
              <small className='mb-0'>
                <strong>Tiempo actual:</strong> {new Date().toLocaleString('es-BO')}
              </small>
            </div>
            <div className='badge bg-success'>
              <i className='bi bi-broadcast me-1'></i>
              En vivo
            </div>
          </div>
        )} */}

        {/* Separador visual */}
        {/* <hr className='my-4' /> */}

        {/* Botón de ingreso manual */}
        {/* <button
          onClick={onIngresoManual}
          className='btn btn-light-primary w-100 mb-3'
          disabled={loading}
        >
          <i className='bi bi-keyboard me-2'></i>
          Ingreso Manual de Código
        </button> */}

        {/* Indicador de carga */}
        {/* {loading && (
          <div className='text-center p-3 bg-light rounded'>
            <div className='spinner-border text-primary mb-2' role='status'>
              <span className='visually-hidden'>Procesando...</span>
            </div>
            <p className='text-muted mb-0 small'>
              <i className='bi bi-hourglass-split me-1'></i>
              Procesando recepción...
            </p>
          </div>
        )} */}

        {/* Estado de configuración actual */}
        <div className='mt-4'>
          <div className='bg-light p-3 rounded'>
            <h6 className='fw-bold text-gray-700 mb-2'>
              <i className='bi bi-info-circle me-2'></i>
              Configuración Actual
            </h6>
            <div className='row small'>
              <div className='col-6'>
                <div className='d-flex justify-content-between mb-1'>
                  <span className='text-muted'>Modo:</span>
                  <span
                    className={`badge ${
                      modoRecepcion === 'automatico' ? 'bg-success' : 'bg-primary'
                    }`}
                  >
                    {modoRecepcion === 'automatico' ? 'Auto' : 'Manual'}
                  </span>
                </div>
              </div>
              <div className='col-6'>
                <div className='d-flex justify-content-between mb-1'>
                  <span className='text-muted'>Tipo:</span>
                  <span
                    className={`badge ${
                      tipoPermiso === 'hora' ? 'badge-light-info' : 'badge-light-primary'
                    }`}
                  >
                    {tipoPermiso === 'hora' ? 'Permiso Hora' : 'Permisos Día'}
                  </span>
                </div>
              </div>
            </div>
            <div className='d-flex justify-content-between'>
              <span className='text-muted small'>Sincronización:</span>
              <span className={`badge ${!isPaused ? 'bg-success' : 'bg-secondary'}`}>
                <i className={`bi ${!isPaused ? 'bi-check-circle' : 'bi-pause-circle'} me-1`}></i>
                {!isPaused ? 'Activa' : 'Manual'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
