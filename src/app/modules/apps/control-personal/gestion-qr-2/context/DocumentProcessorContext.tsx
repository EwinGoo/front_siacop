import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { TipoPermiso, ModoRecepcion, UnifiedDocument } from '../core/types'

/**
 * Estado del Context
 */
interface DocumentProcessorState {
  // Configuración
  modoRecepcion: ModoRecepcion
  tipoPermiso: TipoPermiso
  fechaHora: string
  isPaused: boolean
  loading: boolean

  // Historial
  lastScanned: {
    code: string
    tipoPermiso: string
    timestamp: number
  } | null
  scannedHistory: Array<{
    code: string
    timestamp: number
    tipoPermiso: string
  }>

  // Documento actual
  currentDocument: UnifiedDocument | null
}

/**
 * Acciones del Context
 */
interface DocumentProcessorActions {
  setModoRecepcion: (modo: ModoRecepcion) => void
  setTipoPermiso: (tipo: TipoPermiso) => void
  setFechaHora: (fecha: string) => void
  setIsPaused: (paused: boolean) => void
  setLoading: (loading: boolean) => void
  setCurrentDocument: (doc: UnifiedDocument | null) => void
  addToHistory: (code: string, tipoPermiso: string) => void
  clearHistory: () => void
  actualizarTiempo: (date: Date) => void
}

/**
 * Tipo completo del Context
 */
type DocumentProcessorContextType = DocumentProcessorState & DocumentProcessorActions

const DocumentProcessorContext = createContext<DocumentProcessorContextType | undefined>(undefined)

/**
 * Props del Provider
 */
interface DocumentProcessorProviderProps {
  children: ReactNode
}

/**
 * Provider del Context
 */
export const DocumentProcessorProvider: React.FC<DocumentProcessorProviderProps> = ({ children }) => {
  const [state, setState] = useState<DocumentProcessorState>({
    modoRecepcion: 'automatico',
    tipoPermiso: 'hora',
    fechaHora: formatDateTimeLocal(new Date()),
    isPaused: false,
    loading: false,
    lastScanned: null,
    scannedHistory: [],
    currentDocument: null
  })

  // Acciones
  const setModoRecepcion = useCallback((modo: ModoRecepcion) => {
    setState(prev => ({ ...prev, modoRecepcion: modo }))
  }, [])

  const setTipoPermiso = useCallback((tipo: TipoPermiso) => {
    setState(prev => ({ ...prev, tipoPermiso: tipo }))
  }, [])

  const setFechaHora = useCallback((fecha: string) => {
    setState(prev => ({ ...prev, fechaHora: fecha }))
  }, [])

  const setIsPaused = useCallback((paused: boolean) => {
    setState(prev => ({ ...prev, isPaused: paused }))
  }, [])

  const setLoading = useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, loading }))
  }, [])

  const setCurrentDocument = useCallback((doc: UnifiedDocument | null) => {
    setState(prev => ({ ...prev, currentDocument: doc }))
  }, [])

  const addToHistory = useCallback((code: string, tipoPermiso: string) => {
    setState(prev => {
      const newEntry = {
        code,
        timestamp: Date.now(),
        tipoPermiso
      }

      return {
        ...prev,
        lastScanned: newEntry,
        scannedHistory: [newEntry, ...prev.scannedHistory].slice(0, 10) // Solo últimos 10
      }
    })
  }, [])

  const clearHistory = useCallback(() => {
    setState(prev => ({
      ...prev,
      lastScanned: null,
      scannedHistory: []
    }))
  }, [])

  const actualizarTiempo = useCallback((date: Date) => {
    setState(prev => ({
      ...prev,
      fechaHora: formatDateTimeLocal(date)
    }))
  }, [])

  const value: DocumentProcessorContextType = {
    ...state,
    setModoRecepcion,
    setTipoPermiso,
    setFechaHora,
    setIsPaused,
    setLoading,
    setCurrentDocument,
    addToHistory,
    clearHistory,
    actualizarTiempo
  }

  return (
    <DocumentProcessorContext.Provider value={value}>
      {children}
    </DocumentProcessorContext.Provider>
  )
}

/**
 * Hook para usar el Context
 */
export const useDocumentProcessor = () => {
  const context = useContext(DocumentProcessorContext)
  
  if (context === undefined) {
    throw new Error('useDocumentProcessor must be used within DocumentProcessorProvider')
  }
  
  return context
}

// Helper function
function formatDateTimeLocal(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day}T${hours}:${minutes}`
}
