import React, { useState } from 'react'
import { Modal, Button, Form } from 'react-bootstrap'
import { UnifiedDocument } from '../../core/types'
import { getDocumentTypeByKey } from '../../config/documentTypes.config'

interface ObservacionModalProps {
  show: boolean
  document: UnifiedDocument | null
  onConfirm: (observacion: string) => void
  onCancel: () => void
}

/**
 * Modal para registrar observaciones en documentos
 */
export const ObservacionModal: React.FC<ObservacionModalProps> = ({
  show,
  document,
  onConfirm,
  onCancel
}) => {
  const [observacion, setObservacion] = useState('')
  const [error, setError] = useState('')

  if (!document) return null

  const config = getDocumentTypeByKey(document.tipo_documento)

  const handleConfirm = () => {
    if (!observacion.trim()) {
      setError('La observación es requerida')
      return
    }

    if (observacion.trim().length < 10) {
      setError('La observación debe tener al menos 10 caracteres')
      return
    }

    onConfirm(observacion.trim())
    setObservacion('')
    setError('')
  }

  const handleCancel = () => {
    setObservacion('')
    setError('')
    onCancel()
  }

  return (
    <Modal show={show} onHide={handleCancel} size="lg" centered>
      <Modal.Header closeButton className="bg-warning bg-opacity-10">
        <Modal.Title className="text-warning fw-bold">
          <i className="bi bi-exclamation-triangle me-2"></i>
          Registrar Observación - {config.label}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div className="alert alert-warning">
          <div className="row">
            <div className="col-12">
              <strong>
                <i className={`${config.icon} me-2 text-warning`}></i>
                Código {config.label}:
              </strong>{' '}
              {document.codigo}
            </div>
            <div className="col-8 mt-3">
              <strong>
                <i className="bi bi-person me-2 text-warning"></i>
                Empleado:
              </strong>{' '}
              {document.nombre_generador}
            </div>
            <div className="col-4 mt-3">
              <strong>
                <i className="bi bi-card-text me-2 text-warning"></i>
                CI:
              </strong>{' '}
              {document.ci}
            </div>
          </div>
          {document.tipo_permiso && (
            <div className="row mt-2">
              <div className="col-12">
                <strong>
                  <i className="bi bi-tag me-2 text-warning"></i>
                  Tipo:
                </strong>{' '}
                {document.tipo_permiso}
              </div>
            </div>
          )}
        </div>

        <Form.Group>
          <Form.Label className="fw-bold">Motivos de la observación:</Form.Label>
          <Form.Control
            as="textarea"
            rows={4}
            placeholder="Describa detalladamente los motivos de la observación..."
            value={observacion}
            onChange={(e) => {
              setObservacion(e.target.value)
              setError('')
            }}
            isInvalid={!!error}
            style={{ minHeight: '120px', resize: 'vertical' }}
          />
          <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>
          <Form.Text className="text-muted">
            <i className="bi bi-info-circle me-1"></i>
            La observación será registrada en el sistema y notificada al empleado.
          </Form.Text>
        </Form.Group>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={handleCancel}>
          <i className="bi bi-x-circle me-2"></i>
          Cancelar
        </Button>
        <Button variant="danger" onClick={handleConfirm}>
          <i className="bi bi-send me-2"></i>
          Registrar Observación
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
