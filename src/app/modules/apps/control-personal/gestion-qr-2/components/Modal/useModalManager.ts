import { useState, useCallback } from 'react'
import { ModalState, UnifiedDocument } from '../../core/types'

/**
 * Hook para manejar el estado del modal de documentos
 * 
 * Uso:
 *   const { modalState, showModal, hideModal, setLoading } = useModalManager()
 */
export const useModalManager = () => {
  const [modalState, setModalState] = useState<ModalState>({
    show: false,
    document: null,
    loading: false
  })

  const showModal = useCallback((document: UnifiedDocument) => {
    setModalState({
      show: true,
      document,
      loading: false
    })
  }, [])

  const hideModal = useCallback(() => {
    setModalState({
      show: false,
      document: null,
      loading: false
    })
  }, [])

  const setLoading = useCallback((loading: boolean) => {
    setModalState(prev => ({
      ...prev,
      loading
    }))
  }, [])

  return {
    modalState,
    showModal,
    hideModal,
    setLoading
  }
}
