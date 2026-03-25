import React from 'react'
import { Modal, Button } from 'react-bootstrap'
import { ModalFooterProps } from '../../core/types'

/**
 * Footer del modal con botones de acción
 */
export const ModalFooter: React.FC<ModalFooterProps> = ({ document, buttons, onAction }) => {
  return (
    <Modal.Footer>
      {buttons.map((button, index) => (
        <Button
          key={index}
          variant={button.variant}
          onClick={() => onAction(button.action)}
          className={button.className}
        >
          <i className={`${button.icon} me-2`}></i>
          {button.label}
        </Button>
      ))}
    </Modal.Footer>
  )
}
