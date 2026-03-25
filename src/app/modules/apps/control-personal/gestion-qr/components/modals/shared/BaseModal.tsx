import React from 'react'

interface Props {
  title: React.ReactNode
  onClose: () => void
  children: React.ReactNode
  footer?: React.ReactNode
  size?: 'sm' | 'md' | 'lg'
}

const BaseModal: React.FC<Props> = ({title, onClose, children, footer, size = 'md'}) => {
  const widthMap = {sm: '400px', md: '580px', lg: '700px'}

  return (
    <>
      {/* Backdrop */}
      <div
        className='modal-backdrop fade show'
        style={{zIndex: 1050}}
        onClick={onClose}
      />
      {/* Modal */}
      <div
        className='modal fade show d-block'
        style={{zIndex: 1055}}
        role='dialog'
        aria-modal='true'
      >
        <div
          className='modal-dialog modal-dialog-centered modal-dialog-scrollable'
          style={{maxWidth: widthMap[size]}}
        >
          <div className='modal-content'>
            <div className='modal-header border-0 pb-0'>
              <div className='modal-title w-100 text-center'>{title}</div>
              <button
                type='button'
                className='btn-close'
                onClick={onClose}
                aria-label='Cerrar'
              />
            </div>

            <div className='modal-body pt-3'>{children}</div>

            {footer && <div className='modal-footer border-0 justify-content-center gap-3'>{footer}</div>}
          </div>
        </div>
      </div>
    </>
  )
}

export default BaseModal
