// utils/DeviceDetector.ts
// Utilidad universal para detectar dispositivos - NO depende de React

export enum DeviceType {
  MOBILE = 'MOBILE',
  TABLET = 'TABLET',
  DESKTOP = 'DESKTOP'
}

export enum BreakpointType {
  XS = 'XS',    // < 576px
  SM = 'SM',    // 576px - 767px
  MD = 'MD',    // 768px - 991px
  LG = 'LG',    // 992px - 1199px
  XL = 'XL'     // >= 1200px
}

export class DeviceDetector {
  private static instance: DeviceDetector
  private listeners: Array<() => void> = []

  private constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', this.handleResize.bind(this))
    }
  }

  static getInstance(): DeviceDetector {
    if (!DeviceDetector.instance) {
      DeviceDetector.instance = new DeviceDetector()
    }
    return DeviceDetector.instance
  }

  private handleResize() {
    this.listeners.forEach(listener => listener())
  }

  // Método principal - detecta si es móvil
  static isMobile(): boolean {
    if (typeof window === 'undefined') return false
    
    const userAgent = navigator.userAgent || navigator.vendor
    const isMobileUA = /android|webos|iphone|ipod|blackberry|iemobile|opera mini/i.test(userAgent)
    const isSmallScreen = window.innerWidth <= 768
    
    return isMobileUA || isSmallScreen
  }

  // Detecta tipo de dispositivo completo
  static getDeviceType(): DeviceType {
    if (typeof window === 'undefined') return DeviceType.DESKTOP
    
    const userAgent = navigator.userAgent || navigator.vendor
    const width = window.innerWidth
    
    const isMobileUA = /android|webos|iphone|ipod|blackberry|iemobile|opera mini/i.test(userAgent)
    const isTabletUA = /ipad|tablet|playbook|silk/i.test(userAgent)
    
    if (width <= 768 || isMobileUA) return DeviceType.MOBILE
    if (width <= 1024 || isTabletUA) return DeviceType.TABLET
    return DeviceType.DESKTOP
  }

  // Detecta breakpoint específico
  static getBreakpoint(): BreakpointType {
    if (typeof window === 'undefined') return BreakpointType.LG
    
    const width = window.innerWidth
    
    if (width < 576) return BreakpointType.XS
    if (width < 768) return BreakpointType.SM
    if (width < 992) return BreakpointType.MD
    if (width < 1200) return BreakpointType.LG
    return BreakpointType.XL
  }

  // Versión simple que devuelve string
  static getDevice(): 'mobile' | 'tablet' | 'desktop' {
    const deviceType = this.getDeviceType()
    return deviceType.toLowerCase() as 'mobile' | 'tablet' | 'desktop'
  }

  // Para obtener el ancho actual
  static getWidth(): number {
    return typeof window !== 'undefined' ? window.innerWidth : 1920
  }

  // Para obtener la altura actual
  static getHeight(): number {
    return typeof window !== 'undefined' ? window.innerHeight : 1080
  }

  // Método para suscribirse a cambios (si necesitas reactividad)
  onResize(callback: () => void): () => void {
    this.listeners.push(callback)
    
    // Retorna función para desuscribirse
    return () => {
      const index = this.listeners.indexOf(callback)
      if (index > -1) {
        this.listeners.splice(index, 1)
      }
    }
  }

  // Limpia todos los listeners
  destroy() {
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', this.handleResize.bind(this))
    }
    this.listeners = []
  }
}

// Funciones de conveniencia (shortcuts)
export const isMobile = () => DeviceDetector.isMobile()
export const getDeviceType = () => DeviceDetector.getDeviceType()
export const getBreakpoint = () => DeviceDetector.getBreakpoint()
export const getDevice = () => DeviceDetector.getDevice()

// Para tu UnifiedModalService
export class ModalConfigHelper {
  static getModalConfig(deviceType?: DeviceType) {
    const device = deviceType || DeviceDetector.getDeviceType()
    
    switch (device) {
      case DeviceType.MOBILE:
        return {
          width: '100%',
          height: '100vh',
          padding: '15px',
          fullscreen: true,
          showCloseButton: false
        }
      
      case DeviceType.TABLET:
        return {
          width: '80%',
          maxWidth: '600px',
          padding: '25px',
          fullscreen: false,
          showCloseButton: true
        }
      
      case DeviceType.DESKTOP:
      default:
        return {
          width: '700px',
          maxWidth: '90%',
          padding: '35px',
          fullscreen: false,
          showCloseButton: true
        }
    }
  }
}