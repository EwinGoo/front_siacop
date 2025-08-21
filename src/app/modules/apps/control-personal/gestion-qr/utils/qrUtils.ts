/**
 * Utilidades para el manejo de códigos QR
 */

export interface QRValidationResult {
  isValid: boolean
  error?: string
  extractedCode?: string
}

export interface QRCacheEntry {
  code: string
  timestamp: number
  count: number
}

// Utilidad para limpiar Map de forma compatible
const cleanupMapEntries = <K, V>(
  map: Map<K, V>,
  shouldDelete: (value: V, key: K) => boolean
): void => {
  const keysToDelete: K[] = []
  map.forEach((value, key) => {
    if (shouldDelete(value, key)) {
      keysToDelete.push(key)
    }
  })
  keysToDelete.forEach(key => map.delete(key))
}

// Convertir Map a Array de forma segura
const mapToArray = <K, V>(map: Map<K, V>): Array<[K, V]> => {
  const result: Array<[K, V]> = []
  map.forEach((value, key) => {
    result.push([key, value])
  })
  return result
}

/**
 * Clase para manejar el cache de códigos QR escaneados
 */
export class QRCodeCache {
  private cache: Map<string, QRCacheEntry> = new Map()
  private readonly maxAge: number
  private readonly maxEntries: number

  constructor(maxAge: number = 5000, maxEntries: number = 100) {
    this.maxAge = maxAge
    this.maxEntries = maxEntries
  }

  /**
   * Verifica si un código fue escaneado recientemente
   */
  isRecentlyScanned(code: string): boolean {
    const entry = this.cache.get(code)
    if (!entry) return false

    const now = Date.now()
    if (now - entry.timestamp > this.maxAge) {
      this.cache.delete(code)
      return false
    }

    return true
  }

  /**
   * Agrega un código al cache
   */
  addCode(code: string): void {
    const now = Date.now()
    const existing = this.cache.get(code)

    if (existing) {
      existing.timestamp = now
      existing.count += 1
    } else {
      this.cache.set(code, {
        code,
        timestamp: now,
        count: 1
      })
    }

    this.cleanup()
  }

  /**
   * Limpia entradas antigas del cache
   */
  private cleanup(): void {
    const now = Date.now()
    
    // Remover entradas expiradas - Compatible con TypeScript
    cleanupMapEntries(this.cache, (entry) => {
      return now - entry.timestamp > this.maxAge
    })

    // Mantener solo las más recientes si excede el límite
    if (this.cache.size > this.maxEntries) {
      const entries = mapToArray(this.cache)
        .sort((a, b) => b[1].timestamp - a[1].timestamp)
        .slice(0, this.maxEntries)

      this.cache.clear()
      entries.forEach(([key, value]) => {
        this.cache.set(key, value)
      })
    }
  }

  /**
   * Obtiene estadísticas del cache
   */
  getStats() {
    const entries: QRCacheEntry[] = []
    this.cache.forEach((value) => {
      entries.push(value)
    })
    
    return {
      totalEntries: this.cache.size,
      maxAge: this.maxAge,
      maxEntries: this.maxEntries,
      entries: entries
    }
  }

  /**
   * Limpia completamente el cache
   */
  clear(): void {
    this.cache.clear()
  }
}

/**
 * Extrae el código de una URL o devuelve el texto tal como está
 */
export const extractCodeFromURL = (input: string): string => {
  try {
    // Si contiene '/', obtener la última parte
    if (input.includes('/')) {
      const parts = input.split('/')
      return parts[parts.length - 1].trim()
    }
    
    // Si contiene '?', obtener solo la parte antes de los parámetros
    if (input.includes('?')) {
      return input.split('?')[0].trim()
    }
    
    return input.trim()
  } catch (error) {
    console.error('Error al extraer código:', error)
    return input
  }
}

/**
 * Valida el formato de un código QR
 */
export const validateQRCode = (code: string): QRValidationResult => {
  if (!code || typeof code !== 'string') {
    return {
      isValid: false,
      error: 'Código vacío o inválido'
    }
  }

  const trimmedCode = code.trim()

  if (trimmedCode.length < 3) {
    return {
      isValid: false,
      error: 'El código debe tener al menos 3 caracteres'
    }
  }

  if (trimmedCode.length > 50) {
    return {
      isValid: false,
      error: 'El código es demasiado largo'
    }
  }

  // Validar caracteres permitidos (alfanuméricos, guiones, puntos)
  const validPattern = /^[a-zA-Z0-9\-_.]+$/
  if (!validPattern.test(trimmedCode)) {
    return {
      isValid: false,
      error: 'El código contiene caracteres no válidos'
    }
  }

  return {
    isValid: true,
    extractedCode: trimmedCode
  }
}

/**
 * Parsea el contenido de un QR que puede ser JSON o texto plano
 */
export const parseQRContent = (content: string): any => {
  try {
    // Intentar parsear como JSON
    return JSON.parse(content)
  } catch {
    // Si no es JSON válido, devolver como objeto con código
    const extractedCode = extractCodeFromURL(content)
    return {
      code: extractedCode,
      rawContent: content,
      type: 'text'
    }
  }
}

/**
 * Formateador de fecha para mostrar en la UI
 */
export const formatTimestamp = (timestamp: number, locale: string = 'es-BO'): string => {
  const date = new Date(timestamp)
  return date.toLocaleString(locale, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

/**
 * Calcula el tiempo transcurrido desde un timestamp
 */
export const getTimeAgo = (timestamp: number, locale: string = 'es'): string => {
  const now = Date.now()
  const diff = now - timestamp
  
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 0) {
    return `hace ${days} día${days > 1 ? 's' : ''}`
  } else if (hours > 0) {
    return `hace ${hours} hora${hours > 1 ? 's' : ''}`
  } else if (minutes > 0) {
    return `hace ${minutes} minuto${minutes > 1 ? 's' : ''}`
  } else {
    return 'hace unos segundos'
  }
}

/**
 * Genera un ID único para el contenedor del QR reader
 */
export const generateQRReaderId = (prefix: string = 'qr-reader'): string => {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substr(2, 9)
  return `${prefix}-${timestamp}-${random}`
}

/**
 * Detecta el tipo de dispositivo para optimizar la configuración del QR reader
 */
export const getDeviceType = (): 'mobile' | 'tablet' | 'desktop' => {
  const width = window.innerWidth
  
  if (width < 768) {
    return 'mobile'
  } else if (width < 1024) {
    return 'tablet'
  } else {
    return 'desktop'
  }
}

/**
 * Obtiene la configuración óptima del QR reader según el dispositivo
 */
export const getOptimalQRConfig = () => {
  const deviceType = getDeviceType()
  
  const baseConfig = {
    fps: 10,
    experimentalFeatures: {
      useBarCodeDetectorIfSupported: true
    }
  }

  switch (deviceType) {
    case 'mobile':
      return {
        ...baseConfig,
        qrbox: { width: 220, height: 220 },
        aspectRatio: 1.0
      }
    case 'tablet':
      return {
        ...baseConfig,
        qrbox: { width: 280, height: 280 },
        aspectRatio: 1.0
      }
    default:
      return {
        ...baseConfig,
        qrbox: { width: 320, height: 320 },
        aspectRatio: 1.0
      }
  }
}

/**
 * Maneja errores comunes del QR reader
 */
export const handleQRError = (error: any): string => {
  const errorMessage = error?.message || error?.toString() || 'Error desconocido'
  
  if (errorMessage.includes('Permiso denegado')) {
    return 'No se pudo acceder a la cámara. Verifique los permisos.'
  }
  
  if (errorMessage.includes('NotFoundError')) {
    return 'No se encontró una cámara disponible.'
  }
  
  if (errorMessage.includes('NotReadableError')) {
    return 'La cámara está siendo usada por otra aplicación.'
  }
  
  if (errorMessage.includes('OverconstrainedError')) {
    return 'La configuración de la cámara no es compatible.'
  }
  
  if (errorMessage.includes('NotAllowedError')) {
    return 'Acceso a la cámara denegado por el usuario.'
  }
  
  return 'Error al inicializar la cámara. Inténtelo nuevamente.'
}

/**
 * Almacenamiento local para configuraciones del QR reader
 */
export class QRSettingsStorage {
  private static readonly STORAGE_KEY = 'qr_reader_settings'

  static save(settings: any): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(settings))
    } catch (error) {
      console.warn('No se pudo guardar la configuración:', error)
    }
  }

  static load(): any {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY)
      return stored ? JSON.parse(stored) : {}
    } catch (error) {
      console.warn('No se pudo cargar la configuración:', error)
      return {}
    }
  }

  static clear(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY)
    } catch (error) {
      console.warn('No se pudo limpiar la configuración:', error)
    }
  }
}