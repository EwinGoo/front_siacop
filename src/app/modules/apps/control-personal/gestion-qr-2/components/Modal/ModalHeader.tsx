import React from 'react'
import { Modal } from 'react-bootstrap'
import { ModalHeaderProps } from '../../core/types'
import { getDocumentTypeByKey } from '../../config/documentTypes.config'

/**
 * Header del modal con título, icono y botón de cerrar
 */
export const ModalHeader: React.FC<ModalHeaderProps> = ({ document, onClose }) => {
  const config = getDocumentTypeByKey(document.tipo_documento)

  return (
    <Modal.Header closeButton onHide={onClose} className={`bg-${config.color} bg-opacity-10`}>
      <Modal.Title className={`text-${config.color} fw-bold text-uppercase`}>
        <i className={`${config.icon} me-2`}></i>
        {config.label}
        {document.nro_correlativo && (
          <div className="fs-6 fw-normal mt-1">
            Nº CORRELATIVO: {document.nro_correlativo}
          </div>
        )}
      </Modal.Title>
    </Modal.Header>
  )
}
