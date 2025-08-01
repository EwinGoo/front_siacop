export const truncateText = (text: string, maxLength: number = 25): string => {
  if (!text) return ''
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
}
