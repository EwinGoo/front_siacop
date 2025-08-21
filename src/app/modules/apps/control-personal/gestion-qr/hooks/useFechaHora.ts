import { useState, useCallback } from 'react'

// Función utilitaria FUERA del hook para evitar problemas de hoisting
const formatDateTimeLocal = (date: Date): string => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day}T${hours}:${minutes}`
}

export const useFechaHora = () => {
  // Ahora formatDateTimeLocal ya está declarada y disponible
  const [fechaHora, setFechaHoraState] = useState(() => {
    const ahora = new Date()
    return formatDateTimeLocal(ahora)
  })
  const [isPaused, setIsPaused] = useState(false)

  const setFechaHora = useCallback((nuevaFecha: string) => {
    setFechaHoraState(nuevaFecha)
  }, [])

  const actualizarTiempo = useCallback((date: Date) => {
    const fechaFormateada = formatDateTimeLocal(date)
    setFechaHoraState(fechaFormateada)
  }, [])

  return {
    fechaHora,
    isPaused,
    setFechaHora,
    setIsPaused,
    actualizarTiempo,
    formatDateTimeLocal, // Exportamos la función para uso externo si es necesario
  }
}