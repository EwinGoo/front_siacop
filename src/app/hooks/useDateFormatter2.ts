import {useMemo} from 'react'
import {format} from 'date-fns'
import {es} from 'date-fns/locale'

interface DateFormatterOptions {
  timeZone?: string
  locale?: string
  dateStyle?: 'full' | 'long' | 'medium' | 'short'
}

export const getLocalDateTime = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')

  return `${year}-${month}-${day}T${hours}:${minutes}`
}

export const getLocalDate = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

const useDateFormatter = () => {
  // Opciones por defecto para Bolivia
  const defaultOptions = {
    timeZone: 'America/La_Paz',
    locale: 'es-BO',
  }

  // Función auxiliar para ajustar desfase de zona horaria local
  const adjustToLocalTimezone = (dateObj: Date) => {
    return new Date(dateObj.getTime() + dateObj.getTimezoneOffset() * 60000)
  }

  /**
   * Formatea una fecha según las opciones
   * @param date Fecha en string (ISO) o Date
   * @param options Opciones de formato
   * @returns Fecha formateada según especificación
   */
  const formatToBolivianDate = (date: string | Date, options?: DateFormatterOptions): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    const adjustedDate = adjustToLocalTimezone(dateObj)

    if (!options?.dateStyle) {
      const day = adjustedDate.getDate().toString().padStart(2, '0')
      const month = (adjustedDate.getMonth() + 1).toString().padStart(2, '0')
      const year = adjustedDate.getFullYear()
      return `${day}/${month}/${year}`
    }

    return adjustedDate.toLocaleDateString(options?.locale || defaultOptions.locale, {
      timeZone: options?.timeZone || defaultOptions.timeZone,
      dateStyle: options.dateStyle,
      ...options,
    })
  }

  const formatLongDate = (date: string | Date) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    const adjustedDate = adjustToLocalTimezone(dateObj)
    return format(adjustedDate, "d 'de' MMMM 'de' yyyy", {locale: es})
  }

  const formatTime = (date: string | Date, withSeconds = false): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    const adjustedDate = adjustToLocalTimezone(dateObj)
    const formatStr = withSeconds ? 'HH:mm:ss' : 'HH:mm'
    return format(adjustedDate, formatStr, {locale: es})
  }

  const formatTimeFromString = (timeStr: string): string => {
    if (!timeStr) return ''
    const match = timeStr.match(/^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/)
    if (!match) {
      console.error('Hora inválida:', timeStr)
      return ''
    }
    return timeStr.substring(0, 5)
  }

  return useMemo(
    () => ({formatToBolivianDate, formatLongDate, formatTime, formatTimeFromString}),
    []
  )
}

export default useDateFormatter
