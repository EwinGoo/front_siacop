import { useState, useCallback } from 'react'
import { useDocumentProcessor } from '../context'
import { useDocumentActions } from './useDocumentActions'
import { useModalManager } from '../components/Modal'
import { QRResult, AccionDocumento, ModalActionResult } from '../core/types'
import { validateQRCode, QRCodeCache, extractCodeFromURL } from '../utils/qrUtils'

/**
 * Hook principal del Scanner QR - Refactorizado
 * 
 * Orquesta todo el flujo de escaneo y procesamiento
 */
export const useQRScanner = () => {
  const context = useDocumentProcessor()
  const { fetchDocument, executeAction } = useDocumentActions()
  const { modalState, showModal, hideModal, setLoading: setModalLoading } = useModalManager()
  
  const [qrCache] = useState(() => new QRCodeCache(5000))
  
  // Estados de feedback modals
  const [feedbackModal, setFeedbackModal] = useState<{
    loading: boolean
    success: boolean
    error: boolean
    title: string
    message: string
  }>({
    loading: false,
    success: false,
    error: false,
    title: '',
    message: ''
  })

  // Modal de observación
  const [observacionModal, setObservacionModal] = useState(false)

  // Modal de ingreso manual
  const [ingresoManualModal, setIngresoManualModal] = useState(false)

  /**
   * Maneja el código escaneado o ingresado manualmente
   */
  const handleQRDetected = useCallback(
    async (result: QRResult) => {
      try {
        const { code } = result
        
        // Validar código
        const validation = validateQRCode(code)
        if (!validation.isValid) {
          setFeedbackModal({
            loading: false,
            success: false,
            error: true,
            title: 'Código Inválido',
            message: validation.error || 'El código QR no es válido'
          })
          return
        }

        const cleanCode = extractCodeFromURL(code)

        // Verificar cache (evitar duplicados)
        if (qrCache.isRecentlyScanned(cleanCode)) {
          console.log('Código ya procesado recientemente:', cleanCode)
          return
        }

        qrCache.addCode(cleanCode)

        // Agregar al historial
        context.addToHistory(cleanCode, context.tipoPermiso)

        // Mostrar loading
        setFeedbackModal({
          loading: true,
          success: false,
          error: false,
          title: 'Procesando...',
          message: 'Obteniendo información del documento'
        })

        // Obtener documento
        const document = await fetchDocument(cleanCode)

        if (!document) {
          throw new Error('No se pudo obtener el documento')
        }

        // Cerrar loading
        setFeedbackModal(prev => ({ ...prev, loading: false }))

        // Si modo automático y estado es GENERADO/ENVIADO → recepcionar directamente
        if (
          context.modoRecepcion === 'automatico' &&
          (document.estado === 'GENERADO' || document.estado === 'ENVIADO')
        ) {
          await handleAutoReception(document)
        } else {
          // Modo manual o estado diferente → mostrar modal
          showModal(document)
        }
      } catch (error: any) {
        console.error('Error al procesar QR:', error)
        setFeedbackModal({
          loading: false,
          success: false,
          error: true,
          title: 'Error al Procesar',
          message: error.response?.data?.message || error.message || 'Error desconocido'
        })
      }
    },
    [context, fetchDocument, qrCache, showModal]
  )

  /**
   * Recepción automática
   */
  const handleAutoReception = async (document: any) => {
    try {
      setFeedbackModal({
        loading: true,
        success: false,
        error: false,
        title: 'Recepcionando...',
        message: 'Registrando recepción automática'
      })

      const result = await executeAction('reception', document, {
        fechaHora: context.fechaHora
      })

      setFeedbackModal({
        loading: false,
        success: true,
        error: false,
        title: '¡Recepción Exitosa!',
        message: result.message
      })
    } catch (error: any) {
      setFeedbackModal({
        loading: false,
        success: false,
        error: true,
        title: 'Error en Recepción',
        message: error.response?.data?.message || error.message
      })
    }
  }

  /**
   * Maneja las acciones desde el modal
   */
  const handleModalAction = async (actionResult: ModalActionResult) => {
    if (!modalState.document || !actionResult.action) return

    hideModal()

    try {
      const action = actionResult.action

      // Si es observar, mostrar modal de observación
      if (action === 'observe') {
        setObservacionModal(true)
        return
      }

      // Si es view, solo cerrar
      if (action === 'view') {
        return
      }

      // Ejecutar acción
      setFeedbackModal({
        loading: true,
        success: false,
        error: false,
        title: 'Procesando...',
        message: 'Ejecutando acción...'
      })

      const result = await executeAction(action, modalState.document, {
        fechaHora: context.fechaHora,
        observacion: actionResult.observacion
      })

      setFeedbackModal({
        loading: false,
        success: true,
        error: false,
        title: '¡Operación Exitosa!',
        message: result.message
      })
    } catch (error: any) {
      setFeedbackModal({
        loading: false,
        success: false,
        error: true,
        title: 'Error',
        message: error.response?.data?.message || error.message
      })
    }
  }

  /**
   * Maneja confirmación de observación
   */
  const handleObservacionConfirm = async (observacion: string) => {
    if (!modalState.document) return

    setObservacionModal(false)

    try {
      setFeedbackModal({
        loading: true,
        success: false,
        error: false,
        title: 'Registrando Observación...',
        message: 'Guardando en el sistema'
      })

      const result = await executeAction('observe', modalState.document, { observacion })

      setFeedbackModal({
        loading: false,
        success: true,
        error: false,
        title: 'Observación Registrada',
        message: result.message
      })
    } catch (error: any) {
      setFeedbackModal({
        loading: false,
        success: false,
        error: true,
        title: 'Error',
        message: error.response?.data?.message || error.message
      })
    }
  }

  /**
   * Ingreso manual de código
   */
  const handleIngresoManual = () => {
    setIngresoManualModal(true)
  }

  const handleIngresoManualConfirm = async (codigo: string) => {
    setIngresoManualModal(false)
    await handleQRDetected({ code: codigo, timestamp: Date.now() })
  }

  return {
    // Estado del context
    ...context,

    // Modal principal
    modalState,
    showModal,
    hideModal,

    // Modales de feedback
    feedbackModal,
    closeFeedbackModal: () => setFeedbackModal(prev => ({ ...prev, loading: false, success: false, error: false })),

    // Modal de observación
    observacionModal,
    closeObservacionModal: () => setObservacionModal(false),
    handleObservacionConfirm,

    // Modal de ingreso manual
    ingresoManualModal,
    closeIngresoManualModal: () => setIngresoManualModal(false),
    handleIngresoManualConfirm,

    // Handlers principales
    handleQRDetected,
    handleModalAction,
    handleIngresoManual
  }
}
