export const formatTimeFromString = (timeStr: string): string => {
    if (!timeStr) return ''
    const match = timeStr.match(/^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/)
    if (!match) {
      console.error('Hora inválida:', timeStr)
      return ''
    }
    return timeStr.substring(0, 5)
  }