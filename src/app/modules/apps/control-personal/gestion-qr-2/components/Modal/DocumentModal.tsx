import React, { useEffect } from 'react'
import { Modal } from 'react-bootstrap'
import { DocumentModalProps } from '../../core/types'
import { ModalHeader } from './ModalHeader'
import { ModalBody } from './ModalBody'
import { ModalFooter } from './ModalFooter'
import { getDocumentTypeByKey } from '../../config/documentTypes.config'

/**
 * Modal principal para mostrar detalles de documentos
 * 
 * Usa Bootstrap 5 Modal component
 */
export const DocumentModal: React.FC<DocumentModalProps> = ({
  show,
  document,
  onHide,
  onAction,
  formatDate
}) => {
  // Si no hay documento, no renderizar
  if (!document) return null

  const config = getDocumentTypeByKey(document.tipo_documento)
  const stateConfig = config.states[document.estado]

  // Determinar botones según el estado
  const getButtons = () => {
    switch (document.estado) {
      case 'GENERADO':
      case 'ENVIADO':
        return [
          {
            label: `Recepcionar ${config.label}`,
            icon: 'bi-check-circle',
            variant: 'success' as const,
            action: 'reception' as const
          }
        ]

      case 'RECEPCIONADO':
        return [
          {
            label: `Aprobar ${config.label}`,
            icon: 'bi-check-circle',
            variant: 'success' as const,
            action: 'approve' as const
          },
          {
            label: `Observar ${config.label}`,
            icon: 'bi-exclamation-triangle',
            variant: 'danger' as const,
            action: 'observe' as const
          }
        ]

      case 'APROBADO':
        return [
          {
            label: 'Cerrar',
            icon: 'bi-x-circle',
            variant: 'secondary' as const,
            action: 'view' as const
          }
        ]

      // case 'OBSERVADO': // Descomentar si se necesita
      //   return [
      //     {
      //       label: 'Cerrar',
      //       icon: 'bi-x-circle',
      //       variant: 'secondary' as const,
      //       action: 'view' as const
      //     }
      //   ]

      default:
        return [
          {
            label: 'Cerrar',
            icon: 'bi-x-circle',
            variant: 'secondary' as const,
            action: 'view' as const
          }
        ]
    }
  }

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      centered
      backdrop="static"
      keyboard={false}
    >
      <ModalHeader document={document} onClose={onHide} />
      <ModalBody document={document} formatDate={formatDate} />
      <ModalFooter
        document={document}
        buttons={getButtons()}
        onAction={(action) => {
          onAction({ confirmed: true, action })
        }}
      />
    </Modal>
  )
}
