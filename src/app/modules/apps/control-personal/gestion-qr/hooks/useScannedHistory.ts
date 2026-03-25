import {useState, useCallback} from 'react'
import {TipoPermiso} from '../types'

const STORAGE_KEY = 'siacop_qr_scan_history'
const MAX_ITEMS = 20

export type HistoryItem = {
  code: string
  timestamp: number
  tipoPermiso: string
}

function isToday(timestamp: number): boolean {
  const d = new Date(timestamp)
  const now = new Date()
  return (
    d.getDate() === now.getDate() &&
    d.getMonth() === now.getMonth() &&
    d.getFullYear() === now.getFullYear()
  )
}

function loadFromStorage(): HistoryItem[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return []
    const parsed: HistoryItem[] = JSON.parse(stored)
    return parsed.filter((item) => isToday(item.timestamp))
  } catch {
    return []
  }
}

function saveToStorage(items: HistoryItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  } catch {
    // localStorage lleno o deshabilitado — falla silenciosamente
  }
}

export function useScannedHistory() {
  const [scannedHistory, setScannedHistory] = useState<HistoryItem[]>(() => loadFromStorage())
  const [lastScanned, setLastScanned] = useState<HistoryItem | null>(() => {
    const history = loadFromStorage()
    return history.length > 0 ? history[0] : null
  })

  const addToHistory = useCallback((code: string, timestamp: number, tipoPermiso: TipoPermiso | string) => {
    const newItem: HistoryItem = {code, timestamp, tipoPermiso}
    setLastScanned(newItem)
    setScannedHistory((prev) => {
      const updated = [newItem, ...prev.slice(0, MAX_ITEMS - 1)]
      saveToStorage(updated)
      return updated
    })
  }, [])

  return {scannedHistory, lastScanned, addToHistory}
}
