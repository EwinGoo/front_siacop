import React from 'react'
import { Modal, Button, Spinner } from 'react-bootstrap'

// ============= LOADING MODAL =============
interface LoadingModalProps {
  show: boolean
  message?: string
}

export const LoadingModal: React.FC<LoadingModalProps> = ({ show, message = 'Procesando...' }) => {
  return (
    <Modal show={show} centered backdrop="static" keyboard={false} size="sm">
      <Modal.Body className="text-center py-5">
        <Spinner animation="border" variant="primary" style={{ width: '3rem', height: '3rem' }} />
        <p className="mt-3 mb-0 fw-bold">{message}</p>
      </Modal.Body>
    </Modal>
  )
}

// ============= SUCCESS MODAL =============
interface SuccessModalProps {
  show: boolean
  title: string
  message: string
  onClose: () => void
}

export const SuccessModal: React.FC<SuccessModalProps> = ({ show, title, message, onClose }) => {
  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton className="bg-success bg-opacity-10">
        <Modal.Title className="text-success fw-bold">
          <i className="bi bi-check-circle me-2"></i>
          {title}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="alert alert-success mb-0">
          <p className="mb-0">{message}</p>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="success" onClick={onClose}>
          <i className="bi bi-arrow-right me-2"></i>
          Continuar
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

// ============= ERROR MODAL =============
interface ErrorModalProps {
  show: boolean
  title: string
  message: string
  onClose: () => void
}

export const ErrorModal: React.FC<ErrorModalProps> = ({ show, title, message, onClose }) => {
  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton className="bg-danger bg-opacity-10">
        <Modal.Title className="text-danger fw-bold">
          <i className="bi bi-exclamation-triangle me-2"></i>
          {title}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="alert alert-danger mb-0">
          <h6 className="alert-heading">
            <i className="bi bi-x-circle me-2"></i>
            Detalles del Error
          </h6>
          <hr />
          <p className="mb-0" dangerouslySetInnerHTML={{ __html: message }} />
        </div>
        <small className="text-muted d-block mt-2">
          <i className="bi bi-info-circle me-1"></i>
          Si el problema persiste, contacte al administrador del sistema.
        </small>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={onClose}>
          <i className="bi bi-arrow-clockwise me-2"></i>
          Entendido
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

// ============= INGRESO MANUAL MODAL =============
interface IngresoManualModalProps {
  show: boolean
  onConfirm: (codigo: string) => void
  onCancel: () => void
}

export const IngresoManualModal: React.FC<IngresoManualModalProps> = ({
  show,
  onConfirm,
  onCancel
}) => {
  const [codigo, setCodigo] = React.useState('')
  const [error, setError] = React.useState('')

  const handleConfirm = () => {
    if (!codigo) {
      setError('Debe ingresar un código')
      return
    }

    if (!/^[CP]\d+$/.test(codigo)) {
      setError('El código debe empezar con C o P seguido de números (ej: C23, P456)')
      return
    }

    if (codigo.length < 2 || codigo.length > 11) {
      setError('El código debe tener entre 2 y 11 caracteres (ej: C1 hasta P1234567890)')
      return
    }

    const numberPart = codigo.substring(1)
    if (numberPart.length < 1 || numberPart.length > 10) {
      setError('La parte numérica debe tener entre 1 y 10 dígitos')
      return
    }

    onConfirm(codigo)
    setCodigo('')
    setError('')
  }

  const handleCancel = () => {
    setCodigo('')
    setError('')
    onCancel()
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleConfirm()
    }
  }

  return (
    <Modal show={show} onHide={handleCancel} centered>
      <Modal.Header closeButton className="bg-primary bg-opacity-10">
        <Modal.Title className="text-primary fw-bold">
          <i className="bi bi-keyboard me-2"></i>
          Ingreso Manual de Código
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="mb-3">
          <label htmlFor="codigoInput" className="form-label fw-bold">
            Código de la solicitud
          </label>
          <input
            type="text"
            id="codigoInput"
            className={`form-control form-control-lg ${error ? 'is-invalid' : ''}`}
            placeholder="Ej: C123 o P456"
            value={codigo}
            onChange={(e) => {
              setCodigo(e.target.value.toUpperCase())
              setError('')
            }}
            onKeyPress={handleKeyPress}
            autoFocus
            style={{ fontSize: '1.2rem', textAlign: 'center', letterSpacing: '2px' }}
          />
          {error && <div className="invalid-feedback">{error}</div>}
          <small className="text-muted mt-2 d-block">
            <i className="bi bi-info-circle me-1"></i>
            Ingrese el código con prefijo (C para comisión, P para permiso, V para vacación)
          </small>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCancel}>
          <i className="bi bi-x-circle me-2"></i>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleConfirm}>
          <i className="bi bi-search me-2"></i>
          Buscar Solicitud
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
