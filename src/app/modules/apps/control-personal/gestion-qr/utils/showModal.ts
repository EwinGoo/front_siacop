import React from 'react'
import ReactDOM from 'react-dom/client'
import {ModuleModalProps, ModuleModalResult} from '../modules/types'
import {UnifiedData} from '../types'

/**
 * Monta un modal React de forma imperativa y devuelve una Promise con el resultado.
 * Reemplaza el patrón Swal para modales con datos complejos.
 */
export async function showModal(
  ModalComponent: React.ComponentType<ModuleModalProps>,
  props: Omit<ModuleModalProps, 'onClose'>
): Promise<ModuleModalResult> {
  return new Promise<ModuleModalResult>((resolve) => {
    const container = document.createElement('div')
    document.body.appendChild(container)
    const root = ReactDOM.createRoot(container)

    const handleClose = (result: ModuleModalResult) => {
      root.unmount()
      if (document.body.contains(container)) {
        document.body.removeChild(container)
      }
      resolve(result)
    }

    root.render(
      React.createElement(ModalComponent, {...props, onClose: handleClose})
    )
  })
}
