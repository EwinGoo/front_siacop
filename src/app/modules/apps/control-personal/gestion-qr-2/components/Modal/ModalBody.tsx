import React from 'react'
import { Modal } from 'react-bootstrap'
import { ModalBodyProps, ESTADO_STYLES } from '../../core/types'
import { getDocumentTypeByKey } from '../../config/documentTypes.config'
import { DeviceDetector } from 'src/app/utils/DeviceDetectop'

/**
 * Body del modal con información detallada del documento
 */
export const ModalBody: React.FC<ModalBodyProps> = ({ document, formatDate }) => {
  const config = getDocumentTypeByKey(document.tipo_documento)
  const isMobile = DeviceDetector.isMobile()

  return (
    <Modal.Body>
      {/* Información del Empleado */}
      {(document.nombre_generador || document.ci || document.nombre_cargo || document.tipo_personal || document.unidad) && (
        <div className="bg-light p-4 rounded mb-4">
          <h6 className="text-gray-700 mb-3 fw-semibold">
            <i className="bi bi-person-badge me-2"></i>
            Información del Empleado
          </h6>

          {document.nombre_generador && (
            <div className="row mb-2 text-start">
              <div className="col-3 fw-bold">Nombre</div>
              <div className="col-9">: {document.nombre_generador}</div>
            </div>
          )}

          {document.ci && (
            <div className="row mb-2 text-start">
              <div className="col-3 fw-bold">CI</div>
              <div className="col-9">: {document.ci}</div>
            </div>
          )}

          {document.nombre_cargo && (
            <div className="row mb-2 text-start">
              <div className="col-3 fw-bold">Cargo</div>
              <div className="col-9">: {document.nombre_cargo}</div>
            </div>
          )}

          {document.tipo_personal && (
            <div className="row mb-2 text-start">
              <div className="col-3 fw-bold" style={isMobile ? { padding: '0 0 0 10px' } : {}}>
                Tipo Personal
              </div>
              <div className="col-9">: {document.tipo_personal}</div>
            </div>
          )}

          {document.unidad && (
            <div className="row mb-2 text-start">
              <div className="col-3 fw-bold">Unidad</div>
              <div className="col-9">: {document.unidad}</div>
            </div>
          )}
        </div>
      )}

      {/* Detalles de la Solicitud */}
      <div className={`bg-${config.color} bg-opacity-10 p-4 rounded mb-4`}>
        <h6 className={`text-${config.color} mb-3 fw-semibold`}>
          <i className={`${config.icon} me-2`}></i>
          Detalles de la Solicitud
        </h6>

        <div className="row mb-2 text-start">
          <div className="col-3 fw-bold">Código</div>
          <div className="col-9">: {document.codigo}</div>
        </div>

        {document.tipo_permiso && (
          <div className="row mb-2 text-start">
            <div className="col-3 fw-bold">Tipo</div>
            <div className="col-9">
              : <span className={`badge ${config.badgeColor}`}>{document.tipo_permiso}</span>
            </div>
          </div>
        )}

        <div className="row mb-2 text-start">
          <div className="col-3 fw-bold">Fecha {document.fecha_fin ? 'inicio' : ''}</div>
          <div className="col-9">: {formatDate(document.fecha_inicio, { dateStyle: 'full' })}</div>
        </div>

        {document.fecha_fin && (
          <div className="row mb-2 text-start">
            <div className="col-3 fw-bold">Fecha fin</div>
            <div className="col-9">: {formatDate(document.fecha_fin, { dateStyle: 'full' })}</div>
          </div>
        )}

        {document.turno_permiso && (
          <div className="row mb-2 text-start">
            <div className="col-3 fw-bold">Turno</div>
            <div className="col-9">
              : <span className="badge bg-secondary">{document.turno_permiso}</span>
            </div>
          </div>
        )}

        {document.hora && (
          <div className="row mb-2 text-start">
            <div className="col-3 fw-bold">Hora</div>
            <div className="col-9">
              : <span className="badge bg-secondary">{document.hora}</span>
            </div>
          </div>
        )}

        {document.recorrido_de && (
          <div className="row mb-2 text-start">
            <div className="col-3 fw-bold">De</div>
            <div className="col-9">: {document.recorrido_de}</div>
          </div>
        )}

        {document.recorrido_a && (
          <div className="row mb-2 text-start">
            <div className="col-3 fw-bold">A</div>
            <div className="col-9">: {document.recorrido_a}</div>
          </div>
        )}

        {document.dias_solicitado && (
          <div className="row mb-2 text-start">
            <div className="col-3 fw-bold">Días</div>
            <div className="col-9">: {document.dias_solicitado} día(s)</div>
          </div>
        )}

        {document.numero_tramite && (
          <div className="row mb-2 text-start">
            <div className="col-3 fw-bold">Nº Trámite</div>
            <div className="col-9">: {document.numero_tramite}</div>
          </div>
        )}

        {document.descripcion && (
          <div className="row mb-2 text-start">
            <div className="col-3 fw-bold">{!isMobile ? 'Descripción' : 'Desc.'}</div>
            <div className="col-9">: {document.descripcion}</div>
          </div>
        )}

        {!isMobile && document.observacion && document.estado === 'RECEPCIONADO' && (
          <div className="row mb-2 text-start">
            <div className="col-3 fw-bold">Observación</div>
            <div className="col-9">: {document.observacion}</div>
          </div>
        )}

        <div className="row mb-2 text-start">
          <div className="col-3 fw-bold">Estado</div>
          <div className="col-9">
            :{' '}
            <span className={`badge badge-light-${ESTADO_STYLES[document.estado]} fs-7`}>
              <i className="bi bi-circle-fill me-1 fs-6 text-secondary"></i>
              {document.estado}
            </span>
          </div>
        </div>
      </div>
    </Modal.Body>
  )
}
